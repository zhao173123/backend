package com.vipabc.vliveshow.backoffice.dto;

public class FileUploadDTO extends ServiceResponse{

    private String downloadPath;

    public String getDownloadPath() {
        return downloadPath;
    }

    public void setDownloadPath(String filePath) {
        this.downloadPath = filePath;
    }
    
    
}
