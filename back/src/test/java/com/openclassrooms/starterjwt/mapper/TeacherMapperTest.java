package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.instancio.Instancio;
import org.instancio.junit.InstancioExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(InstancioExtension.class)
class TeacherMapperTest {

    private final TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    void toDto_ValidTeacher_ReturnsTeacherDto() {
        Teacher teacher = Instancio.create(Teacher.class);

        TeacherDto teacherDto = teacherMapper.toDto(teacher);

        assertThat(teacherDto).isNotNull();
        assertThat(teacherDto.getId()).isEqualTo(teacher.getId());
        assertThat(teacherDto.getFirstName()).isEqualTo(teacher.getFirstName());
        assertThat(teacherDto.getLastName()).isEqualTo(teacher.getLastName());
        assertThat(teacherDto.getCreatedAt()).isEqualTo(teacher.getCreatedAt());
        assertThat(teacherDto.getUpdatedAt()).isEqualTo(teacher.getUpdatedAt());
    }

    @Test
    void toDto_ListOfValidTeachers_ReturnsTeacherDtoList() {
        List<Teacher> teachers = Instancio.ofList(Teacher.class).size(2).create();

        List<TeacherDto> teacherDtos = teacherMapper.toDto(teachers);

        assertThat(teacherDtos)
            .isNotNull()
            .hasSize(2)
            .usingRecursiveComparison()
            .isEqualTo(teachers);
    }

    @Test
    void toEntity_ValidTeacherDto_ReturnsTeacher() {
        TeacherDto teacherDto = Instancio.create(TeacherDto.class);

        Teacher teacher = teacherMapper.toEntity(teacherDto);

        assertThat(teacher).isNotNull();
        assertThat(teacher.getId()).isEqualTo(teacherDto.getId());
        assertThat(teacher.getFirstName()).isEqualTo(teacherDto.getFirstName());
        assertThat(teacher.getLastName()).isEqualTo(teacherDto.getLastName());
        assertThat(teacher.getCreatedAt()).isEqualTo(teacherDto.getCreatedAt());
        assertThat(teacher.getUpdatedAt()).isEqualTo(teacherDto.getUpdatedAt());
    }
    

    @Test
    void toEntity_ListOfValidTeacherDtos_ReturnsTeacherList() {
        List<TeacherDto> teacherDtos = Instancio.ofList(TeacherDto.class).size(2).create();

        List<Teacher> teachers = teacherMapper.toEntity(teacherDtos);

        assertThat(teachers)
            .isNotNull()
            .hasSize(2)
            .usingRecursiveComparison()
            .isEqualTo(teacherDtos);
    }
}
