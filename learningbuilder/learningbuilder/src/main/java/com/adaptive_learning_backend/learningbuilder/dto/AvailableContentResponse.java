package com.adaptive_learning_backend.learningbuilder.dto;


import lombok.*;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class AvailableContentResponse {
    private List<ComponentDto> items;
    private int totalCount;
}