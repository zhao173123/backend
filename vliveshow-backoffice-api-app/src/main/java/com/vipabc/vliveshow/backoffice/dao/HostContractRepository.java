package com.vipabc.vliveshow.backoffice.dao;

import com.vipabc.vliveshow.backoffice.model.hostContract.HostContract;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by leo_zlzhang on 8/12/2016.
 * query, updateById, insert to contract table
 */
@Repository
public interface HostContractRepository {
    List<HostContract> getContract(long hostId);

    void updateContract(long contractId, HostContract hostContract);

    void createContract(HostContract hostContract);
}
