import { LPNode, LPEdge, LearningPath } from './learning-path.model';

describe('LearningPath Models', () => {

  it('should create a valid LPNode object', () => {
    const node: LPNode = {
      id: 'node-1',
      componentId: 'cmp-1',
      type: 'unit',
      label: 'Test Node',
      position: { x: 100, y: 200 }
    };
    expect(node.id).toBe('node-1');
    expect(node.type).toBe('unit');
    expect(node.position.x).toBe(100);
  });

  it('should create a valid LPEdge with conditions', () => {
    const edge: LPEdge = {
      id: 'edge-1',
      sourceNodeId: 'node-start',
      targetNodeId: 'node-1',
      conditions: {
        operator: 'AND',
        rules: [
          {
            id: 'rule-1',
            sourceType: 'assessment',
            sourceNodeId: 'node-start',
            metric: 'score',
            operator: 'gte',
            value: 70
          }
        ]
      }
    };
    expect(edge.conditions.operator).toBe('AND');
    expect(edge.conditions.rules.length).toBe(1);
    expect(edge.conditions.rules[0].metric).toBe('score');
  });

  it('should create a valid LearningPath object', () => {
    const path: LearningPath = {
      name: 'My Path',
      status: 'draft',
      nodes: [],
      edges: []
    };
    expect(path.name).toBe('My Path');
    expect(path.status).toBe('draft');
    expect(path.nodes).toEqual([]);
  });
});