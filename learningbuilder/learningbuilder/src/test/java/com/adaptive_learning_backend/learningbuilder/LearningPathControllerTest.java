package com.adaptive_learning_backend.learningbuilder;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class LearningPathControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String SAMPLE_PATH = """
        {
          "name": "Test Path",
          "status": "draft",
          "nodes": [
            {
              "id": "node-start",
              "componentId": "start",
              "type": "start",
              "label": "Start",
              "position": { "x": 340, "y": 60 }
            },
            {
              "id": "node-end",
              "componentId": "end",
              "type": "end",
              "label": "End",
              "position": { "x": 340, "y": 700 }
            }
          ],
          "edges": [
            {
              "id": "edge-1",
              "sourceNodeId": "node-start",
              "targetNodeId": "node-end",
              "conditions": {
                "operator": "AND",
                "rules": []
              }
            }
          ]
        }
        """;

    @Test
    void saveLearningPath_returns200() throws Exception {
        mockMvc.perform(post("/api/learning-paths")
                .contentType(MediaType.APPLICATION_JSON)
                .content(SAMPLE_PATH))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.name").value("Test Path"))
            .andExpect(jsonPath("$.status").value("draft"));
    }

    @Test
    void saveThenLoad_returnsCorrectData() throws Exception {
        // Save
        String response = mockMvc.perform(post("/api/learning-paths")
                .contentType(MediaType.APPLICATION_JSON)
                .content(SAMPLE_PATH))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Extract ID
        String id = response.split("\"id\":\"")[1].split("\"")[0];

        // Load
        mockMvc.perform(get("/api/learning-paths/" + id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Test Path"))
            .andExpect(jsonPath("$.nodes").isArray())
            .andExpect(jsonPath("$.edges").isArray());
    }

    @Test
    void getAll_returnsList() throws Exception {
        mockMvc.perform(get("/api/learning-paths"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getById_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/learning-paths/nonexistent-id"))
            .andExpect(status().isNotFound());
    }
}