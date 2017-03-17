package com.vipabc.vliveshow.backoffice;

public enum ErrorCode {
    LoginFail(1001),
    DuplicationUserName(1002),
    UploadFileFail(1003);
    
    private final int value;
    
    private ErrorCode(int value) {
        this.value = value;
    }
    
    public int getValue() {
        return value;
    }
}
