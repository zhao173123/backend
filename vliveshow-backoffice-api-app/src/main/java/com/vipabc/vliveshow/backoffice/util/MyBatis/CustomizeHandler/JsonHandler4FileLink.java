package com.vipabc.vliveshow.backoffice.util.MyBatis.CustomizeHandler;

import com.vipabc.vliveshow.backoffice.model.hostContract.FileLink;

/**
 * Created by leo_zlzhang on 8/17/2016.
 * Convert from FileLink to json
 */
@SuppressWarnings("unused")
public class JsonHandler4FileLink extends JsonHandler<FileLink> {

    public JsonHandler4FileLink() {
        super(FileLink.class);
    }
}
