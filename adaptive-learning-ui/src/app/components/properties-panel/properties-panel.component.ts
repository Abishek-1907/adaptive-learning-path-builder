import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CanvasNode, CanvasEdge, Rule, MetricType, OperatorType
} from '../../models/learning-path.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent implements OnChanges {
  @Input() selectedNode: CanvasNode | null = null;
  @Input() selectedEdge: CanvasEdge | null = null;
  @Input() allNodes: CanvasNode[] = [];

  @Output() nodeUpdated = new EventEmitter<CanvasNode>();
  @Output() edgeUpdated = new EventEmitter<CanvasEdge>();
  @Output() nodeDeleted = new EventEmitter<string>();
  @Output() edgeDeleted = new EventEmitter<string>();

  editNode: CanvasNode | null = null;
  editEdge: CanvasEdge | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedNode']) {
      this.editNode = this.selectedNode
        ? JSON.parse(JSON.stringify(this.selectedNode))
        : null;
    }
    if (changes['selectedEdge']) {
      this.editEdge = this.selectedEdge
        ? JSON.parse(JSON.stringify(this.selectedEdge))
        : null;
      if (this.editEdge && !this.editEdge.conditions) {
        this.editEdge.conditions = { operator: 'AND', rules: [] };
      }
    }
  }

  // ── Node helpers ──────────────────────────────────────────

  saveNode() {
    if (this.editNode) this.nodeUpdated.emit(this.editNode);
  }

  deleteNode() {
    if (this.editNode) this.nodeDeleted.emit(this.editNode.id);
  }

  canDelete(): boolean {
    return !!this.editNode &&
      this.editNode.type !== 'start' &&
      this.editNode.type !== 'end';
  }

  updateDuration(val: number) {
    if (!this.editNode) return;
    if (!this.editNode.config) this.editNode.config = {};
    this.editNode.config.approximateDurationMinutes = val;
    this.saveNode();
  }

  updateMaxScore(val: number) {
    if (!this.editNode) return;
    if (!this.editNode.config) this.editNode.config = {};
    if (!this.editNode.config.assessment) {
      this.editNode.config.assessment = { maxScore: 0, passingScore: 0 };
    }
    this.editNode.config.assessment.maxScore = val;
    this.saveNode();
  }

  updatePassingScore(val: number) {
    if (!this.editNode) return;
    if (!this.editNode.config) this.editNode.config = {};
    if (!this.editNode.config.assessment) {
      this.editNode.config.assessment = { maxScore: 0, passingScore: 0 };
    }
    this.editNode.config.assessment.passingScore = val;
    this.saveNode();
  }

  // ── Edge helpers ──────────────────────────────────────────

  saveEdge() {
    if (this.editEdge) this.edgeUpdated.emit(this.editEdge);
  }

  deleteEdge() {
    if (this.editEdge) this.edgeDeleted.emit(this.editEdge.id);
  }

  setConditionOperator(op: 'AND' | 'OR') {
    if (!this.editEdge) return;
    this.editEdge.conditions.operator = op;
    this.saveEdge();
  }

  getRules(): Rule[] {
    return this.editEdge?.conditions?.rules ?? [];
  }

  getRuleIndex(rule: Rule): number {
    return this.getRules().indexOf(rule);
  }

  addRule() {
    if (!this.editEdge) return;
    const sourceNode = this.getSourceNode();
    const rule: Rule = {
      id: uuidv4(),
      sourceType: sourceNode?.type === 'assessment' ? 'assessment' : 'unit',
      sourceNodeId: this.editEdge.sourceNodeId,
      metric: 'completion',
      operator: 'eq',
      value: true
    };
    if (!this.editEdge.conditions.rules) {
      this.editEdge.conditions.rules = [];
    }
    this.editEdge.conditions.rules = [...this.editEdge.conditions.rules, rule];
    this.saveEdge();
  }

  removeRule(ruleId: string) {
    if (!this.editEdge) return;
    this.editEdge.conditions.rules =
      this.editEdge.conditions.rules.filter(r => r.id !== ruleId);
    this.saveEdge();
  }

  onMetricChange(rule: Rule, metric: MetricType) {
    rule.metric = metric;
    if (metric === 'completion' || metric === 'passed') {
      rule.value = true;
      rule.operator = 'eq';
      delete rule.range;
    } else if (metric === 'score_range') {
      rule.operator = 'between';
      rule.range = { min: 0, max: 100, minInclusive: true, maxInclusive: false };
      delete rule.value;
    } else {
      rule.value = 0;
      rule.operator = 'gte';
      delete rule.range;
    }
    this.saveEdge();
  }

  updateRuleOperator(rule: Rule, op: OperatorType) {
    rule.operator = op;
    this.saveEdge();
  }

  updateRuleValue(rule: Rule, val: any) {
    rule.value = val;
    this.saveEdge();
  }

  updateRangeMin(rule: Rule, val: number) {
    if (!rule.range) rule.range = { min: 0, max: 100 };
    rule.range.min = val;
    this.saveEdge();
  }

  updateRangeMax(rule: Rule, val: number) {
    if (!rule.range) rule.range = { min: 0, max: 100 };
    rule.range.max = val;
    this.saveEdge();
  }

  getRangeMin(rule: Rule): number {
    return rule.range?.min ?? 0;
  }

  getRangeMax(rule: Rule): number {
    return rule.range?.max ?? 100;
  }

  // ── Display helpers ──────────────────────────────────────

  getSourceNode(): CanvasNode | undefined {
    return this.allNodes.find(n => n.id === this.editEdge?.sourceNodeId);
  }

  getTargetNode(): CanvasNode | undefined {
    return this.allNodes.find(n => n.id === this.editEdge?.targetNodeId);
  }

  getAvailableMetrics(rule: Rule): MetricType[] {
    const node = this.allNodes.find(n => n.id === rule.sourceNodeId);
    return node?.type === 'assessment'
      ? ['completion', 'passed', 'score', 'score_range']
      : ['completion', 'time_spent_minutes', 'percentage_completion'];
  }

  getOperatorsForMetric(metric: MetricType): OperatorType[] {
    if (metric === 'completion' || metric === 'passed') return ['eq'];
    if (metric === 'score_range') return ['between'];
    return ['eq', 'ne', 'gt', 'gte', 'lt', 'lte'];
  }

  isBooleanMetric(metric: MetricType): boolean {
    return metric === 'completion' || metric === 'passed';
  }

  isRangeMetric(metric: MetricType): boolean {
    return metric === 'score_range';
  }

  getRuleDescription(rule: Rule): string {
    if (rule.metric === 'completion') return 'Must be completed';
    if (rule.metric === 'passed') return rule.value ? 'Must pass' : 'Must fail';
    if (rule.metric === 'score_range' && rule.range) {
      return `Score between ${rule.range.min} - ${rule.range.max}`;
    }
    return `${rule.metric} ${rule.operator} ${rule.value}`;
  }

  getNodeIcon(type: string): string {
    switch (type) {
      case 'start': return 'play_circle';
      case 'end': return 'flag';
      case 'assessment': return 'assignment';
      default: return 'menu_book';
    }
  }
}