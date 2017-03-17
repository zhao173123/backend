package com.vipabc.vliveshow.backoffice.Exception;

/**
 * Created by leo_zlzhang on 8/19/2016.
 * Exception for wrong body contect
 */
public class InvalidRequestBodyException  extends RuntimeException{
    public InvalidRequestBodyException(String message) {
        super(message);
    }
}
