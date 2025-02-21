package com.openclassrooms.starterjwt.services;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {
    
    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    
    @Test
    @DisplayName("Should return a teacher when teacher ID exists.")
    void findById_ExistingTeacher_ReturnsTeacher() {
        Teacher mockTeacher = new Teacher();
        mockTeacher.setId(1L);

        when(teacherRepository.findById(1L)).thenReturn(Optional.of(mockTeacher));

        Teacher teacher = teacherService.findById(1L);

        assertThat(teacher).isNotNull();
        assertThat(teacher.getId()).isEqualTo(1L);

        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return null when teacher ID does not exists.")
    void findById_NonExistingTeacher_ReturnsNull() {
        Long id = 1L;
        when(teacherRepository.findById(id)).thenReturn(Optional.empty());

        Teacher teacher = teacherService.findById(id);

        assertThat(teacher).isNull();
        verify(teacherRepository, times(1)).findById(id);
    }
}
