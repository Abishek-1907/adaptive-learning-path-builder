package com.adaptive_learning_backend.learningbuilder.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adaptive_learning_backend.learningbuilder.model.ContentComponent;

@Repository
public interface ComponentRepository extends JpaRepository<ContentComponent, String> {}
