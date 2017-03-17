package com.vipabc.vliveshow.backoffice.mappers;

import com.vipabc.vliveshow.backoffice.model.User;

import java.util.List;


public interface UserMapper {
    User findUserByName(String userName);

    List<User> findUsersByTitle(int titleId);

    void insertUser(User user);

    int updateUserByUserId(User user);

    int deleteUserByUserId(long userId);
}
