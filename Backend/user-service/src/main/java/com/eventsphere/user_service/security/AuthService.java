package com.eventsphere.user_service.security;

import com.eventsphere.user_service.dto.LoginRequestDto;
import com.eventsphere.user_service.dto.LoginResponseDto;
import com.eventsphere.user_service.dto.SignupRequestDto;
import com.eventsphere.user_service.dto.SignupResponseDto;
import com.eventsphere.user_service.entity.TokenBlacklist;
import com.eventsphere.user_service.entity.User;
import com.eventsphere.user_service.exception.UserAlreadyExistsException;
import com.eventsphere.user_service.exception.UserNotFoundException;
import com.eventsphere.user_service.repository.TokenBlacklistRepository;
import com.eventsphere.user_service.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TokenBlacklistRepository tokenBlacklistRepository;

    public LoginResponseDto login(LoginRequestDto loginRequestDto){

        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found. Please signup first with this email:"+loginRequestDto.getEmail()
                ));

        Authentication authentication=authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(),loginRequestDto.getPassword())
        );

        String token=authUtil.generateAccessToken(user);

        return new LoginResponseDto(user.getId(),token);
    }

    public SignupResponseDto signup(SignupRequestDto signupRequestDto) {
        if (userRepository.findByEmail(signupRequestDto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists with email: " + signupRequestDto.getEmail());
        }

        User user = modelMapper.map(signupRequestDto, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));


        User savedUser=userRepository.save(user);
        System.out.println("Saved user phone: " + savedUser.getPhoneNumber());

        return modelMapper.map(savedUser, SignupResponseDto.class);
    }

    public String logout(String token) {

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (tokenBlacklistRepository.findByToken(token).isPresent()) {
            return "Already logged out";
        }

        TokenBlacklist blacklist = new TokenBlacklist();
        blacklist.setToken(token);
        blacklist.setExpiryTime(authUtil.extractExpiration(token).toInstant());

        tokenBlacklistRepository.save(blacklist);

        return "Logged out successfully";
    }
}
