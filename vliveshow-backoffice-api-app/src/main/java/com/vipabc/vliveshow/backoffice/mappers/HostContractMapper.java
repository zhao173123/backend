package com.vipabc.vliveshow.backoffice.mappers;

import com.vipabc.vliveshow.backoffice.model.hostContract.HostContract;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by leo_zlzhang on 8/12/2016.
 * HostContract mapper
 */
@Mapper
public interface HostContractMapper {

    List<HostContract> findContractByHostId(long hostId);

    Integer updateContract(@Param("contractId") long contractId, @Param("hc") HostContract hostContract);

    Integer createContract(HostContract hostContract);
}
