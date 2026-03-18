package com.adaptive_learning_backend.learningbuilder;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ComponentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getComponents_returns200AndItems() throws Exception {
        mockMvc.perform(get("/api/components"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items").isArray())
            .andExpect(jsonPath("$.totalCount").isNumber());
    }

    @Test
    void getComponents_hasSeedData() throws Exception {
        mockMvc.perform(get("/api/components"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items[0].id").exists())
            .andExpect(jsonPath("$.items[0].title").exists())
            .andExpect(jsonPath("$.items[0].type").exists());
    }
}
