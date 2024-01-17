package com.iw.usercenterbackend.common;

/**
 * 错误码
 * @author rr
 */

public enum ErrorCode {


    /**
     * SUCCESS 正常
     * PARAMS_ERROR 请求参数错误
     * NULL_ERROR 请求数据为空
     * NOT_LOGIN 未登陆
     * NO_AUTH 无权限
     */
    SUCCESS(0,"ok",""),
    PARAMS_ERROR(40000,"wrong params",""),
    NULL_ERROR(40001,"no data available",""),
    NOT_LOGIN(40100,"no login",""),
    NO_AUTH(40100,"no auth",""),
    SYSTEM_ERROR(500,"系统内部异常","");

    /**
     * 精简的错误码定义
     */
    private final int code;

    /**
     * 错误码信息
     */
    private final String message;

    /**
     * 错误码详细描述
     */
    private final String description;

    ErrorCode(int code, String message, String description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public String getDescription() {
        return description;
    }
}
