package com.vipabc.vliveshow.backoffice.util.MyBatis.CustomizeHandler;

import com.vipabc.vliveshow.backoffice.model.hostContract.FileLink;

/**
 * Created by leo_zlzhang on 8/16/2016.
 * Convert from FileLink Array to json
 */
@SuppressWarnings("unused")
public class JsonHandler4FileLinkArray extends JsonHandler<FileLink[]> {
    public JsonHandler4FileLinkArray() {
        super(FileLink[].class);
    }
}
