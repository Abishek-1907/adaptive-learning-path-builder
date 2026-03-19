import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentComponent } from '../../models/component.model';
import { ComponentService } from '../../services/component.service';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  @Output() componentDropped = new EventEmitter<{ component: ContentComponent; x: number; y: number }>();

  components = signal<ContentComponent[]>([]);
  filtered = signal<ContentComponent[]>([]);
  loading = signal(true);
  search = signal('');
  filter = signal<'all' | 'unit' | 'assessment'>('all');
  dragItem = signal<ContentComponent | null>(null);

  constructor(private svc: ComponentService) {}

  ngOnInit() {
    this.svc.getAll().subscribe({
      next: (res) => {
        this.components.set(res.items);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(val: string) {
    this.search.set(val);
    this.applyFilter();
  }

  setFilter(f: 'all' | 'unit' | 'assessment') {
    this.filter.set(f);
    this.applyFilter();
  }

  applyFilter() {
    const s = this.search().toLowerCase();
    const f = this.filter();
    this.filtered.set(
      this.components().filter(c =>
        (f === 'all' || c.type === f) &&
        (c.title.toLowerCase().includes(s) || c.shortDescription.toLowerCase().includes(s))
      )
    );
  }

  onDragStart(event: DragEvent, component: ContentComponent) {
  this.dragItem.set(component);
  event.dataTransfer!.effectAllowed = 'copy';
  event.dataTransfer!.setData('text/plain', JSON.stringify(component));
  console.log('🚀 DragStart fired for:', component.title);
}

  getIcon(type: string): string {
    return type === 'assessment' ? 'assignment' : 'menu_book';
  }

  getDuration(mins: number): string {
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }
}