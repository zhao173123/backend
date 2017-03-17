package com.vipabc.vliveshow.backoffice.controllers;

import java.io.FileOutputStream;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import com.vipabc.vliveshow.backoffice.ErrorCode;
import com.vipabc.vliveshow.backoffice.dto.FileUploadDTO;
import com.vipabc.vliveshow.backoffice.dto.FileUploadRequestDTO;

@RestController()
@RequestMapping("file")
public class FileUploadController {

    @Value("${backoffice.uploadfile.rootpath}")
    private String rootPath;
    
    @Autowired
    private ResourceLoader resourceLoader;

    @RequestMapping(method = RequestMethod.GET, value = "/**")
    @ResponseBody
    public ResponseEntity<?> getFile(HttpServletRequest request) {
        String restOfTheUrl = (String) request.getAttribute(
                HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String filename = restOfTheUrl.substring(restOfTheUrl.indexOf("file/") + "file/".length());
        
        try {
            Resource resource = resourceLoader.getResource("file:" + Paths.get(rootPath, filename).toString());

            return ResponseEntity.ok(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public FileUploadDTO handleFileUpload(@RequestBody FileUploadRequestDTO fileUploadRequest) {
        FileUploadDTO result = new FileUploadDTO();
        
        String fileString = fileUploadRequest.getFileBase64();
        String fixedFileString = fileString.substring(fileString.indexOf(",") + 1);
        byte[] fileBytes = Base64.getDecoder().decode(fixedFileString.getBytes());
        
        String subDirectory = new SimpleDateFormat("yyyy/MM/dd").format(new Date());

        String suffix = "";
        if (fileUploadRequest.getFileName().lastIndexOf(".") >= 0) {
            suffix = fileUploadRequest.getFileName().substring(fileUploadRequest.getFileName().lastIndexOf("."));            
        }
        String fileName = String.format("%s/%s%s", subDirectory, UUID.randomUUID().toString(), suffix);
        Path p = Paths.get(rootPath, fileName);
        
        FileOutputStream fos = null;
        try {
            System.out.print(p.getParent());
            Files.createDirectories(p.getParent());
            
            fos = new FileOutputStream(p.toString());
            fos.write(fileBytes);
            
            result.setDownloadPath(String.format("/file/%s", fileName));
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            result.setIsSuccess(false);
            result.setErrorCode(ErrorCode.UploadFileFail.getValue());
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    result.setIsSuccess(false);
                    result.setErrorCode(ErrorCode.UploadFileFail.getValue());
                }
            }
        }
        
        
        return result;
    }

}
