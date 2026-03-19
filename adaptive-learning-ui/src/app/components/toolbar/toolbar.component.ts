import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPathService } from '../../services/learning-path.service';
import { LearningPath } from '../../models/learning-path.model';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() pathName = '';
  @Input() pathStatus: 'draft' | 'published' = 'draft';
  @Input() saving = false;
  @Input() saveSuccess = false;
  @Input() mode: 'builder' | 'preview' = 'builder';
  @Output() nameChange = new EventEmitter<string>();
  @Output() saveDraft = new EventEmitter<void>();
  @Output() publish = new EventEmitter<void>();
  @Output() modeChange = new EventEmitter<'builder' | 'preview'>();
  @Output() loadPath = new EventEmitter<string>();

  savedPaths = signal<LearningPath[]>([]);
  showPaths = signal(false);
  editingName = signal(false);

  constructor(private lpService: LearningPathService) {}

  ngOnInit() {
    this.loadSavedPaths();
  }

  loadSavedPaths() {
    this.lpService.getAll().subscribe(paths => this.savedPaths.set(paths as any));
  }

  togglePaths() {
    this.showPaths.update(v => !v);
    if (this.showPaths()) this.loadSavedPaths();
  }
}