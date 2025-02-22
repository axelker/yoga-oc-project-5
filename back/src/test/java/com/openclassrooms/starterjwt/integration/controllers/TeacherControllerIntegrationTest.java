package com.openclassrooms.starterjwt.integration.controllers;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@AutoConfigureMockMvc
public class TeacherControllerIntegrationTest {
    private final String basePath = "/api/teacher";


    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @DisplayName("GET /api/teacher/{id} - With existing teacher id should return teacher.")
    @WithMockUser(username = "test@test.com")
    void findById_WithExistingTeacher_ShouldReturnTeacher() throws Exception {
        mockMvc.perform(get(basePath + "/" + 1))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.firstName").value("teacher1"))
            .andExpect(jsonPath("$.lastName").value("test"));
    }

    @Test
    @DisplayName("GET /api/teacher/{id} - Should return 404 Not Found when teacher does not exist.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNonExistingTeacherId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get(basePath + "/" +  9999))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/teacher/{id} - Should return 400 Bad Request when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNotIdNumber_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get(basePath + "/" +  "bonjournombre"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/teacher - With existing teacher id should return teacher.")
    @WithMockUser(username = "test@test.com")
    void findAll_ShouldReturnTwoTeachers() throws Exception {
        mockMvc.perform(get(basePath))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].firstName").value("teacher1"))
                .andExpect(jsonPath("$[0].lastName").value("test"))
                .andExpect(jsonPath("$[1].firstName").value("teacher2"))
                .andExpect(jsonPath("$[1].lastName").value("test"));
    }
}
