package com.vipabc.vliveshow.backoffice.services;

import com.vipabc.vliveshow.backoffice.model.hostContract.HostContract;

/**
 * Created by leo_zlzhang on 8/12/2016.
 * query, save contract
 */
public interface HostContractService {

    HostContract getLatestContract(long hostId);

    HostContract saveContract(HostContract hostContract);
}
