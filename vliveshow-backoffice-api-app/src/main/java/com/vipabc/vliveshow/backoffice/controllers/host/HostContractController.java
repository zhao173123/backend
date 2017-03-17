package com.vipabc.vliveshow.backoffice.controllers.host;

import com.vipabc.vliveshow.backoffice.Exception.InvalidRequestBodyException;
import com.vipabc.vliveshow.backoffice.dto.HostContractDTO;
import com.vipabc.vliveshow.backoffice.dto.ServiceResponse;
import com.vipabc.vliveshow.backoffice.model.hostContract.HostContract;
import com.vipabc.vliveshow.backoffice.services.HostContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 * Created by leo_zlzhang on 8/12/2016.
 * load contract
 * save contract
 */
@SuppressWarnings("unused")
@RestController
@RequestMapping("api/v1/host/contract")
public class HostContractController {

    @Autowired
    private HostContractService hostContractService;

    /**
     * Loads host contract
     * @param hostContract
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/load")
    public ServiceResponse loadContract(@RequestBody HostContract hostContract) {
        if(hostContract == null || hostContract.getHostId() == null)
            throw new InvalidRequestBodyException("Not found hostId in requestBody");

        HostContract rtnHostContract = hostContractService.getLatestContract(hostContract.getHostId());
        return new HostContractDTO().parseModel(rtnHostContract);
    }

    /**
     * Insert new or update existing host contract
     * @param hostContract
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/save")
    public ServiceResponse saveContract(@RequestBody HostContract hostContract) {

        if (hostContract == null || hostContract.getHostId() == null)
            throw new InvalidRequestBodyException("Not found hostId in requestBody");
        if (hostContract.getContractType() == null)
            throw new InvalidRequestBodyException("Not found contractType in requestBody");
        if (hostContract.getTalentType() == null)
            throw new InvalidRequestBodyException("Not found talentType in requestBody");
        if (hostContract.getRequiredWorkHours() == null)
            throw new InvalidRequestBodyException("Not found requiredWorkHours in requestBody");
        if (hostContract.getBaseSalary() == null ||
                hostContract.getBaseSalary().getAmount() == null ||
                hostContract.getBaseSalary().getCurrency() == null)
            throw new InvalidRequestBodyException("Not found baseSalary related field in requestBody");
        if (hostContract.getPlatformShareRate() == null)
            throw new InvalidRequestBodyException("Not found platformShareRate in requestBody");
        if (hostContract.getHostShareRate() == null)
            throw new InvalidRequestBodyException("Not found hostShareRate in requestBody");
        if (hostContract.getSettlementBase() == null)
            throw new InvalidRequestBodyException("Not found settlementBase in requestBody");
        if (hostContract.getSettlementDueDay() == null)
            throw new InvalidRequestBodyException("Not found settlementDueDay in requestBody");
        if (hostContract.getManagementTeamType()== null)
            throw new InvalidRequestBodyException("Not found managementTeamType in requestBody");
        if (hostContract.getApplyType() == null)
            throw new InvalidRequestBodyException("Not found applyType in requestBody");

        HostContract rtnHostContract = hostContractService.saveContract(hostContract);
        return new HostContractDTO().parseModel(rtnHostContract);
    }

}
