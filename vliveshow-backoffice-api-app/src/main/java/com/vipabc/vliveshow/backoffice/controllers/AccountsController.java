/**
 *
 */
package com.vipabc.vliveshow.backoffice.controllers;

import com.vipabc.vliveshow.backoffice.ErrorCode;
import com.vipabc.vliveshow.backoffice.core.JsonInfo;
import com.vipabc.vliveshow.backoffice.dto.AccountDTO;
import com.vipabc.vliveshow.backoffice.dto.AccountTitleResponseDTO;
import com.vipabc.vliveshow.backoffice.dto.NewAccountDTO;
import com.vipabc.vliveshow.backoffice.dto.ServiceResponse;
import com.vipabc.vliveshow.backoffice.model.User;
import com.vipabc.vliveshow.backoffice.model.UserSession;
import com.vipabc.vliveshow.backoffice.services.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author shenjiang
 */
@RestController()
@RequestMapping("api/v1/accounts")
public class AccountsController {
	
	private Logger logger = LoggerFactory.getLogger(AccountsController.class);

    @Value("${login.api.url}")
    private String loginUrl;

    @Value("${login.api.pwd}")
    private String loginApiPwd;

    @Value("${backoffice.api.host}")
    private String backofficeApiHost;
    
    @Value("${app.api.host}")
    private String appApiHost;
    
    @Autowired
    UserService userService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ServiceResponse login(@RequestBody Map<String, String> user) {
        String userName = user.get("userName");
        String password = user.get("password");

        AccountDTO account = new AccountDTO();

        User userModel = userService.FindUser(userName);
        if (userModel != null && userModel.getPassword().equals(password)) {
            UserSession session = userService.createSession((int) userModel.getUserId());
            //account.setSessionId(UUID.randomUUID().toString().replaceAll("-", ""));
            account.setSessionId(session.getUserSession());

            // call api.
            account.setApiToken(getLoginToken());
            account.setApiHost(backofficeApiHost);
            account.setAppApiHost(appApiHost);

        } else {
            account.setIsSuccess(false);
            account.setErrorCode(ErrorCode.LoginFail.getValue());
            account.setErrorMessage("Login Failed");
        }

        return account;
    }


    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public ServiceResponse logout() {
        return new ServiceResponse();
    }


    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ServiceResponse createAccount(@RequestBody NewAccountDTO account) {

        ServiceResponse result = new ServiceResponse();

        try {
            userService.createUser(account.getUserName(), account.getEmail(), account.getPassword());
        } catch (IllegalArgumentException iae) {
            result.setErrorCode(ErrorCode.DuplicationUserName.getValue());
            result.setErrorMessage(iae.getMessage());
        }

        return result;
    }


    @RequestMapping(value = "/load/bytitle", method = RequestMethod.GET)
    public ServiceResponse loadUserByTitle() {
        List<User> directors = userService.findUserByTitle(1);
        List<User> managers = userService.findUserByTitle(2);
        List<User> agents = userService.findUserByTitle(4);

        AccountTitleResponseDTO accountTitleResponseDTO = new AccountTitleResponseDTO();
        accountTitleResponseDTO.setDirectors(directors);
        accountTitleResponseDTO.setManagers(managers);
        accountTitleResponseDTO.setAgents(agents);

        return accountTitleResponseDTO;
    }


    private String getLoginToken() {
        //String url = "http://124.172.174.187:8888/vliveshow-backoffice-app/v1/users/phone/password_login";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> entity = new HttpEntity<String>(loginApiPwd, headers);
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> uriP = new HashMap<String, Object>();
        ResponseEntity<JsonInfo> response = null;
        try{
        	response = restTemplate.exchange(loginUrl, HttpMethod.POST, entity, JsonInfo.class, uriP);
        }catch(Exception e){
        	logger.error("loginUrl:" + loginUrl + "," + e.getMessage());
        	throw e;
        }
        String token = "";
        if (response.getBody().isSuccess()) {
            token = response.getBody().getResults().get("token").toString();
        }

        return token;
    }
}
