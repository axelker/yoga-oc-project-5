package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.instancio.Instancio;
import org.instancio.junit.InstancioExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith({MockitoExtension.class,InstancioExtension.class})
public class UserDetailsServiceImplTest {
    @Mock
    UserRepository userRepository;

    @InjectMocks
    UserDetailsServiceImpl userDetailsService;

    @Test
    void loadUserByUserName_WithNoUserFound_ThrowUserNameNotFoundException() {
        String email = "test@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername(email));
    }

    @Test
    void loadUserByUserName_WithUserFound_ReturnCorrectUser() {
        User user = Instancio.create(User.class);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        UserDetails actual = userDetailsService.loadUserByUsername(user.getEmail());

        assertThat(actual.getUsername()).isEqualTo(user.getEmail());
        assertThat(actual.getPassword()).isEqualTo(user.getPassword());
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }


}
