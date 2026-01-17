package com.eventsphere.user_service.controller;

import com.eventsphere.user_service.dto.UserDto;
import com.eventsphere.user_service.entity.User;
import com.eventsphere.user_service.repository.UserRepository;
import com.eventsphere.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto){
        UserDto created=userService.createUser(userDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity <List<UserDto>> getAllUser(){
        List<UserDto> user=userService.getAllUser();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        UserDto user=userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id){
        userService.deleteUserById(id);
        return ResponseEntity.ok("User deleted successfully with the id:"+id);
    }

}
