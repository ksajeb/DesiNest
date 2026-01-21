package com.eventsphere.user_service.service.impl;

import com.eventsphere.user_service.dto.UserDto;
import com.eventsphere.user_service.entity.User;
import com.eventsphere.user_service.exception.UserAlreadyExistsException;
import com.eventsphere.user_service.exception.UserNotFoundException;
import com.eventsphere.user_service.repository.UserRepository;
import com.eventsphere.user_service.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDto createUser(UserDto userDto) {
        log.info("START :: createUser | email={}", userDto.getEmail());
        Optional<User> existingUser = userRepository.findByEmail(userDto.getEmail());

        if (existingUser.isPresent()) {
            log.warn("User already exists with email={}", userDto.getEmail());
            throw new UserAlreadyExistsException(
                    "User already exists with email: " + userDto.getEmail());
        }

        log.debug("Mapping UserDto to User entity");
        User user = modelMapper.map(userDto, User.class);

        log.debug("Encoding password for email={}", user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        log.debug("Saving user to database");
        User savedUser = userRepository.save(user);

        log.info("User created successfully | userId={}, email={}",savedUser.getId(),savedUser.getEmail());
        return modelMapper.map(savedUser, UserDto.class);
    }

    @Override
    public UserDto getUserById(Long id) {
        log.info("START :: getUserById | userId={}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User not found | userId={}", id);
                    return new UserNotFoundException("User not found with id: " + id);});

        log.debug("User found with the userId={}, email={}", user.getId(), user.getEmail());
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public List<UserDto> getAllUser() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            log.warn("No users found in database");
        } else {
            log.info("Total users found={}", users.size());
        }

        return users.stream()
                .map(user -> {
                    log.debug("Mapping user | userId={}", user.getId());
                    return modelMapper
                            .map(user, UserDto.class);})
                .toList();
    }

    @Override
    public void deleteUserById(Long id) {
        log.info("Deleting user with the userId={}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Delete failed - user not found | userId={}", id);
                    return new UserNotFoundException("User not found with id: " + id);});

        log.debug("Deleting user | userId={}, email={}", user.getId(), user.getEmail());
        userRepository.delete(user);
        log.info("User deleted successfully | userId={}", id);
    }

    @Override
    public UserDto getCurrentUser(User user) {
        log.info("Fetching current authenticated user with the  userId={}", user.getId()
        );
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        log.info("Fetching user with the email={}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("User not found | email={}", email);
                    return new UserNotFoundException("User not found");});

        log.debug("User found with the  userId={}, email={}", user.getId(), user.getEmail());

        return modelMapper.map(user, UserDto.class);

    }
}
