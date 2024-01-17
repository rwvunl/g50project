import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {Alert, Divider, message, Tabs} from 'antd';
import React, { useState } from 'react';
import {history, Link, useModel} from 'umi';
import styles from './index.less';
import {SYSTEM_LOGO} from "@/constants";
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
      // 登录
      const res = await login({
        ...values,
        type,
      });
      const user = res.data;
      if (user) {
        const defaultLoginSuccessMessage = 'Successfully login.';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        setUserLoginState(user);
        return;
      }
    else{
      const defaultLoginFailureMessage = 'Login failed.';
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="User Management System"
          subTitle={' ------ Software Containerization Project ----- '}
          submitter={{
            searchConfig: {
              submitText: "Login",
            },
          }}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'Login with account and password'} />
          </Tabs>
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={'Wrong account or password'} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Account: '}
                rules={[
                  {
                    required: true,
                    message: 'Input account!',
                  },
                  {
                    min:4,
                    type:'string',
                    message:'No shorter than 4 characters'
                  }
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Password:'}
                rules={[
                  {
                    required: true,
                    message: 'Input password!',
                  },
                  {
                    min:8,
                    type:'string',
                    message:'No shorter than 8 characters'
                  }
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
           >
            <ProFormCheckbox noStyle name="autoLogin">
              AutoLogin
            </ProFormCheckbox>
            <Divider type="vertical"/>
            <Link to="/user/register">No account? Register</Link>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
