package com.openclassrooms.starterjwt.mapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
public class UserMapperTest {
    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);


    @Test
    void shouldMapUserToUserDto() {
        User user = User.builder()
                .id(1L)
                .email("test@example.com")
                .firstName("firstname")
                .lastName("lastname")
                .password("securepassword")
                .admin(true)
                .createdAt(LocalDateTime.of(2023, 1, 1, 12, 0))
                .updatedAt(LocalDateTime.of(2024, 1, 1, 12, 0))
                .build();

        UserDto userDto = userMapper.toDto(user);

        assertThat(userDto).isNotNull();
        assertThat(userDto.getId()).isEqualTo(user.getId());
        assertThat(userDto.getEmail()).isEqualTo(user.getEmail());
        assertThat(userDto.getFirstName()).isEqualTo(user.getFirstName());
        assertThat(userDto.getLastName()).isEqualTo(user.getLastName());
        assertThat(userDto.getPassword()).isEqualTo(user.getPassword());
        assertThat(userDto.isAdmin()).isEqualTo(user.isAdmin());
        assertThat(userDto.getCreatedAt()).isEqualTo(user.getCreatedAt());
        assertThat(userDto.getUpdatedAt()).isEqualTo(user.getUpdatedAt());

    }

    @Test
    void shouldMapUserDtoToUser() {
        UserDto userDto = new UserDto(
                2L,
                "test@example.com",
                "lastname",
                "firstname",
                true,
                "hiddenpassword",
                LocalDateTime.of(2022, 5, 10, 14, 0),
                LocalDateTime.of(2023, 6, 15, 10, 30)
        );

        User user = userMapper.toEntity(userDto);

        assertThat(user).isNotNull();
        assertThat(user.getId()).isEqualTo(userDto.getId());
        assertThat(user.getEmail()).isEqualTo(userDto.getEmail());
        assertThat(user.getFirstName()).isEqualTo(userDto.getFirstName());
        assertThat(user.getLastName()).isEqualTo(userDto.getLastName());
        assertThat(user.isAdmin()).isEqualTo(userDto.isAdmin());
        assertThat(user.getCreatedAt()).isEqualTo(userDto.getCreatedAt());
        assertThat(user.getUpdatedAt()).isEqualTo(userDto.getUpdatedAt());

        assertThat(user.getPassword()).isNotNull();
    }
}
