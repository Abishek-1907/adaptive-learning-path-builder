import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  let component: CanvasComponent;
  let fixture: ComponentFixture<CanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default zoom of 0.85', () => {
    expect(component.zoom).toBe(0.85);
  });

  it('zoomIn should increase zoom', () => {
    const before = component.zoom;
    component.zoomIn();
    expect(component.zoom).toBeGreaterThan(before);
  });

  it('zoomOut should decrease zoom', () => {
    const before = component.zoom;
    component.zoomOut();
    expect(component.zoom).toBeLessThan(before);
  });

  it('resetView should reset zoom to 0.85', () => {
    component.zoomIn();
    component.resetView();
    expect(component.zoom).toBe(0.85);
  });

  it('should return correct node icon', () => {
    expect(component.getNodeIcon('start')).toBe('play_circle');
    expect(component.getNodeIcon('end')).toBe('flag');
    expect(component.getNodeIcon('assessment')).toBe('assignment');
    expect(component.getNodeIcon('unit')).toBe('menu_book');
  });
});