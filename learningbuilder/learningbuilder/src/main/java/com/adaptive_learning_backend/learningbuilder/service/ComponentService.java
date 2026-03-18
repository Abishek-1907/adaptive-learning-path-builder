package com.adaptive_learning_backend.learningbuilder.service;


import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.adaptive_learning_backend.learningbuilder.dto.AvailableContentResponse;
import com.adaptive_learning_backend.learningbuilder.dto.ComponentDto;
import com.adaptive_learning_backend.learningbuilder.model.ContentComponent;
import com.adaptive_learning_backend.learningbuilder.repository.ComponentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComponentService {

    private final ComponentRepository repo;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void seed() {
        if (repo.count() > 0) return;
        List<ContentComponent> seeds = List.of(
            build("cmp-assess-math-1",   "Math Module 1 Assessment",       "Baseline math diagnostic used to route learners.",              "assessment", 35, "{\"assessment\":{\"maxScore\":100,\"passingScore\":50}}"),
            build("cmp-unit-math-2-easy","Math Module 2 - Easy",           "Foundational math remediation for struggling learners.",        "unit",       35, "{\"unit\":{\"recommendedMinutes\":30}}"),
            build("cmp-unit-math-2-adv", "Math Module 2 - Advanced",       "Advanced math module for high-performing learners.",            "unit",       40, "{\"unit\":{\"recommendedMinutes\":35}}"),
            build("cmp-assess-math-end", "Math Completion Assessment",     "Final math assessment to evaluate overall mastery.",            "assessment", 45, "{\"assessment\":{\"maxScore\":100,\"passingScore\":70}}"),
            build("cmp-unit-rc-1",       "Reading & Comp Module 1",        "Introduction to reading comprehension strategies.",             "unit",       32, "{\"unit\":{\"recommendedMinutes\":30}}"),
            build("cmp-assess-rc-1",     "Reading Module 1 Assessment",    "Diagnostic reading assessment to determine path routing.",      "assessment", 30, "{\"assessment\":{\"maxScore\":100,\"passingScore\":60}}"),
            build("cmp-unit-rc-2-easy",  "R&C Module 2 - Easy",            "Remedial reading comprehension exercises for skill building.",  "unit",       32, "{\"unit\":{\"recommendedMinutes\":28}}"),
            build("cmp-unit-rc-2-adv",   "R&C Module 2 - Advanced",        "Advanced reading comprehension and critical analysis.",         "unit",       32, "{\"unit\":{\"recommendedMinutes\":30}}"),
            build("cmp-unit-writing-1",  "Writing Fundamentals",           "Core writing skills: grammar, structure, and style.",           "unit",       45, "{\"unit\":{\"recommendedMinutes\":40}}"),
            build("cmp-assess-writing-1","Writing Assessment",             "Essay-based assessment for evaluating writing proficiency.",    "assessment", 50, "{\"assessment\":{\"maxScore\":100,\"passingScore\":65}}"),
            build("cmp-unit-science-1",  "Science Module 1",               "Introduction to scientific method and basic concepts.",         "unit",       40, "{\"unit\":{\"recommendedMinutes\":35}}"),
            build("cmp-assess-final",    "Final Comprehensive Assessment", "End-of-course assessment covering all modules.",               "assessment", 60, "{\"assessment\":{\"maxScore\":200,\"passingScore\":140}}")
        );
        repo.saveAll(seeds);
    }

    private ContentComponent build(String id, String title, String desc, String type, int dur, String meta) {
        return ContentComponent.builder()
            .id(id).title(title).shortDescription(desc)
            .type(type).approximateDurationMinutes(dur).metadataJson(meta).build();
    }

    public AvailableContentResponse getAll() {
        List<ComponentDto> dtos = repo.findAll().stream().map(this::toDto).toList();
        return new AvailableContentResponse(dtos, dtos.size());
    }

    @SuppressWarnings("unchecked")
    private ComponentDto toDto(ContentComponent c) {
        ComponentDto dto = ComponentDto.builder()
            .id(c.getId()).title(c.getTitle())
            .shortDescription(c.getShortDescription())
            .type(c.getType())
            .approximateDurationMinutes(c.getApproximateDurationMinutes())
            .build();

        if (c.getMetadataJson() != null) {
            try {
                Map<String, Object> meta = objectMapper.readValue(c.getMetadataJson(), Map.class);
                ComponentDto.MetadataDto metaDto = new ComponentDto.MetadataDto();

                if (meta.containsKey("assessment")) {
                    Map<String, Integer> a = (Map<String, Integer>) meta.get("assessment");
                    metaDto.setAssessment(new ComponentDto.AssessmentMeta(a.get("maxScore"), a.get("passingScore")));
                }
                if (meta.containsKey("unit")) {
                    Map<String, Integer> u = (Map<String, Integer>) meta.get("unit");
                    metaDto.setUnit(new ComponentDto.UnitMeta(u.get("recommendedMinutes")));
                }
                dto.setMetadata(metaDto);
            } catch (Exception e) {
                log.warn("Failed to parse metadata for {}", c.getId());
            }
        }
        return dto;
    }
}