package com.openclassrooms.starterjwt.integration.controllers;


import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Date;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@AutoConfigureMockMvc
public class SessionControllerIntegrationTest {
    private final String basePath = "/api/session";

    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @DisplayName("GET /api/session/{id} - With existing session id should return session.")
    @WithMockUser(username = "test@test.com")
    void findById_WithExistingSession_ShouldReturnSession() throws Exception {
        mockMvc.perform(get(basePath + "/" + 1))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Yoga1"))
            .andExpect(jsonPath("$.description").value("test"))
            .andExpect(jsonPath("$.teacher_id").value("1"));

    }

    @Test
    @DisplayName("GET /api/session/{id} - Should return 404 Not Found when session does not exist.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNonExistingSessionId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get(basePath + "/" +  9999))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/session/{id} - Should return 400 Bad Request when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNotIdNumber_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get(basePath + "/" +  "bonjournombre"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/session - With existing session id should return session.")
    @WithMockUser(username = "test@test.com")
    void findAll_ShouldReturnTwoSessions() throws Exception {
        mockMvc.perform(get(basePath))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Yoga1"))
                .andExpect(jsonPath("$[0].description").value("test"))
                .andExpect(jsonPath("$[1].name").value("Yoga2"))
                .andExpect(jsonPath("$[1].description").value("test"));
    }

    @Test
    @DisplayName("POST /api/session - Should create a new session successfully.")
    @WithMockUser(username = "test@test.com")
    void createSession_ShouldReturnCreatedSession() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Yoga3");
        sessionDto.setDate(new Date());
        sessionDto.setTeacher_id(1L);
        sessionDto.setDescription("New session test");
        sessionDto.setUsers(List.of(2L)); 

        mockMvc.perform(post(basePath)
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(sessionDto)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Yoga3"))
            .andExpect(jsonPath("$.description").value("New session test"))
            .andExpect(jsonPath("$.teacher_id").value(1));
    }


    @Test
    @DisplayName("PUT /api/session/{id} - Should update an existing session successfully.")
    @WithMockUser(username = "test@test.com")
    void updateSession_WithExistingId_ShouldReturnUpdatedSession() throws Exception {
        SessionDto updatedSession = new SessionDto();
        updatedSession.setName("Yoga Updated");
        updatedSession.setDate(new Date());
        updatedSession.setTeacher_id(1L);
        updatedSession.setDescription("Updated session");
        updatedSession.setUsers(List.of(2L)); 

        mockMvc.perform(put(basePath + "/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(updatedSession)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Yoga Updated"))
            .andExpect(jsonPath("$.description").value("Updated session"));
    }

    @Test
    @DisplayName("PUT /api/session/{id} - Should return 400 when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void updateSession_WithInvalidId_ShouldReturnBadRequest() throws Exception {
        SessionDto sessionDto = new SessionDto();

        mockMvc.perform(put(basePath + "/invalidId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(sessionDto)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/session/{id} - Should delete an existing session successfully.")
    @WithMockUser(username = "test@test.com")
    void deleteSession_WithExistingId_ShouldReturnOk() throws Exception {
        mockMvc.perform(delete(basePath + "/1"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("DELETE /api/session/{id} - Should return 404 when session does not exist.")
    @WithMockUser(username = "test@test.com")
    void deleteSession_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(delete(basePath + "/9999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/session/{id} - Should return 400 when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void deleteSession_WithInvalidId_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete(basePath + "/invalidId"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/session/{id}/participate/{userId} - Should allow user to participate.")
    @WithMockUser(username = "test@test.com")
    void participate_InSession_ShouldReturnOk() throws Exception {
        mockMvc.perform(post(basePath + "/1/participate/2"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/session/{id}/participate/{userId} - Should return 400 when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void participate_WithInvalidId_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(post(basePath + "/invalidId/participate/2"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/session/{id}/participate/{userId} - Should allow user to leave a session.")
    @WithMockUser(username = "test@test.com")
    void noLongerParticipate_ShouldReturnOk() throws Exception {
        mockMvc.perform(delete(basePath + "/1/participate/1"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("DELETE /api/session/{id}/participate/{userId} - Should return 400 when user ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void noLongerParticipate_WithInvalidUserId_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete(basePath + "/1/participate/invalidUserId"))
            .andExpect(status().isBadRequest());
    }


}
