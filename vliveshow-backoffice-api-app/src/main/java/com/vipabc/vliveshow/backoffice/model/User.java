package com.vipabc.vliveshow.backoffice.model;


@SuppressWarnings("unused")
public class User //extends AbstractEntity
{
    private Long userId;
    private String userName;
    private String nickName;
    private String email;
    private String password;
    private Integer titleId;

    public User() {

    }

    public User(long userId, String userName, String email, String password) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.password = password;
    }

    public User(long userId, String userName, String email, String password, int titleId) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.titleId = titleId;
    }

    public long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getNickName() {
        return nickName;
    }
    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Integer getTitleId() {
        return titleId;
    }
    public void setTitleId(Integer titleId) {
        this.titleId = titleId;
    }
}
