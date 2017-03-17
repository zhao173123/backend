package com.vipabc.vliveshow.backoffice.util.MyBatis.CustomizeHandler;

import com.vipabc.vliveshow.backoffice.util.MyBatis.CustomizeHandler.util.GsonUtil;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.postgresql.util.PGobject;

import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by leo_zlzhang on 8/16/2016.
 * Convert between json and object
 */
@SuppressWarnings({"unused", "WeakerAccess"})
public class JsonHandler<T> extends BaseTypeHandler<T> {

    private Class<T> type;

    public JsonHandler(Class<T> _type){
        if (_type == null) throw new IllegalArgumentException("Type argument cannot be null");
        type = _type;
    }

    public JsonHandler() {
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        PGobject jsonObject = new PGobject();
        jsonObject.setType("jsonb");
        jsonObject.setValue(GsonUtil.toString(parameter));
        ps.setObject(i, jsonObject);
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {

        try {
            return GsonUtil.toObject(rs.getString(columnName), type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        try {
            return GsonUtil.toObject(rs.getString(columnIndex), type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        try {
            return GsonUtil.toObject(cs.getString(columnIndex), type);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
