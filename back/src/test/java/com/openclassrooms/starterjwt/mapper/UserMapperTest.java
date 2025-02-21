package com.openclassrooms.starterjwt.mapper;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.instancio.Instancio;
import org.instancio.junit.InstancioExtension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(InstancioExtension.class)
public class UserMapperTest {
    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Test
    void toDto_ValidUser_ReturnsUserDto() {
        User user = Instancio.create(User.class);

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
    void toDto_ListOfValidUsers_ReturnsUserDtoList() {
        List<User> users = Instancio.ofList(User.class).size(2).create();

        List<UserDto> usersDto = userMapper.toDto(users);

        assertThat(usersDto)
            .isNotNull()
            .hasSize(2)
            .usingRecursiveComparison()
            .isEqualTo(users);

    }

    @Test
    void toEntity_ValidUserDto_ReturnsUserEntity() {
        UserDto userDto = Instancio.create(UserDto.class);

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

    @Test
    void toEntity_ListOfValidUserDtos_ReturnsUserList() {
        List<UserDto> usersDto = Instancio.ofList(UserDto.class).size(2).create();

        List<User> users = userMapper.toEntity(usersDto);

        assertThat(users)
            .isNotNull()
            .hasSize(2)
            .usingRecursiveComparison()
            .isEqualTo(usersDto);

    }

}
