package com.eventsphere.user_service.service;

import com.eventsphere.user_service.dto.UserDto;
import com.eventsphere.user_service.entity.User;

import java.util.List;


public interface UserService {
    UserDto createUser(UserDto userDto);

    UserDto getUserById(Long id);

    List<UserDto> getAllUser();

    void deleteUserById(Long id);

    UserDto getCurrentUser(User user);

    UserDto getUserByEmail(String username);
}
