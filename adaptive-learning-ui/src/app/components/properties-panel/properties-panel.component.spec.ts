import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesPanelComponent } from './properties-panel.component';

describe('PropertiesPanelComponent', () => {
  let component: PropertiesPanelComponent;
  let fixture: ComponentFixture<PropertiesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct node icon for each type', () => {
    expect(component.getNodeIcon('start')).toBe('play_circle');
    expect(component.getNodeIcon('end')).toBe('flag');
    expect(component.getNodeIcon('assessment')).toBe('assignment');
    expect(component.getNodeIcon('unit')).toBe('menu_book');
  });

  it('canDelete should return false for start node', () => {
    component.editNode = {
      id: 'node-start', componentId: 'start', type: 'start',
      label: 'Start', position: { x: 0, y: 0 },
      selected: false, connecting: false
    };
    expect(component.canDelete()).toBeFalse();
  });

  it('canDelete should return true for unit node', () => {
    component.editNode = {
      id: 'node-1', componentId: 'cmp-1', type: 'unit',
      label: 'Unit', position: { x: 0, y: 0 },
      selected: false, connecting: false
    };
    expect(component.canDelete()).toBeTrue();
  });

  it('isBooleanMetric should return true for completion and passed', () => {
    expect(component.isBooleanMetric('completion')).toBeTrue();
    expect(component.isBooleanMetric('passed')).toBeTrue();
    expect(component.isBooleanMetric('score')).toBeFalse();
  });

  it('isRangeMetric should return true only for score_range', () => {
    expect(component.isRangeMetric('score_range')).toBeTrue();
    expect(component.isRangeMetric('score')).toBeFalse();
  });
});