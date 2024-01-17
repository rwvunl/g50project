package com.iw.usercenterbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.iw.usercenterbackend.common.ErrorCode;
import com.iw.usercenterbackend.exception.BusinessException;
import com.iw.usercenterbackend.mapper.UserMapper;
import com.iw.usercenterbackend.model.domain.User;
import com.iw.usercenterbackend.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.iw.usercenterbackend.constant.UserConstant.USER_LOGIN_STATE;

/**
 * 用户服务实现类
 *
 * @author rr
 */
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements UserService {
    @Resource
    private UserMapper userMapper;

    /**
     * 盐值：用于混淆密码
     * 现在随便写死了之后看看有没有时间补。。
     */
    private static final String SALT = "salt";

    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword) {
        // 1.校验用户的账户、密码、校验密码，是否符合要求
        // 1.1.非空校验
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword)) {
            // return -1;
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Lack Parameters.");
        }
        // 1.2. 账户长度不小于4位
        if (userAccount.length() < 4) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Account no short than 4 characters.");
        }
        // 1.3. 密码不小于8位
        if (userPassword.length() < 8 || checkPassword.length() < 8) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Password no short than 8 characters.");
        }
        // 1.4. 账户不包含特殊字符
        String validRule = "[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>/?~!@#¥%...... &*()——+|{}【】‘;:”“’。，、?]";
        Matcher matcher = Pattern.compile(validRule).matcher(userAccount);
        // 如果包含非法字符，则返回
        if (matcher.find()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR,
                    "Account cannot include special characters and spaces.");
        }
        // 1.5. 密码和校验密码相同
        if (!userPassword.equals(checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Two passwords must be the same.");
        }
        // 1.6. 账户不能重复
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        long count = userMapper.selectCount(queryWrapper);
        if (count > 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Account dupilicated.");
        }
        // 2. 加密
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes());
        // 3. 插入数据
        User user = new User();
        user.setUserAccount(userAccount);
        user.setUserPassword(encryptPassword);
        user.setUsername(userAccount);
        boolean saveResult = this.save(user);
        if (!saveResult) {
            throw new BusinessException(ErrorCode.NULL_ERROR, "Register failed.");
        }
        return user.getId();
    }

    @Override
    public User userLogin(String userAccount, String userPassword, HttpServletRequest request) {
        // 1.校验用户的账户、密码、校验密码，是否符合要求
        // 1.1.非空校验
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Lack Parameters.");
        }
        // 1.2. 账户长度不小于4位
        if (userAccount.length() < 4) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Account no short than 4 characters.");
        }
        // 1.3. 密码不小于8位
        if (userPassword.length() < 8) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "Password no short than 8 characters.");
        }
        // 1.4. 账户不包含特殊字符
        String validRule = "[`~!@#$%^&*()+=|{}':;',\\\\[\\\\].<>/?~!@#¥%...... &*()——+|{}【】‘;:”“’。，、?]";
        Matcher matcher = Pattern.compile(validRule).matcher(userAccount);
        // 如果包含非法字符，则返回
        if (matcher.find()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR,
                    "Account cannot include special characters and spaces.");
        }
        // 1.5. 加密
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes());

        // 2. 查数据库：根据用户和密码查询用户是否存在
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        queryWrapper.eq("userPassword", encryptPassword);
        User user = userMapper.selectOne(queryWrapper); // 查找满足两个equal条件的数据然后返回user对象
        // 用户不存在
        if (user == null) {
            log.info("user login failed, userAccount cannot match userPassword");
            throw new BusinessException(ErrorCode.NULL_ERROR, "Account doesn't exist or cannot match password.");
        }

        // 3. 用户脱敏
        User safetyUser = getSafetyUser(user);
        // 4. 记录用户的登陆态
        request.getSession().setAttribute(USER_LOGIN_STATE, safetyUser);

        return safetyUser;
    }

    /**
     * 用户脱敏
     * 
     * @param originUser
     * @return
     */
    @Override
    public User getSafetyUser(User originUser) {
        // 3. 用户脱敏
        if (originUser == null) {
            return null;
        }
        User safetyUser = new User();
        safetyUser.setId(originUser.getId());
        safetyUser.setUsername(originUser.getUsername());
        safetyUser.setUserAccount(originUser.getUserAccount());
        safetyUser.setAvatarUrl(originUser.getAvatarUrl());
        safetyUser.setGender(originUser.getGender());
        safetyUser.setPhone(originUser.getPhone());
        safetyUser.setEmail(originUser.getEmail());
        safetyUser.setUserRole(originUser.getUserRole());
        safetyUser.setUserStatus(originUser.getUserStatus());
        safetyUser.setCreateTime(originUser.getCreateTime());
        return safetyUser;
    }

    /**
     * 用户注销
     * 
     * @param request
     */
    @Override
    public int userLogout(HttpServletRequest request) {
        // 移除登陆态
        request.getSession().removeAttribute(USER_LOGIN_STATE);
        return 1;
    }

    @Override
    public int getUserRole(long userId) {
        User user = userMapper.selectById(userId);
        return user.getUserRole();
    }

}
