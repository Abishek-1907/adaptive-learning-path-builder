package com.adaptive_learning_backend.learningbuilder.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adaptive_learning_backend.learningbuilder.dto.AvailableContentResponse;
import com.adaptive_learning_backend.learningbuilder.service.ComponentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/components")
@RequiredArgsConstructor
public class ComponentController {

    private final ComponentService service;

    @GetMapping
    public ResponseEntity<AvailableContentResponse> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}