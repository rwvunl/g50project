package com.iw.usercenterbackend.model.domain.request;

import lombok.Data;

import java.io.Serializable;

/**
 * 用户登陆请求体
 *
 * @author rr
 */
@Data
public class UserLoginRequest implements Serializable {

    private static final long serialVersionUID = -1793321139230170751L;

    private String userAccount;

    private String userPassword;

}
