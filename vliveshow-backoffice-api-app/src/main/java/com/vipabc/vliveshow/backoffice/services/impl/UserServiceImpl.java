package com.vipabc.vliveshow.backoffice.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vipabc.vliveshow.backoffice.Exception.InvalidRequestBodyException;
import com.vipabc.vliveshow.backoffice.dao.UserRepository;
import com.vipabc.vliveshow.backoffice.model.User;
import com.vipabc.vliveshow.backoffice.model.UserSession;
import com.vipabc.vliveshow.backoffice.security.CustomizedAuthenticationToken;
import com.vipabc.vliveshow.backoffice.services.TokenBasedService;
import com.vipabc.vliveshow.backoffice.services.UserService;
import com.vipabc.vliveshow.backoffice.services.utils.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenBasedService tokenBasedService;

    @Override
    public boolean ValidateUser(String userName, String password) {

        User user = userRepository.findUserByName(userName);
        if (user != null && user.getPassword().equals(password)) {
            return true;
        }

        return false;
    }

    @Override
    public User FindUser(String userName) {
        return userRepository.findUserByName(userName);
    }


    @Override
    public List<User> findUserByTitle(int titleId) {
        if (Math.log(titleId) / Math.log(2) % 1 != 0 || titleId < 0)
            throw new InvalidRequestBodyException("Invalid title id");

        return userRepository.findUsersByTitle(titleId);
    }

    @Override
    public void createUser(String userName, String email, String password) throws IllegalArgumentException {

        ValidationUtils.assertNotBlank(userName, "Username cannot be empty.");
        ValidationUtils.assertNotBlank(password, "Password cannot be empty.");

        boolean isUserNameAvailable = userRepository.isUserNameAvailable(userName);
        if (!isUserNameAvailable) {
            throw new IllegalArgumentException("The user name is not available");
        }

        User user = new User(0, userName, email, password);
        userRepository.save(user);
    }


    @Override
    public UserSession createSession(int userId) {
        String token = tokenBasedService.generateNewToken();

        CustomizedAuthenticationToken authentication = new CustomizedAuthenticationToken(token, null);
        authentication.setUserId(userId);
        tokenBasedService.store(token, authentication);

        UserSession userSession = new UserSession(userId, token);
        return userSession;
    }

    @Override
    public boolean deleteUserSession(long userId) {
        // todo
        return false;
    }
}
