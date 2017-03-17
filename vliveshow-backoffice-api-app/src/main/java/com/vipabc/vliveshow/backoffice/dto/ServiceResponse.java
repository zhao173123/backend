package com.vipabc.vliveshow.backoffice.dto;

public class ServiceResponse {
    private int errorCode;
    private String errorMessage;
    private boolean isSuccess;
    
    public ServiceResponse() {
        this.isSuccess = true;
    }
    
    public int getErrorCode() {
        return errorCode;
    }
    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public boolean getIsSuccess() {
        return isSuccess;
    }
    public void setIsSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }
}
