package com.eventsphere.user_service.service;

import com.eventsphere.user_service.dto.UserDto;
import com.eventsphere.user_service.entity.User;
import com.eventsphere.user_service.exception.UserAlreadyExistsException;
import com.eventsphere.user_service.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.modelmapper.ModelMapper;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_shouldCreateUser_whenEmailNotExists() {

        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setName("sajeb");
        userDto.setEmail("sajeb@gmail.com");
        userDto.setPassword("sajeb123");
        userDto.setPhoneNumber("1234567890");

        User userEntity = new User();
        userEntity.setId(1L);
        userEntity.setName("sajeb");
        userEntity.setEmail("sajeb@gmail.com");
        userEntity.setPassword("sajeb123");
        userEntity.setPhoneNumber("1234567890");

        // mocks
        when(userRepository.findByEmail(userDto.getEmail()))
                .thenReturn(Optional.empty());

        when(modelMapper.map(userDto, User.class))
                .thenReturn(userEntity);

        when(passwordEncoder.encode("sajeb123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(userEntity);

        when(modelMapper.map(userEntity, UserDto.class))
                .thenReturn(userDto);

        // act
        UserDto createdUser = userService.createUser(userDto);

        // assert
        assertNotNull(createdUser);
        assertEquals("sajeb@gmail.com", createdUser.getEmail());

        verify(userRepository).findByEmail("sajeb@gmail.com");
        verify(userRepository).save(any(User.class));



//        UserDto inputDto = new UserDto();
//        inputDto.setEmail("saad@test.com");
//        inputDto.setPassword("plain123");
//
//        User mappedUser = new User();
//        mappedUser.setEmail("saad@test.com");
//        mappedUser.setPassword("plain123");
//
//        User savedUser = new User();
//        savedUser.setEmail("saad@test.com");
//        savedUser.setPassword("encoded123");

//        when(userRepository.findByEmail("saad@test.com")).thenReturn(Optional.empty());
//        when(modelMapper.map(inputDto, User.class)).thenReturn(mappedUser);
//        when(passwordEncoder.encode("plain123")).thenReturn("encoded123");
//        when(userRepository.save(mappedUser)).thenReturn(savedUser);
//        when(modelMapper.map(savedUser, UserDto.class)).thenReturn(inputDto);
//
//        UserDto result = userService.createUser(inputDto);
//
//        assertNotNull(result);
//        assertEquals("saad@test.com", result.getEmail());
//
//        verify(userRepository).findByEmail("saad@test.com");
//        verify(passwordEncoder).encode("plain123");
//        verify(userRepository).save(mappedUser);
    }

//    @Test
//    void createUser_shouldThrowException_whenUserAlreadyExists() {
//
//        UserDto inputDto = new UserDto();
//        inputDto.setEmail("saad@test.com");
//
//        when(userRepository.findByEmail("saad@test.com"))
//                .thenReturn(Optional.of(new User()));
//
//        assertThrows(UserAlreadyExistsException.class,
//                () -> userService.createUser(inputDto));
//
//        verify(userRepository, never()).save(any());
//        verify(passwordEncoder, never()).encode(any());
//    }
}
