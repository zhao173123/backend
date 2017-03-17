package com.vipabc.vliveshow.backoffice.model.hostContract;


import java.util.Date;

/**
 * Created by leo_zlzhang on 8/10/2016.
 * 主播合作资料
 */
@SuppressWarnings("unused")
public class HostContract {

    /**
     * 合同Id
     */
    private Long contractId;


    /**
     * 主播
     */
    private Long hostId;


    /**
     * 签约类型
     */
    private Integer contractType;


    /**
     * 主播类型
     */
    private Integer[] talentType;


    /**
     * 月时长要求
     */
    private Double requiredWorkHours;


    /**
     * 底薪
     * 计价货币
     */
    private Salary baseSalary;


    /**
     * 平台分成
     */
    private Float platformShareRate;


    /**
     * 主播分成
     */
    private Float hostShareRate;


    /**
     * 结算基数
     */
    private Double settlementBase;


    /**
     * 结算日期（每月）
     */
    private Integer settlementDueDay;


    /**
     * 总监
     */
    private Long directorId;

    /**
     * 主管
     */
    private Long supervisorId;

    /**
     * 专员
     */
    private Long agentId;


    /**
     * 结算银行
     */
    private String bankName;


    /**
     * 银行账号
     */
    private String bankAccount;


    /**
     * 合约起始日期
     */
    private Date startDate;


    /**
     * 合约结束日期
     */
    private Date endDate;


    /**
     * 上传合约
     */
    private FileLink[] contractFiles;


    /**
     * 身份证扫描件（正）
     */
    private FileLink idCardFace;


    /**
     * 身份证扫描件（背）
     */
    private FileLink idCardBack;


    /**
     * 手持身份证照片
     */
    private FileLink idCardHold;
    
    /**
     * 主播所属的管理团队(1:自制,2:运营)
     */
    private Integer managementTeamType;

    /**
     * 主播的申请方式(1:邀约,2:自主申请)
     */
    private Integer applyType;

    /**
     * 每月最少直播时长
     */
    private Double workingHours;

    /**
     * 单课时直播要求
     */
    private Double lessonHours;

    /**
     * 课程提纲交接日
     */
    private Integer lessonAbstractSubmitDay;
    
    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    public Integer getContractType() {
        return contractType;
    }

    public void setContractType(Integer contractType) {
        this.contractType = contractType;
    }

    public Integer[] getTalentType() {
        return talentType;
    }

    public void setTalentType(Integer[] talentType) {
        this.talentType = talentType;
    }

    public Double getRequiredWorkHours() {
        return requiredWorkHours;
    }

    public void setRequiredWorkHours(Double requiredWorkHours) {
        this.requiredWorkHours = requiredWorkHours;
    }

    public Salary getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(Salary baseSalary) {
        this.baseSalary = baseSalary;
    }

    public Float getPlatformShareRate() {
        return platformShareRate;
    }

    public void setPlatformShareRate(Float platformShareRate) {
        this.platformShareRate = platformShareRate;
    }

    public Float getHostShareRate() {
        return hostShareRate;
    }

    public void setHostShareRate(Float hostShareRate) {
        this.hostShareRate = hostShareRate;
    }

    public Double getSettlementBase() {
        return settlementBase;
    }

    public void setSettlementBase(Double settlementBase) {
        this.settlementBase = settlementBase;
    }

    public Integer getSettlementDueDay() {
        return settlementDueDay;
    }

    public void setSettlementDueDay(Integer settlementDueDay) {
        this.settlementDueDay = settlementDueDay;
    }

    public Long getDirectorId() {
        return directorId;
    }

    public void setDirectorId(Long directorId) {
        this.directorId = directorId;
    }

    public Long getSupervisorId() {
        return supervisorId;
    }

    public void setSupervisorId(Long supervisorId) {
        this.supervisorId = supervisorId;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public FileLink[] getContractFiles() {
        return contractFiles;
    }

    public void setContractFiles(FileLink[] contractFiles) {
        this.contractFiles = contractFiles;
    }

    public FileLink getIdCardFace() {
        return idCardFace;
    }

    public void setIdCardFace(FileLink idCardFace) {
        this.idCardFace = idCardFace;
    }

    public FileLink getIdCardBack() {
        return idCardBack;
    }

    public void setIdCardBack(FileLink idCardBack) {
        this.idCardBack = idCardBack;
    }

    public FileLink getIdCardHold() {
        return idCardHold;
    }

    public void setIdCardHold(FileLink idCardHold) {
        this.idCardHold = idCardHold;
    }

	public Integer getManagementTeamType() {
		return managementTeamType;
	}

	public void setManagementTeamType(Integer managementTeamType) {
		this.managementTeamType = managementTeamType;
	}

	public Integer getApplyType() {
		return applyType;
	}

	public void setApplyType(Integer applyType) {
		this.applyType = applyType;
	}

    public Double getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(Double workingHours) {
        this.workingHours = workingHours;
    }

    public Double getLessonHours() {
        return lessonHours;
    }

    public void setLessonHours(Double lessonHours) {
        this.lessonHours = lessonHours;
    }

    public Integer getLessonAbstractSubmitDay() {
        return lessonAbstractSubmitDay;
    }

    public void setLessonAbstractSubmitDay(Integer lessonAbstractSubmitDay) {
        this.lessonAbstractSubmitDay = lessonAbstractSubmitDay;
    }
}
