package com.vipabc.vliveshow.backoffice.dao.impl;

import com.vipabc.vliveshow.backoffice.dao.HostContractRepository;
import com.vipabc.vliveshow.backoffice.mappers.HostContractMapper;
import com.vipabc.vliveshow.backoffice.model.hostContract.HostContract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by leo_zlzhang on 8/12/2016.
 * query, updateById, insert to contract table
 */
@SuppressWarnings("unused")
@Repository
public class HostContractRepositoryImpl implements HostContractRepository {

    @Autowired
    private HostContractMapper hostContractMapper;

    public List<HostContract> getContract(long hostId) {
        return hostContractMapper.findContractByHostId(hostId);
    }


    public void updateContract(long contractId, HostContract hostContract) {
        hostContractMapper.updateContract(contractId, hostContract);
    }


    public void createContract(HostContract hostContract) {
        hostContractMapper.createContract(hostContract);
    }
}
