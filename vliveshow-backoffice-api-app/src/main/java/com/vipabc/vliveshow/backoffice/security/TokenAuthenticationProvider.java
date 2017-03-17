package com.vipabc.vliveshow.backoffice.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

import com.vipabc.vliveshow.backoffice.services.TokenBasedService;

public class TokenAuthenticationProvider implements AuthenticationProvider {

    private TokenBasedService tokenService;

    public TokenAuthenticationProvider(TokenBasedService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String token = (String) authentication.getPrincipal();
        if (token.isEmpty()) {
            throw new BadCredentialsException("Invalid token");
        }

        Authentication au = tokenService.retrieve(token);
        if (au == null){
            throw new BadCredentialsException("Invalid token or token expired");
        }
        au.setAuthenticated(true);
        return au;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(CustomizedAuthenticationToken.class);
    }

}
