package com.vipabc.vliveshow.backoffice.services;

import com.vipabc.vliveshow.backoffice.model.User;
import com.vipabc.vliveshow.backoffice.model.UserSession;

import java.util.List;

public interface UserService {

    boolean ValidateUser(String userName, String password);

    User FindUser(String userName);

    List<User> findUserByTitle(int roleId);

    void createUser(String userName, String email, String password) throws IllegalArgumentException;

    UserSession createSession(int userId);

    boolean deleteUserSession(long userId);
}