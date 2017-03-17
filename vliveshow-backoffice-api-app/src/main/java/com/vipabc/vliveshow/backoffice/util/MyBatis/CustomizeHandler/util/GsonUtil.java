package com.vipabc.vliveshow.backoffice.util.MyBatis.CustomizeHandler.util;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;

import java.io.*;

@SuppressWarnings("unused")
public class GsonUtil
{
    public static <T> T toObject(File sourceFile, Class cls) throws IOException
    {
        if(sourceFile == null || !sourceFile.exists())
            return null;

        InputStream is = new FileInputStream(sourceFile);
        T rtnInstance = toObject(is, cls);
        is.close();
        return rtnInstance;
    }
    public static <T> T toObject(String sourceStr, Class cls) throws IOException
    {
        if(sourceStr == null)
            return null;

        InputStream is = new ByteArrayInputStream(sourceStr.getBytes());
        T rtnInstance = toObject(is, cls);
        is.close();
        return rtnInstance;
    }
    private static <T> T toObject(InputStream is, Class cls)
    {
        if(is == null)
            return null;

        JsonReader reader = new JsonReader(new InputStreamReader(is));
        Gson myJson = new Gson();
        return myJson.fromJson(reader, cls);
    }

    public static String toString(Object obj){
        Gson myJson = new Gson();
        return myJson.toJson(obj);
    }
}
