import {
  Component, Input, Output, EventEmitter, OnChanges, AfterViewInit,
  OnDestroy, SimpleChanges, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasNode, CanvasEdge } from '../../models/learning-path.model';
import { ContentComponent } from '../../models/component.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLDivElement>;

  @Input() nodes: CanvasNode[] = [];
  @Input() edges: CanvasEdge[] = [];
  @Input() mode: 'builder' | 'preview' = 'builder';

  @Output() nodeSelected = new EventEmitter<CanvasNode | null>();
  @Output() edgeSelected = new EventEmitter<CanvasEdge | null>();
  @Output() edgeCreated = new EventEmitter<CanvasEdge>();
  @Output() nodeMoved = new EventEmitter<{ id: string; x: number; y: number }>();
  @Output() componentDropped = new EventEmitter<{ component: ContentComponent; x: number; y: number }>();
  @Output() deselect = new EventEmitter<void>();

  zoom = 0.85;
  offsetX = 0;
  offsetY = 0;
  dragActive = false;

  draggingNodeId: string | null = null;
  dragOffsetX = 0;
  dragOffsetY = 0;
  connectingFromId: string | null = null;
  mouseX = 0;
  mouseY = 0;
  isPanning = false;
  panStartX = 0;
  panStartY = 0;
  panStartOX = 0;
  panStartOY = 0;
  computedEdges: CanvasEdge[] = [];

  // Native event listener references for cleanup
  private _dragover!: (e: DragEvent) => void;
  private _drop!: (e: DragEvent) => void;
  private _dragenter!: (e: DragEvent) => void;
  private _dragleave!: (e: DragEvent) => void;

  get transform(): string {
    return `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.zoom})`;
  }

  get zoomPercent(): string {
    return Math.round(this.zoom * 100) + '%';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['edges'] || changes['nodes']) {
      this.computeEdgePaths();
    }
  }

  ngAfterViewInit() {
  const el = this.canvasEl.nativeElement;

  console.log('Canvas element:', el);
  console.log('Canvas size:', el.getBoundingClientRect());

  this._dragenter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive = true;
    console.log('✅ dragenter on canvas');
  };

  this._dragover = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive = true;
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  };

  this._dragleave = (e: DragEvent) => {
    e.preventDefault();
    this.dragActive = false;
  };

  this._drop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragActive = false;

    const data = e.dataTransfer?.getData('text/plain');
    console.log('✅ DROP fired! data:', data);

    if (!data) return;

    let component: ContentComponent;
    try {
      component = JSON.parse(data);
    } catch (err) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.offsetX) / this.zoom - 90;
    const y = (e.clientY - rect.top - this.offsetY) / this.zoom - 40;

    this.componentDropped.emit({ component, x, y });
  };

  // Attach to BOTH the element AND document to debug
  el.addEventListener('dragenter', this._dragenter);
  el.addEventListener('dragover', this._dragover);
  el.addEventListener('dragleave', this._dragleave);
  el.addEventListener('drop', this._drop);

  // Also attach dragover to document to confirm drag events exist at all
  document.addEventListener('dragover', (e) => {
    console.log('document dragover - target:', (e.target as Element)?.className);
  });

  console.log('✅ Listeners attached. Canvas rect:', el.getBoundingClientRect());
}

  ngOnDestroy() {
    const el = this.canvasEl?.nativeElement;
    if (el) {
      el.removeEventListener('dragenter', this._dragenter);
      el.removeEventListener('dragover', this._dragover);
      el.removeEventListener('dragleave', this._dragleave);
      el.removeEventListener('drop', this._drop);
    }
  }

  computeEdgePaths() {
    this.computedEdges = this.edges.map(edge => {
      const src = this.nodes.find(n => n.id === edge.sourceNodeId);
      const tgt = this.nodes.find(n => n.id === edge.targetNodeId);
      if (!src || !tgt) return { ...edge };
      const srcCx = src.position.x + 90;
      const srcCy = src.position.y + 40;
      const tgtCx = tgt.position.x + 90;
      const tgtCy = tgt.position.y + 40;
      const dy = tgtCy - srcCy;
      return {
        ...edge,
        path: `M ${srcCx} ${srcCy} C ${srcCx} ${srcCy + dy * 0.4}, ${tgtCx} ${tgtCy - dy * 0.4}, ${tgtCx} ${tgtCy}`,
        midX: (srcCx + tgtCx) / 2,
        midY: (srcCy + tgtCy) / 2
      };
    });
  }

  getNodeClass(node: CanvasNode): string {
    const classes = ['canvas-node', `type-${node.type}`];
    if (node.selected) classes.push('selected');
    if (this.connectingFromId === node.id) classes.push('connecting-from');
    return classes.join(' ');
  }

  getNodeIcon(type: string): string {
    switch (type) {
      case 'start': return 'play_circle';
      case 'end': return 'flag';
      case 'assessment': return 'assignment';
      default: return 'menu_book';
    }
  }

  onNodeMouseDown(event: MouseEvent, node: CanvasNode) {
    if (this.mode !== 'builder') return;
    if (event.button !== 0) return;
    event.stopPropagation();

    if (this.connectingFromId) {
      if (this.connectingFromId !== node.id) {
        this.createEdge(this.connectingFromId, node.id);
      }
      this.connectingFromId = null;
      return;
    }

    this.nodeSelected.emit(node);
    this.draggingNodeId = node.id;
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    const canvasX = (event.clientX - rect.left - this.offsetX) / this.zoom;
    const canvasY = (event.clientY - rect.top - this.offsetY) / this.zoom;
    this.dragOffsetX = canvasX - node.position.x;
    this.dragOffsetY = canvasY - node.position.y;
  }

  onConnectStart(event: MouseEvent, nodeId: string) {
    event.stopPropagation();
    event.preventDefault();
    this.connectingFromId = nodeId;
  }

  createEdge(sourceId: string, targetId: string) {
    const exists = this.edges.some(
      e => e.sourceNodeId === sourceId && e.targetNodeId === targetId
    );
    if (exists) return;
    this.edgeCreated.emit({
      id: uuidv4(),
      sourceNodeId: sourceId,
      targetNodeId: targetId,
      conditions: { operator: 'AND', rules: [] },
      selected: false
    });
  }

  onEdgeClick(event: MouseEvent, edge: CanvasEdge) {
    event.stopPropagation();
    this.edgeSelected.emit(edge);
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.canvasEl?.nativeElement?.getBoundingClientRect();
    if (!rect) return;
    if (this.isPanning) {
      this.offsetX = this.panStartOX + (event.clientX - this.panStartX);
      this.offsetY = this.panStartOY + (event.clientY - this.panStartY);
      return;
    }
    this.mouseX = (event.clientX - rect.left - this.offsetX) / this.zoom;
    this.mouseY = (event.clientY - rect.top - this.offsetY) / this.zoom;
    if (this.draggingNodeId) {
      this.nodeMoved.emit({
        id: this.draggingNodeId,
        x: this.mouseX - this.dragOffsetX,
        y: this.mouseY - this.dragOffsetY
      });
    }
  }

  onMouseUp() { this.draggingNodeId = null; this.isPanning = false; }
  onMouseLeave() { this.draggingNodeId = null; this.isPanning = false; }

  onCanvasMouseDown(event: MouseEvent) {
    if (event.button === 1 || (event.button === 0 && event.altKey)) {
      this.isPanning = true;
      this.panStartX = event.clientX;
      this.panStartY = event.clientY;
      this.panStartOX = this.offsetX;
      this.panStartOY = this.offsetY;
      return;
    }
    if (this.connectingFromId) { this.connectingFromId = null; return; }
    this.deselect.emit();
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    this.zoom = Math.max(0.3, Math.min(2, this.zoom + delta));
  }

  zoomIn() { this.zoom = Math.min(2, this.zoom + 0.1); }
  zoomOut() { this.zoom = Math.max(0.3, this.zoom - 0.1); }
  resetView() { this.zoom = 0.85; this.offsetX = 0; this.offsetY = 0; }

  getEdgeColor(edge: CanvasEdge): string {
    if (edge.selected) return '#4f8ef7';
    if (edge.isDefault) return '#34d399';
    if (edge.conditions?.rules?.length) return '#8b6cf7';
    return '#334070';
  }

  getConnectingLine(): string {
    if (!this.connectingFromId) return '';
    const src = this.nodes.find(n => n.id === this.connectingFromId);
    if (!src) return '';
    return `M ${src.position.x + 90} ${src.position.y + 40} L ${this.mouseX} ${this.mouseY}`;
  }

  getEdgeLabelText(edge: CanvasEdge): string {
    if (edge.label) return edge.label;
    if (edge.isDefault) return 'Default';
    if (edge.conditions?.rules?.length) {
      return `${edge.conditions.rules.length} rule${edge.conditions.rules.length > 1 ? 's' : ''}`;
    }
    return '';
  }

  hasRules(edge: CanvasEdge): boolean {
    return (edge.conditions?.rules?.length ?? 0) > 0;
  }
}