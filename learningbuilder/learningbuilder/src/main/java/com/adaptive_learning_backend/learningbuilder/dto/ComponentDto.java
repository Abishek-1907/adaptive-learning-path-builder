package com.adaptive_learning_backend.learningbuilder.dto;


import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ComponentDto {
    private String id;
    private String title;
    private String shortDescription;
    private String type;
    private Integer approximateDurationMinutes;
    private MetadataDto metadata;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class MetadataDto {
        private AssessmentMeta assessment;
        private UnitMeta unit;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AssessmentMeta {
        private Integer maxScore;
        private Integer passingScore;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UnitMeta {
        private Integer recommendedMinutes;
    }
}
