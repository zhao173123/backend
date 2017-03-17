package com.vipabc.vliveshow.backoffice.core;

import java.util.HashMap;
import java.util.Map;

public class JsonInfo {

	private boolean success = true;
	
	private String message = "";
	
	private int error_code;
	
	private Map<String,Object> results = new HashMap<String,Object>();
	
	public JsonInfo(){
		//this.success = _success;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	public Map<String, Object> getResults() {
		return results;
	}

	public JsonInfo setResults(Map<String, Object> results) {
		this.results = results;
		return this;
	}

//	public static JsonInfo fail(){
//		return new JsonInfo(false);
//	}
//	
//	public static JsonInfo success(){
//		return new JsonInfo(true);
//	}
	
	public JsonInfo message(String message){
		setMessage(message);
		return this;
	}
	
	public JsonInfo addResult(String key,Object value){
		results.put(key, value);
		return this;
	}

	public int getError_code() {
		return error_code;
	}

	public JsonInfo setError_code(int error_code) {
		this.error_code = error_code;
		return this;
	}

	public JsonInfo errorCode(int i) {
		setError_code(i);
		return this;
	}

}
