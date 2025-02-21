package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.*;

import org.instancio.Instancio;
import org.instancio.junit.InstancioExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class,InstancioExtension.class})
class JwtUtilsTest {

    @InjectMocks
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    private String jwtSecret = "testSecret";
    private int jwtExpirationMs = 3600000;

    @BeforeEach
    void setUp() {        
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret",jwtSecret);
        ReflectionTestUtils.setField(jwtUtils,"jwtExpirationMs",jwtExpirationMs);
    }

    @Test
    void generateJwtToken_WithAuthenticateUser_ShouldReturnValidToken() {
        UserDetailsImpl userDetails = Instancio.create(UserDetailsImpl.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);

        assertThat(token).isNotBlank();
    }

    @Test
    void getUserNameFromJwtToken_ShouldReturnCorrectUsername() {
        String expectedUsername = "testUser";
        String token = Jwts.builder()
                .setSubject(expectedUsername)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        String actualUsername = jwtUtils.getUserNameFromJwtToken(token);

        assertThat(actualUsername).isEqualTo(expectedUsername);
    }

    @Test
    void validateJwtToken_WithValidToken_ShouldReturnTrue() {
        String token = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        boolean isValid = jwtUtils.validateJwtToken(token);

        assertThat(isValid).isTrue();
    }

    @Test
    void validateJwtToken_WithWrongSignature_ShouldReturnFalse() {
        String wrongSecret = "wrongSecretKey";
        String tokenWithWrongSignature = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, wrongSecret)
                .compact();

        boolean isValid = jwtUtils.validateJwtToken(tokenWithWrongSignature);

        assertThat(isValid).isFalse();
    }
    
    @Test
    void validateJwtToken_WithMalformedToken_ShouldReturnFalse() {
        String invalidToken = "invalid.token.structure";

        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_WithExpiredToken_ShouldReturnFalse() {
        String expiredToken = Jwts.builder()
                .setSubject("testUser")
                .setIssuedAt(new Date(System.currentTimeMillis() - 10000))
                .setExpiration(new Date(System.currentTimeMillis()))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();

        boolean isValid = jwtUtils.validateJwtToken(expiredToken);

        assertThat(isValid).isFalse();
    }

    @Test
    void validateJwtToken_WithNullToken_ShouldReturnFalse() {
        boolean isValid = jwtUtils.validateJwtToken(null);

        assertThat(isValid).isFalse();
    }



}
