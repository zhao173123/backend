package com.vipabc.vliveshow.backoffice.dao;

import com.vipabc.vliveshow.backoffice.model.User;

import java.util.List;

/**
 * Created by leo_zlzhang on 9/2/2016.
 * operate user table
 */
public interface UserRepository {

    boolean isUserNameAvailable(String userName);

    User findUserByName(String userName);

    List<User> findUsersByTitle(int titleId);

    void save(User user);

    int updateById(User user);

    int delete(long userId);
}
