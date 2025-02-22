package com.openclassrooms.starterjwt.integration.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.instancio.Instancio;
import org.instancio.junit.InstancioExtension;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
@Transactional
@AutoConfigureMockMvc
@ExtendWith(InstancioExtension.class)
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;


    @Test
    @DisplayName("GET /api/user/{id} - With existing user id should return user.")
    @WithMockUser(username = "test@test.com")
    void findById_WithExistingUser_ShouldReturnUser() throws Exception {
        User userSaved = Instancio.create(User.class);
        userSaved.setEmail("test@test.com");
        userSaved = userRepository.save(userSaved);
        mockMvc.perform(get("/api/user/" + userSaved.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value(userSaved.getEmail()))
            .andExpect(jsonPath("$.firstName").value(userSaved.getFirstName()))
            .andExpect(jsonPath("$.lastName").value(userSaved.getLastName()))
            .andExpect(jsonPath("$.admin").value(userSaved.isAdmin()))
            .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/user/{id} - Should return 404 Not Found when user does not exist.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNonExistingUserId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/user/" + 9999))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/user/{id} - Should return 400 Bad Request when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void findById_WithNotIdNumber_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/user/" + "bonjournombre"))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should delete user when authenticated user matches target user")
    @WithMockUser(username = "test@test.com")
    void deleteById_WhenAuthenticatedUserMatchesTargetUser_ShouldDeleteUser() throws Exception {
        User userSaved = Instancio.create(User.class);
        userSaved.setEmail("test@test.com");
        userSaved = userRepository.save(userSaved);
        mockMvc.perform(delete("/api/user/" + userSaved.getId()))
            .andExpect(status().isOk());
        assertThat(userRepository.findById(userSaved.getId())).isEmpty();

    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should return 401 Unauthorized when authenticated user does not match target user")
    @WithMockUser(username = "baduser@test.com")
    void deleteById_WhenAuthenticatedUserDoesNotMatchTargetUser_ShouldReturnUnauthorized() throws Exception {    
        User userSaved = Instancio.create(User.class);
        userSaved.setEmail("test@test.com");
        userSaved = userRepository.save(userSaved);
        mockMvc.perform(delete("/api/user/" + userSaved.getId()))
            .andExpect(status().isUnauthorized());

    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should return 404 Not Found when user does not exist.")
    @WithMockUser(username = "test@test.com")
    void deleteById_WithNonExistingUserId_ShouldReturnNotFound() throws Exception {
        mockMvc.perform(delete("/api/user/" + 9999))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/user/{id} - Should return 400 Bad Request when ID is not a number.")
    @WithMockUser(username = "test@test.com")
    void deleteById_WithNotIdNumber_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(delete("/api/user/" + "bonjournombre"))
            .andExpect(status().isBadRequest());
    }
    // @DeleteMapping("{id}")
    // public ResponseEntity<?> save(@PathVariable("id") String id) {
    //     try {
    //         User user = this.userService.findById(Long.valueOf(id));

    //         if (user == null) {
    //             return ResponseEntity.notFound().build();
    //         }

    //         UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    //         if(!Objects.equals(userDetails.getUsername(), user.getEmail())) {
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    //         }

    //         this.userService.delete(Long.parseLong(id));
    //         return ResponseEntity.ok().build();
    //     } catch (NumberFormatException e) {
    //         return ResponseEntity.badRequest().build();
    //     }
    // }
    
}
