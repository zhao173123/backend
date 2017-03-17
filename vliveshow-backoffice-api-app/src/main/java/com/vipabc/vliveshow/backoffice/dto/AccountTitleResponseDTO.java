package com.vipabc.vliveshow.backoffice.dto;

import com.vipabc.vliveshow.backoffice.model.User;

import java.util.List;

/**
 * Created by leo_zlzhang on 9/1/2016.
 * Response DTO of account
 */
@SuppressWarnings("unused")
public class AccountTitleResponseDTO extends ServiceResponse {
    private List<User> directors;
    private List<User> managers;
    private List<User> agents;

    public List<User> getDirectors() {
        return directors;
    }

    public void setDirectors(List<User> directors) {
        this.directors = directors;
    }

    public List<User> getManagers() {
        return managers;
    }

    public void setManagers(List<User> managers) {
        this.managers = managers;
    }

    public List<User> getAgents() {
        return agents;
    }

    public void setAgents(List<User> agents) {
        this.agents = agents;
    }
}

