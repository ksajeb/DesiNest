package com.eventsphere.user_service.security;

import com.eventsphere.user_service.dto.LoginResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private AuthService authService;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken token= (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User=((OAuth2AuthenticationToken) authentication).getPrincipal();

        String registrationId= token.getAuthorizedClientRegistrationId();

        ResponseEntity<LoginResponseDto> loginResponse= authService.handleOAuth2loginRequest(oAuth2User,registrationId);
        response.setStatus(loginResponse.getStatusCode().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        String jwt = loginResponse.getBody().getJwt();

        String redirectUrl = frontendUrl + "/oauth-success?token=" + jwt;

        response.sendRedirect(redirectUrl);
    }
}
