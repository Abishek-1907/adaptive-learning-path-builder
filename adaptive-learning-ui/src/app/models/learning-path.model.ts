export interface Position { x: number; y: number; }

export interface AssessmentConfig {
  maxScore: number;
  passingScore: number;
}

export interface NodeConfig {
  approximateDurationMinutes?: number;
  assessment?: AssessmentConfig;
}

export type NodeType = 'start' | 'unit' | 'assessment' | 'end';

export interface LPNode {
  id: string;
  componentId: string;
  type: NodeType;
  label: string;
  description?: string;
  position: Position;
  config?: NodeConfig;
}

export type MetricType = 'completion' | 'passed' | 'score' | 'score_range' | 'time_spent_minutes' | 'percentage_completion';
export type OperatorType = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'between';

export interface RangeCondition {
  min: number;
  max: number;
  minInclusive?: boolean;
  maxInclusive?: boolean;
}

export interface Rule {
  id: string;
  sourceType: 'assessment' | 'unit';
  sourceNodeId: string;
  metric: MetricType;
  operator: OperatorType;
  value?: boolean | number | string;
  range?: RangeCondition;
}

export interface Conditions {
  operator: 'AND' | 'OR';
  rules: Rule[];
}

export interface LPEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  priority?: number;
  isDefault?: boolean;
  conditions: Conditions;
}

export interface CanvasState {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface LearningPath {
  id?: string;
  name: string;
  description?: string;
  status: 'draft' | 'published';
  version?: number;
  canvas?: CanvasState;
  nodes: LPNode[];
  edges: LPEdge[];
}

// UI-only model for rendered nodes
export interface CanvasNode extends LPNode {
  selected: boolean;
  connecting: boolean;
}

export interface CanvasEdge extends LPEdge {
  selected: boolean;
  // Computed path
  path?: string;
  midX?: number;
  midY?: number;
}