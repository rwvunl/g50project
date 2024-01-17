package com.iw.usercenterbackend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.DigestUtils;

@SpringBootTest
class UserCenterBackendApplicationTests {

    @Test
    void testDigest(){
        String newPassword = DigestUtils.md5DigestAsHex(("salt"+"mypassword").getBytes());
        System.out.println(newPassword);
    }

    @Test
    void contextLoads() {
    }

}
