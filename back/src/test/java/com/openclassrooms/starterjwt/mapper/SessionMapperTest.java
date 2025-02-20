package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.instancio.Instancio;
import org.instancio.junit.InstancioExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.util.List;

@ExtendWith({InstancioExtension.class,MockitoExtension.class})
class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private final SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    @Test
    void toEntity_ValidSessionDto_ReturnsSession() {
        SessionDto sessionDto = Instancio.create(SessionDto.class);

        when(teacherService.findById(sessionDto.getTeacher_id())).thenReturn(Instancio.create(Teacher.class));
        when(userService.findById(anyLong())).thenReturn(Instancio.create(User.class));

        Session session = sessionMapper.toEntity(sessionDto);

        assertThat(session).isNotNull();
        assertThat(session.getName()).isEqualTo(sessionDto.getName());
        assertThat(session.getDescription()).isEqualTo(sessionDto.getDescription());
        assertThat(session.getTeacher()).isNotNull();
        assertThat(session.getUsers()).isNotNull().hasSameSizeAs(sessionDto.getUsers());
        
        verify(teacherService, times(1)).findById(sessionDto.getTeacher_id());
        verify(userService, times(sessionDto.getUsers().size())).findById(anyLong());
    }

    @Test
    void toEntity_WithNullTeacherId_ReturnsSessionWithNullTeacher() {
        SessionDto sessionDto = Instancio.create(SessionDto.class);
        sessionDto.setTeacher_id(null);
        when(userService.findById(anyLong())).thenReturn(Instancio.create(User.class));

        Session session = sessionMapper.toEntity(sessionDto);

        assertThat(session).isNotNull();
        assertThat(session.getName()).isEqualTo(sessionDto.getName());
        assertThat(session.getDescription()).isEqualTo(sessionDto.getDescription());
        assertThat(session.getTeacher()).isNull();
        assertThat(session.getUsers()).isNotNull().hasSameSizeAs(sessionDto.getUsers());
        
        verify(teacherService,never()).findById(anyLong());
        verify(userService, times(sessionDto.getUsers().size())).findById(anyLong());
    }

    @Test
    void toEntity_WithNullUsers_ReturnsSessionWithEmptyUsers() {
        SessionDto sessionDto = Instancio.create(SessionDto.class);
        sessionDto.setUsers(null);
        when(teacherService.findById(sessionDto.getTeacher_id())).thenReturn(Instancio.create(Teacher.class));

        Session session = sessionMapper.toEntity(sessionDto);

        assertThat(session).isNotNull();
        assertThat(session.getName()).isEqualTo(sessionDto.getName());
        assertThat(session.getDescription()).isEqualTo(sessionDto.getDescription());
        assertThat(session.getTeacher()).isNotNull();
        assertThat(session.getUsers()).isEmpty();
        
        verify(teacherService, times(1)).findById(sessionDto.getTeacher_id());
        verify(userService, never()).findById(anyLong());
    }

    @Test
    void toEntity_ListOfValidSessionDto_ReturnsSessionList() {
        List<SessionDto> sessionDtos = Instancio.ofList(SessionDto.class).size(2).create();

        when(teacherService.findById(anyLong())).thenReturn(Instancio.create(Teacher.class));
        when(userService.findById(anyLong())).thenReturn(Instancio.create(User.class));

        List<Session> sessions = sessionMapper.toEntity(sessionDtos);

        assertThat(sessions)
            .isNotNull()
            .hasSize(2)
            .usingRecursiveComparison()
            .ignoringFields("teacher", "users")
            .isEqualTo(sessionDtos);

        verify(teacherService, times(sessionDtos.size())).findById(anyLong());
        verify(userService, atLeastOnce()).findById(anyLong());
    }

    @Test
    void toDto_ValidSession_ReturnsSessionDto() {
        Session session = Instancio.create(Session.class);

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertThat(sessionDto).isNotNull();
        assertThat(sessionDto.getDescription()).isEqualTo(session.getDescription());
        assertThat(sessionDto.getTeacher_id()).isEqualTo(session.getTeacher().getId());
        assertThat(sessionDto.getUsers()).isNotNull().hasSameSizeAs(session.getUsers());
    }

    @Test
    void toDto_WithSessionUsersNull_ReturnsSessionDtoWithEmptyUsers() {
        Session session = Instancio.create(Session.class);
        session.setUsers(null);
        SessionDto sessionDto = sessionMapper.toDto(session);

        assertThat(sessionDto).isNotNull();
        assertThat(sessionDto.getDescription()).isEqualTo(session.getDescription());
        assertThat(sessionDto.getTeacher_id()).isEqualTo(session.getTeacher().getId());
        assertThat(sessionDto.getUsers()).isEmpty();
    }

    @Test
    void toDto_ListOfValidSession_ReturnsSessionDtoList() {
        List<Session> sessions = Instancio.ofList(Session.class).size(2).create();

        List<SessionDto> sessionsDto = sessionMapper.toDto(sessions);

        assertThat(sessionsDto)
        .isNotNull()
        .hasSize(2)
        .usingRecursiveComparison()
        .ignoringFields("teacher_id","users")
        .isEqualTo(sessions);
    }

    
}
