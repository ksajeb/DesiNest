package com.eventsphere.user_service.security;

import com.eventsphere.user_service.dto.LoginRequestDto;
import com.eventsphere.user_service.dto.LoginResponseDto;
import com.eventsphere.user_service.dto.SignupRequestDto;
import com.eventsphere.user_service.dto.SignupResponseDto;
import com.eventsphere.user_service.entity.AuthProviderType;
import com.eventsphere.user_service.entity.TokenBlacklist;
import com.eventsphere.user_service.entity.User;
import com.eventsphere.user_service.exception.UserAlreadyExistsException;
import com.eventsphere.user_service.exception.UserNotFoundException;
import com.eventsphere.user_service.repository.TokenBlacklistRepository;
import com.eventsphere.user_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
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

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        User user = userRepository.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new UserNotFoundException(
                        "User not found. Please signup first with this email:" + loginRequestDto.getEmail()));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));

        String token = authUtil.generateAccessToken(user);

        return new LoginResponseDto(user.getId(), token);
    }

    public LoginResponseDto signup(SignupRequestDto signupRequestDto) {
        if (userRepository.findByEmail(signupRequestDto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists with email: " + signupRequestDto.getEmail());
        }

        User user = modelMapper.map(signupRequestDto, User.class);
        if (signupRequestDto.getPassword() == null || signupRequestDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);
        String token = authUtil.generateAccessToken(savedUser);

        return new LoginResponseDto(savedUser.getId(), token);
    }

    public String logout(String token) {

        if (token != null && token.startsWith("Bearer ")) {
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

    // public ResponseEntity<LoginResponseDto> handleOAuth2loginRequest(OAuth2User
    // oAuth2User, String registrationId) {
    // // fetch provider type and id
    // AuthProviderType
    // providerType=authUtil.getProviderTypeFromRegistrationId(registrationId);
    // String
    // providerId=authUtil.determineProviderIdFromOAuth2User(oAuth2User,registrationId);
    //
    // String email=oAuth2User.getAttribute("email");
    // if (email == null || email.isBlank()) {
    // throw new BadCredentialsException("Email not provided by OAuth provider");
    // }
    // User
    // user=userRepository.findByProviderIdAndProviderType(providerId,providerType).orElse(null);
    //
    // User emailUser=userRepository.findByEmail(email).orElse(null);
    //
    // if(user==null && emailUser==null){
    // //signup
    // String username=
    // authUtil.determineUsernameFromOAuth2User(oAuth2User,registrationId,providerId);
    // SignupRequestDto signupRequestDto=signup(new SignupRequestDto(email,null))
    // } else if (user!=null) {
    // if(email!=null && !email.isBlank() && !email.equals(user.getEmail())){
    // user.setName(email);
    // userRepository.save(user);
    // }
    // }else {
    // throw new BadCredentialsException("This email is already registered with
    // provider:"+email);
    // }
    //
    // LoginResponseDto loginResponseDto=new
    // LoginResponseDto(authUtil.generateAccessToken());
    // //save the provider id and type info with user
    // // if the user has an account: directly login
    //
    // //otherwise: first signup and then login
    // }

    @Transactional
    public ResponseEntity<LoginResponseDto> handleOAuth2loginRequest(
            OAuth2User oAuth2User,
            String registrationId) {

        AuthProviderType providerType = authUtil.getProviderTypeFromRegistrationId(registrationId);

        String providerId = authUtil.determineProviderIdFromOAuth2User(oAuth2User, registrationId);

        String email = oAuth2User.getAttribute("email");

        if (email == null || email.isBlank()) {
            throw new BadCredentialsException("Email not provided by OAuth provider");
        }

        User user = userRepository
                .findByProviderIdAndProviderType(providerId, providerType)
                .orElse(null);

        if (user == null) {
            user = userRepository.findByEmail(email).orElse(null);
        }

        if (user == null) {

            user = new User();
            user.setName(oAuth2User.getAttribute("name"));
            user.setEmail(email);
            user.setProviderType(providerType);
            user.setProviderId(providerId);
            user.setPassword(null);

            userRepository.save(user);
        }

        String token = authUtil.generateAccessToken(user);

        return ResponseEntity.ok(
                new LoginResponseDto(user.getId(), token));
    }
}
