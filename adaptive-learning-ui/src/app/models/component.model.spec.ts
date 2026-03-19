import { ContentComponent } from './component.model';

describe('Component Model', () => {

  it('should create a unit component', () => {
    const comp: ContentComponent = {
      id: 'cmp-unit-1',
      title: 'Math Module',
      shortDescription: 'Basic math',
      type: 'unit',
      approximateDurationMinutes: 30,
      metadata: { unit: { recommendedMinutes: 25 } }
    };
    expect(comp.type).toBe('unit');
    expect(comp.approximateDurationMinutes).toBe(30);
    expect(comp.metadata?.unit?.recommendedMinutes).toBe(25);
  });

  it('should create an assessment component', () => {
    const comp: ContentComponent = {
      id: 'cmp-assess-1',
      title: 'Math Assessment',
      shortDescription: 'Baseline diagnostic',
      type: 'assessment',
      approximateDurationMinutes: 35,
      metadata: { assessment: { maxScore: 100, passingScore: 50 } }
    };
    expect(comp.type).toBe('assessment');
    expect(comp.metadata?.assessment?.maxScore).toBe(100);
    expect(comp.metadata?.assessment?.passingScore).toBe(50);
  });
});