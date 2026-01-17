package com.eventsphere.user_service.service;

import com.eventsphere.user_service.dto.UserDto;
import com.eventsphere.user_service.entity.User;
import com.eventsphere.user_service.exception.UserAlreadyExistsException;
import com.eventsphere.user_service.exception.UserNotFoundException;
import com.eventsphere.user_service.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public UserDto createUser(UserDto userDto) {
        Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());

        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("User already exists with email: " + userDto.getEmail());
        }

        User user=modelMapper.map(userDto,User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser=userRepository.save(user);
        return modelMapper.map(savedUser,UserDto.class);
    }

    public UserDto getUserById(Long id){
        User user=userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException(
                        "User not found with id: " + id));
        return modelMapper.map(user,UserDto.class);
    }
    public List<UserDto> getAllUser() {
        List<UserDto> users=userRepository.findAll()
                .stream()
                .map(user->modelMapper.map(user,UserDto.class))
                .toList();
        return users;
    }

    public void deleteUserById(Long id) {
        User user=userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException(
                        "User not found with id: " + id));
        userRepository.delete(user);
    }


}
