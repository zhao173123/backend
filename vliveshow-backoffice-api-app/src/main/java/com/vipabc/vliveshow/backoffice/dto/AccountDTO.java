package com.vipabc.vliveshow.backoffice.dto;

public class AccountDTO extends ServiceResponse {

    private String sessionId;
    private String apiToken;
    private String apiHost;
    private String appApiHost;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }
    
    public String getApiHost() {
        return apiHost;
    }

    public void setApiHost(String apiHost) {
        this.apiHost = apiHost;
    }

    public String getAppApiHost() {
        return appApiHost;
    }

    public void setAppApiHost(String appApiHost) {
        this.appApiHost = appApiHost;
    }
}
