package com.adaptive_learning_backend.learningbuilder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.adaptive_learning_backend.learningbuilder.model.LearningPath;

@Repository
public interface LearningPathRepository extends JpaRepository<LearningPath, String> {
    List<LearningPath> findAllByOrderByUpdatedAtDesc();
}
