package com.iw.usercenterbackend.exception;

import com.iw.usercenterbackend.common.ErrorCode;

/**
 * 自定义异常类
 * 在原本的RuntimeException扩充了2个字段
 *
 * @author rr
 */
public class BusinessException extends RuntimeException{
    private static final long serialVersionUID = 4820644325414343337L;
    private final int code;

    private final String description;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.description = errorCode.getDescription();
    }

    public BusinessException(String message, int code, String description) {
        super(message);
        this.code = code;
        this.description = description;
    }

    public BusinessException(ErrorCode errorCode, String description) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
}
