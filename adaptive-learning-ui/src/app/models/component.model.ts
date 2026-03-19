export interface AssessmentMeta {
  maxScore: number;
  passingScore: number;
}

export interface UnitMeta {
  recommendedMinutes?: number;
}

export interface ComponentMetadata {
  assessment?: AssessmentMeta;
  unit?: UnitMeta;
}

export interface ContentComponent {
  id: string;
  title: string;
  shortDescription: string;
  type: 'unit' | 'assessment';
  approximateDurationMinutes: number;
  metadata?: ComponentMetadata;
}

export interface AvailableContentResponse {
  items: ContentComponent[];
  totalCount: number;
}