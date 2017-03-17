package com.vipabc.vliveshow.backoffice.dao.impl;

import com.vipabc.vliveshow.backoffice.dao.UserRepository;
import com.vipabc.vliveshow.backoffice.mappers.UserMapper;
import com.vipabc.vliveshow.backoffice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepositoryImpl implements UserRepository{

    @Autowired
    private UserMapper userMapper;

    public boolean isUserNameAvailable(String userName) {
        User user = userMapper.findUserByName(userName);
        return user == null;
    }

    public User findUserByName(String userName) {
        return userMapper.findUserByName(userName);
    }

    public List<User> findUsersByTitle(int titleId){
        return userMapper.findUsersByTitle(titleId);
    }


    public void save(User user) {
        userMapper.insertUser(user);
    }

    public int updateById(User user) {
        return userMapper.updateUserByUserId(user);
    }

    public int delete(long userId){
        return userMapper.deleteUserByUserId(userId);
    }
}
