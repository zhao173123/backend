package com.vipabc.vliveshow.backoffice.services;

import org.springframework.security.core.Authentication;

public interface TokenBasedService {
    
    String generateNewToken();
    
    void store(String token, Authentication authentication);
    
    Authentication retrieve(String token);
}
