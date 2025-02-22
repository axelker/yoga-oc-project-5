package com.openclassrooms.starterjwt.integration.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {
    private final String basePath = "/api/auth/";
    private final String userEmail ="test@test.com";
    private final String userPassword = "test!1234";

    @Autowired
    private MockMvc mockMvc;


    @Test
    @DisplayName("POST /login - With valid credentials should return JWT and user info.")
    void login_WithValidCredentials_ShouldReturnJwtAndUserInfo() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(userEmail);
        loginRequest.setPassword(userPassword);

        mockMvc.perform(post(basePath + "login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.username").value(userEmail))
                .andExpect(jsonPath("$.firstName").value("Admin"))
                .andExpect(jsonPath("$.lastName").value("Admin"))
                .andExpect(jsonPath("$.admin").value(true))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("POST /login - With invalid credentials should return 401 Unauthorized.")
    void login_WithInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(userEmail);
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post(basePath + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /login - With missing login fields should return 400 Bad request.")
    void login_WithMissingLoginFields_ShouldReturnBadRequest() throws Exception {
        LoginRequest requestMissingEmail = new LoginRequest();
        requestMissingEmail.setPassword(userPassword);

        mockMvc.perform(post(basePath + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(requestMissingEmail)))
                .andExpect(status().isBadRequest());

        LoginRequest requestMissingPassword = new LoginRequest();
        requestMissingPassword.setEmail(userEmail);

        mockMvc.perform(post(basePath + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(requestMissingPassword)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /register - With valid request should return successfully message.")
    void register_WithValidRequiest_ShouldReturnSuccessfullyMessage() throws Exception {
        SignupRequest registerRequest = new SignupRequest();
        registerRequest.setFirstName("registerfirstname");
        registerRequest.setLastName("registerlastname");
        registerRequest.setEmail("register@test.com");
        registerRequest.setPassword("123456");

        mockMvc.perform(post(basePath + "register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));

    }

    
    @Test
    @DisplayName("POST /register - With already email used should return 400 bad request.")
    void register_WithAlreadyUserEmail_ShouldReturnBadRequest() throws Exception {
        SignupRequest registerRequest = new SignupRequest();
        registerRequest.setFirstName("registerfirstname");
        registerRequest.setLastName("registerlastname");
        registerRequest.setEmail(userEmail);
        registerRequest.setPassword("123456");

        mockMvc.perform(post(basePath + "register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(registerRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));

    }

    @Test
    @DisplayName("POST /register - With wrong sign up request user should return 400 bad request.")
    void register_WithWrongSignUpRequest_ShouldReturnBadRequest() throws Exception {
        SignupRequest registerRequest = new SignupRequest();
        registerRequest.setFirstName("r");
        registerRequest.setLastName("r");
        registerRequest.setEmail("testtest.com");
        registerRequest.setPassword("1234");

        mockMvc.perform(post(basePath + "register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(registerRequest)))
            .andExpect(status().isBadRequest());
    }


        
}
