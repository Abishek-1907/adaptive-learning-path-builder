package com.adaptive_learning_backend.learningbuilder.service;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.adaptive_learning_backend.learningbuilder.dto.LearningPathDto;
import com.adaptive_learning_backend.learningbuilder.model.LearningPath;
import com.adaptive_learning_backend.learningbuilder.repository.LearningPathRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LearningPathService {

    private final LearningPathRepository repo;
    private final ObjectMapper objectMapper;

    public LearningPathDto save(LearningPathDto dto) {
        try {
            LearningPath entity;
            if (dto.getId() != null && repo.existsById(dto.getId())) {
                entity = repo.findById(dto.getId()).get();
                entity.setName(dto.getName());
                entity.setDescription(dto.getDescription());
                entity.setStatus(dto.getStatus());
                entity.setPayloadJson(objectMapper.writeValueAsString(dto));
            } else {
                entity = LearningPath.builder()
                    .name(dto.getName())
                    .description(dto.getDescription())
                    .status(dto.getStatus())
                    .payloadJson(objectMapper.writeValueAsString(dto))
                    .build();
            }
            LearningPath saved = repo.save(entity);
            dto.setId(saved.getId());
            dto.setVersion(saved.getVersion());
            return dto;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save learning path", e);
        }
    }

    public Optional<LearningPathDto> findById(String id) {
        return repo.findById(id).map(lp -> {
            try {
                LearningPathDto dto = objectMapper.readValue(lp.getPayloadJson(), LearningPathDto.class);
                dto.setId(lp.getId());
                dto.setVersion(lp.getVersion());
                return dto;
            } catch (Exception e) {
                throw new RuntimeException("Failed to deserialize learning path", e);
            }
        });
    }

    public List<LearningPath> findAll() {
        return repo.findAllByOrderByUpdatedAtDesc();
    }

    public void deleteById(String id) {
        repo.deleteById(id);
    }
}