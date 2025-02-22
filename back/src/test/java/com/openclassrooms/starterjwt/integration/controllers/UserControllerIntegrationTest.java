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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {
    private final String basePath = "/api/user/";

    @Autowired
    private MockMvc mockMvc;


    @Test
    @DisplayName("GET /api/user/{id} - With existing user id should return user.")
    @WithMockUser(username = "test@test.com")
    void findById_WithExistingUser_ShouldReturnUser() throws Exception {
        mockMvc.perform(get(basePath + 1))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test@test.com"))
            .andExpect(jsonPath("$.firstName").value("Admin"))
            .andExpect(jsonPath("$.lastName").value("Admin"))
            .andExpect(jsonPath("$.admin").value(true))
            .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/user/{id} - Should return 404 Not Found when user does not exist.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNonExistingUserId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get(basePath + 9999))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/user/{id} - Should return 400 Bad Request when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNotIdNumber_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get(basePath + "bonjournombre"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should delete user when authenticated user matches target user")
    @WithMockUser(username = "test@test.com")
    void deleteById_WhenAuthenticatedUserMatchesTargetUser_ShouldDeleteUser() throws Exception {
        mockMvc.perform(delete(basePath + 1))
            .andExpect(status().isOk());

    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should return 401 Unauthorized when authenticated user does not match target user")
    @WithMockUser(username = "baduser@test.com")
    void deleteById_WhenAuthenticatedUserDoesNotMatchTargetUser_ShouldReturnUnauthorized() throws Exception {    
        mockMvc.perform(delete(basePath + 1))
            .andExpect(status().isUnauthorized());

    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should return 404 Not Found when user does not exist.")
    @WithMockUser(username = "test@test.com")
    void deleteById_WithNonExistingUserId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(delete(basePath + 9999))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should return 400 Bad Request when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void deleteById_WithNotIdNumber_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete(basePath + "bonjournombre"))
            .andExpect(status().isBadRequest());
    }    
}
