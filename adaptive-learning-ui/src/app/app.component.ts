import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PropertiesPanelComponent } from './components/properties-panel/properties-panel.component';
import { ContentComponent } from './models/component.model';
import { CanvasNode, CanvasEdge, LearningPath, LPNode, LPEdge } from './models/learning-path.model';
import { LearningPathService } from './services/learning-path.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolbarComponent, LeftPanelComponent, CanvasComponent, PropertiesPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  nodes = signal<CanvasNode[]>([]);
  edges = signal<CanvasEdge[]>([]);
  selectedNode = signal<CanvasNode | null>(null);
  selectedEdge = signal<CanvasEdge | null>(null);
  pathName = signal<string>('Untitled Learning Path');
  pathDescription = signal<string>('');
  pathStatus = signal<'draft' | 'published'>('draft');
  currentPathId = signal<string | null>(null);
  saving = signal<boolean>(false);
  saveSuccess = signal<boolean>(false);
  mode = signal<'builder' | 'preview'>('builder');

  constructor(private lpService: LearningPathService) {}

  ngOnInit() {
    // Add default start/end nodes
    this.nodes.set([
      {
        id: 'node-start', componentId: 'start', type: 'start',
        label: 'Start', position: { x: 340, y: 60 },
        selected: false, connecting: false
      },
      {
        id: 'node-end', componentId: 'end', type: 'end',
        label: 'End', position: { x: 340, y: 700 },
        selected: false, connecting: false
      }
    ]);
  }

  onComponentDropped(event: { component: ContentComponent; x: number; y: number }) {
    const newNode: CanvasNode = {
      id: uuidv4(),
      componentId: event.component.id,
      type: event.component.type as any,
      label: event.component.title,
      description: event.component.shortDescription,
      position: { x: event.x, y: event.y },
      config: {
        approximateDurationMinutes: event.component.approximateDurationMinutes,
        ...(event.component.type === 'assessment' && event.component.metadata?.assessment
          ? { assessment: event.component.metadata.assessment }
          : {})
      },
      selected: false,
      connecting: false
    };
    this.nodes.update(n => [...n, newNode]);
  }

  onNodeSelected(node: CanvasNode | null) {
    this.selectedNode.set(node);
    if (node) this.selectedEdge.set(null);
    this.nodes.update(ns => ns.map(n => ({ ...n, selected: n.id === node?.id })));
  }

  onEdgeSelected(edge: CanvasEdge | null) {
    this.selectedEdge.set(edge);
    if (edge) this.selectedNode.set(null);
    this.edges.update(es => es.map(e => ({ ...e, selected: e.id === edge?.id })));
    this.nodes.update(ns => ns.map(n => ({ ...n, selected: false })));
  }

  onEdgeCreated(edge: CanvasEdge) {
    this.edges.update(es => [...es, edge]);
  }

  onNodeMoved(event: { id: string; x: number; y: number }) {
    this.nodes.update(ns => ns.map(n =>
      n.id === event.id ? { ...n, position: { x: event.x, y: event.y } } : n
    ));
  }

  onNodeUpdated(node: CanvasNode) {
    this.nodes.update(ns => ns.map(n => n.id === node.id ? node : n));
    this.selectedNode.set(node);
  }

  onEdgeUpdated(edge: CanvasEdge) {
    this.edges.update(es => es.map(e => e.id === edge.id ? edge : e));
    this.selectedEdge.set(edge);
  }

  onNodeDeleted(id: string) {
    this.nodes.update(ns => ns.filter(n => n.id !== id));
    this.edges.update(es => es.filter(e => e.sourceNodeId !== id && e.targetNodeId !== id));
    this.selectedNode.set(null);
  }

  onEdgeDeleted(id: string) {
    this.edges.update(es => es.filter(e => e.id !== id));
    this.selectedEdge.set(null);
  }

  onDeselect() {
    this.selectedNode.set(null);
    this.selectedEdge.set(null);
    this.nodes.update(ns => ns.map(n => ({ ...n, selected: false })));
    this.edges.update(es => es.map(e => ({ ...e, selected: false })));
  }

  onSaveDraft() {
    this.save('draft');
  }

  onPublish() {
    this.save('published');
  }

  private save(status: 'draft' | 'published') {
    this.saving.set(true);
    const payload: LearningPath = {
      id: this.currentPathId() ?? undefined,
      name: this.pathName(),
      description: this.pathDescription(),
      status,
      nodes: this.nodes().map(({ selected, connecting, ...n }) => n as LPNode),
      edges: this.edges().map(({ selected, path, midX, midY, ...e }) => e as LPEdge)
    };

    this.lpService.save(payload).subscribe({
      next: (saved) => {
        if (saved.id) this.currentPathId.set(saved.id);
        this.pathStatus.set(status);
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: () => this.saving.set(false)
    });
  }

  onLoadPath(id: string) {
    this.lpService.getById(id).subscribe(lp => {
      this.currentPathId.set(lp.id ?? null);
      this.pathName.set(lp.name);
      this.pathDescription.set(lp.description ?? '');
      this.pathStatus.set(lp.status);
      this.nodes.set(lp.nodes.map(n => ({ ...n, selected: false, connecting: false })));
      this.edges.set(lp.edges.map(e => ({ ...e, selected: false })));
    });
  }

  setMode(m: 'builder' | 'preview') {
    this.mode.set(m);
  }
}