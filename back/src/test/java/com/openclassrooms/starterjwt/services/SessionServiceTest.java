package com.openclassrooms.starterjwt.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {
    @Mock
    UserRepository userRepository;

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

    
    @Test
    void getById_ExistingSession_ReturnsSession() {
        Session mockSession = new Session();
        mockSession.setId(1L);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(mockSession));

        Session session = sessionService.getById(1L);

        assertThat(session).isNotNull();
        assertThat(session.getId()).isEqualTo(1L);

        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void getById_NonExistingSession_ReturnsNull() {
        Long id = 1L;
        when(sessionRepository.findById(id)).thenReturn(Optional.empty());

        Session session = sessionService.getById(id);

        assertThat(session).isNull();
        verify(sessionRepository, times(1)).findById(id);
    }

    @Test
    void update_ExistingSession_ReturnsSession() {
        Long sessionId = 1L;
        Session existingSession = new Session();
        existingSession.setDescription("Old Session");

        Session updatedSession = new Session();
        updatedSession.setDescription("Updated Session");

        when(sessionRepository.save(any(Session.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Session result = sessionService.update(sessionId, updatedSession);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(sessionId);
        assertThat(result.getDescription()).isEqualTo("Updated Session");

        verify(sessionRepository, times(1)).save(updatedSession);
    }

    @Test
    void participate_WithNoExistingSession_ThrowNotFoundException() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(new User()));

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 2L));

        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(2L);
    }

    @Test
    void participate_WithNoExistingUser_ThrowNotFoundException() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(new Session()));
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 2L));

        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(2L);
    }

    @Test
    void participate_WithUserAlreadyParticipate_ThrowBadRequestException() {
        Session session = new Session();
        session.setId(1L);
        User user = new User();
        user.setId(2L);
        session.setUsers(List.of(user));

        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 2L));
        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(2L);
    }


    
    @Test
    void participate_WithUserNoAlreadyParticipate_ShouldSaveSessionWithTheNewUser() {
        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>());
        User user = new User();
        user.setId(2L);

        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        sessionService.participate(1L, 2L);
        assertThat(session.getUsers()).contains(user);
        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(2L);
        verify(sessionRepository,times(1)).save(session);
    }


    @Test
    void noLongerParticipate_WithNoExistingSession_ThrowNotFoundException() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 2L));

        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void noLongerParticipate_WithUserNoAlreadyParticipate_ThrowBadRequestException() {
        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>());
        User user = new User();
        user.setId(2L);

        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 2L));
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    void participate_WithUserAlreadyParticipate_ShouldRemoveUserOfSession() {
        Session session = new Session();
        session.setId(1L);
        User user = new User();
        user.setId(2L);
        session.setUsers(List.of(user));

        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 2L);
        assertThat(session.getUsers()).doesNotContain(user);
        verify(sessionRepository, times(1)).findById(1L);
    }
}
