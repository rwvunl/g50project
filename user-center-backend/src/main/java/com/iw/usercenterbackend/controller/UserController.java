package com.iw.usercenterbackend.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.iw.usercenterbackend.common.BaseResponse;
import com.iw.usercenterbackend.common.ErrorCode;
import com.iw.usercenterbackend.common.ResultUtils;
import com.iw.usercenterbackend.exception.BusinessException;
import com.iw.usercenterbackend.model.domain.User;
import com.iw.usercenterbackend.model.domain.request.UserLoginRequest;
import com.iw.usercenterbackend.model.domain.request.UserRegisterRequest;
import com.iw.usercenterbackend.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

import static com.iw.usercenterbackend.constant.UserConstant.ADMIN_ROLE;
import static com.iw.usercenterbackend.constant.UserConstant.USER_LOGIN_STATE;

/**
 * 用户接口
 *
 * @author rr
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    @PostMapping("/register")
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRegisterRequest){
        if(userRegisterRequest == null){
            throw  new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword= userRegisterRequest.getCheckPassword();
        // 校验任意为空返回null （controller层校验是对请求参数本身的校验，不涉及业务逻辑本身）
        if(StringUtils.isAnyBlank(userAccount,userPassword,checkPassword)){
            return null;
        }
        long result = userService.userRegister(userAccount, userPassword, checkPassword);
        return ResultUtils.success(result);

    }

    @PostMapping("/login")
    public BaseResponse<User> userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request){
        if(userLoginRequest == null){
            return ResultUtils.error(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        // 校验任意为空返回null （controller层校验是对请求参数本身的校验，不涉及业务逻辑本身）
        if(StringUtils.isAnyBlank(userAccount,userPassword)){
            return ResultUtils.error(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.userLogin(userAccount, userPassword, request);
        return ResultUtils.success(user);
    }

    @PostMapping("/logout")
    public BaseResponse<Integer> userLogout(HttpServletRequest request){
        if(request == null){
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        int result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    @GetMapping("/current")
    public BaseResponse<User> getCurrentUser(HttpServletRequest request){
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User currentUser = (User) userObj;
        if(currentUser == null){
            throw new BusinessException(ErrorCode.NOT_LOGIN);
        }
        // 查库
        long userID = currentUser.getId();
        User user = userService.getById(userID);
        User safetyUser = userService.getSafetyUser(user);
        return ResultUtils.success(safetyUser);
    }

    @GetMapping("/search")
    public BaseResponse<List<User>> searchUsers(String username, HttpServletRequest request){
        if(!isAdmin(request)){
            throw new BusinessException(ErrorCode.NO_AUTH, "no admin auth"); // 不是管理员，返回空列表
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if(StringUtils.isNotBlank(username)){
            queryWrapper.like("username",username); // 模糊查询
        }
        // 过滤掉用户的密码
        List<User> userList = userService.list(queryWrapper);
        // 把userList转化成数据流，然后遍历userList的每个元素，把每个元素的密码设成空，再拼成一个完成的list
        List<User> collect = userList.stream().map(user -> userService.getSafetyUser(user)).collect(Collectors.toList());
        return ResultUtils.success(collect);
    }

    @PostMapping("/delete/{id}")
    public BaseResponse<Boolean> deleteUser(@PathVariable long id, HttpServletRequest request){
        if (!isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH,"no admin auth");
        }
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"get wrong id");
        }
        // 删除的不能是管理员
        if(userService.getUserRole(id) == ADMIN_ROLE){
            throw new BusinessException(ErrorCode.PARAMS_ERROR,"cannot delete admin");
        }
        boolean b = userService.removeById(id);
        return ResultUtils.success(b);
    }


    /**
     *  是否为管理员
     * @param request
     * @return
     */
    private boolean isAdmin(HttpServletRequest request) {
        // 仅管理员可查询
        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User) userObj;
        return user != null && user.getUserRole() == ADMIN_ROLE;
    }
}
