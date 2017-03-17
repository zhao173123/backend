package com.vipabc.vliveshow.backoffice.services.impl;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.vipabc.vliveshow.backoffice.services.TokenBasedService;

@Service
public class TokenBasedServiceImpl implements TokenBasedService {

    private final static String sessionKeyFormat = "bks-%s";
    
    @Autowired
    private RedisTemplate<Object, Object> redis;
    
    @Value("${session.expire.seconds}")
    private long sessionExpireSeconds;
    
    //private final static String tokenKeyFormat = "newtoken-%s";
    
    @Override
    public String generateNewToken() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    @Override
    public void store(String token, Authentication authentication) {
        String key = String.format(sessionKeyFormat, token);
        redis.opsForValue().set(key, authentication);
        redis.expire(key, sessionExpireSeconds, TimeUnit.SECONDS);
    }

    @Override
    public Authentication retrieve(String token) {
        String key = String.format(sessionKeyFormat, token);
        return (Authentication)redis.boundValueOps(key).get();
    }
}
