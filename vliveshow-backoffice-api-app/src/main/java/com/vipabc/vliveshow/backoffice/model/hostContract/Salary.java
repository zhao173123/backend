package com.vipabc.vliveshow.backoffice.model.hostContract;


/**
 * Created by leo_zlzhang on 8/10/2016.
 *
 */
@SuppressWarnings("unused")
public class Salary {

    /**
     * 底薪
     */
    private Double amount;

    /**
     * 货币
     */
    private Integer currency;


    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Integer getCurrency() {
        return currency;
    }

    public void setCurrency(Integer currency) {
        this.currency = currency;
    }
}
