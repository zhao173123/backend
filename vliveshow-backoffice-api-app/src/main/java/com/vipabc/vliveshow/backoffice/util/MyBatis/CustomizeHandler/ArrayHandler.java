package com.vipabc.vliveshow.backoffice.util.MyBatis.CustomizeHandler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.*;

/**
 * Created by leo_zlzhang on 8/12/2016.
 * To handle Array of Integer, boolean, double, String
 */
public class ArrayHandler<T> extends BaseTypeHandler<T> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        String type = parserType(parameter);

        Connection connection = ps.getConnection();
        Array array = connection.createArrayOf(type, (Object[]) parameter);
        ps.setArray(i, array);
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return parserArray(rs.getArray(columnName));
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return parserArray(rs.getArray(columnIndex));
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return parserArray(cs.getArray(columnIndex));
    }

    @SuppressWarnings("unchecked")
    private T parserArray(Array array) throws SQLException {
        if (array == null)
            return null;

        return (T) array.getArray();
    }


    private String parserType(T parameter) {

        if (parameter instanceof Integer[])
            return "integer";
        if (parameter instanceof String[])
            return "varchar";
        if (parameter instanceof Double[])
            return "numeric";
        if (parameter instanceof Boolean[])
            return "boolean";
        return null;
    }


}
