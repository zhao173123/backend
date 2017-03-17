package com.vipabc.vliveshow.backoffice.model;

import java.io.Serializable;

public class UserSession implements Serializable {
    private static final long serialVersionUID = -1218887644683585331L;
    
    private int userId;
    private String userSession;
    
    public UserSession() {
        
    }
    
    public UserSession(int userId, String userSession) {
        this.userId = userId;
        this.userSession = userSession;
    }
    
    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }
    
    public String getUserSession() {
        return userSession;
    }
    public void setUserSession(String userSession) {
        this.userSession = userSession;
    }
    
    public String toString() {
        return String.format("%s_%s", this.userId, this.userSession);
    }
}

