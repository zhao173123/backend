package com.vipabc.vliveshow.backoffice.services.impl;

import com.vipabc.vliveshow.backoffice.dao.HostContractRepository;
import com.vipabc.vliveshow.backoffice.model.hostContract.HostContract;
import com.vipabc.vliveshow.backoffice.services.HostContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by leo_zlzhang on 8/12/2016.
 * query, save contract
 */
@SuppressWarnings("unused")
@Service
public class HostContractServiceImpl implements HostContractService{

    @Autowired
    HostContractRepository hostContractRepository;

    @Override
    public HostContract getLatestContract(long hostId) {
        List<HostContract> hostContracts = hostContractRepository.getContract(hostId);

        if (hostContracts == null || hostContracts.size() == 0)
            return null;

        HostContract hostContract = hostContracts.get(0);

        for (HostContract hc : hostContracts) {
            if (hc.getStartDate().getTime() > hc.getStartDate().getTime())
                hostContract = hc;
        }

        return hostContract;
    }

    @Override
    public HostContract saveContract(HostContract hostContract) {
        HostContract result = getLatestContract(hostContract.getHostId());

        if (result == null) {
            hostContractRepository.createContract(hostContract);
        } else {
            hostContractRepository.updateContract(result.getContractId(), hostContract);
        }

        return getLatestContract(hostContract.getHostId());
    }
}
