import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit saveDraft when save button clicked', () => {
    spyOn(component.saveDraft, 'emit');
    component.saveDraft.emit();
    expect(component.saveDraft.emit).toHaveBeenCalled();
  });

  it('should emit publish when publish button clicked', () => {
    spyOn(component.publish, 'emit');
    component.publish.emit();
    expect(component.publish.emit).toHaveBeenCalled();
  });
});