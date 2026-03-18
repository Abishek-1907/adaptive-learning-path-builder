package com.adaptive_learning_backend.learningbuilder.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearningPathDto {
    private String id;
    private String name;
    private String description;
    private String status;
    private Integer version;
    private CanvasDto canvas;
    private List<NodeDto> nodes;
    private List<EdgeDto> edges;

    @Data @NoArgsConstructor @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CanvasDto {
        private Double zoom;
        private Double offsetX;
        private Double offsetY;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NodeDto {
        private String id;
        private String componentId;
        private String type;
        private String label;
        private String description;
        private PositionDto position;
        private NodeConfigDto config;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class PositionDto {
        private Double x;
        private Double y;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class NodeConfigDto {
        private Integer approximateDurationMinutes;
        private AssessmentConfigDto assessment;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class AssessmentConfigDto {
        private Integer maxScore;
        private Integer passingScore;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class EdgeDto {
        private String id;
        private String sourceNodeId;
        private String targetNodeId;
        private String label;
        private Integer priority;
        private Boolean isDefault;
        private ConditionsDto conditions;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ConditionsDto {
        private String operator;
        private List<RuleDto> rules;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RuleDto {
        private String id;
        private String sourceType;
        private String sourceNodeId;
        private String metric;
        private String operator;
        private Object value;
        private RangeDto range;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class RangeDto {
        private Double min;
        private Double max;
        private Boolean minInclusive;
        private Boolean maxInclusive;
    }
}