package com.vipabc.vliveshow.backoffice.dto;

public class FileUploadRequestDTO {

    private String fileName;
    
    private String fileBase64;

    public String getFileBase64() {
        return fileBase64;
    }

    public void setFileBase64(String fileBase64) {
        this.fileBase64 = fileBase64;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
