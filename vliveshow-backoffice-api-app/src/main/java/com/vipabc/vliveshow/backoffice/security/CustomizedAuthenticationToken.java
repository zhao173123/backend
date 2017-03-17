package com.vipabc.vliveshow.backoffice.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

public class CustomizedAuthenticationToken extends PreAuthenticatedAuthenticationToken {

    private static final long serialVersionUID = -3347809143692718979L;

    public CustomizedAuthenticationToken(Object aPrincipal, Object aCredentials) {
        super(aPrincipal, aCredentials);
    }
    
    public CustomizedAuthenticationToken(Object aPrincipal, Object aCredentials, Collection<? extends GrantedAuthority> anAuthorities) {
        super(aPrincipal, aCredentials, anAuthorities);
    }
    
    public void setUserId(int userId) {
        setDetails(userId);
    }

    public int getUserId() {
        return (int)getDetails();
    }

}
