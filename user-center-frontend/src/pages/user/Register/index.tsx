import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import {  message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import {SYSTEM_LOGO} from "@/constants";
// const LoginMessage: React.FC<{
//   content: string;
// }> = ({ content }) => (
//   <Alert
//     style={{
//       marginBottom: 24,
//     }}
//     message={content}
//     type="error"
//     showIcon
//   />
// );
const Register: React.FC = () => {
  // const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  // const { initialState, setInitialState } = useModel('@@initialState');
  // const fetchUserInfo = async () => {
  //   const userInfo = await initialState?.fetchUserInfo?.();
  //   if (userInfo) {
  //     await setInitialState((s) => ({
  //       ...s,
  //       currentUser: userInfo,
  //     }));
  //   }
  // };
  const handleSubmit = async (values: API.RegisterParams) => {

      const {userPassword, checkPassword} = values;
      // 简单校验
      if (userPassword !== checkPassword) {
        const defaultRegisterFailureMessage = 'Please enter same password!';
        message.error(defaultRegisterFailureMessage);
        return;
      }
    try {
        // 注册
      const res = await register(values);
      if(res.code === 0 && res.data >0){
        const defaultRegisterSuccessMessage = 'Successfully registered!';
        message.success(defaultRegisterSuccessMessage);

        // 注册成功后跳转到登陆前的位置，即回到登陆页
        /*此方法会跳转到redirect参数所在的位置*/
        if (!history) return; // 若history api未初始化好，直接return，运行下面会报错
        const {query} = history.location;
        history.push({
          pathname:'user/login',
          query
        })
        return;
      }else{
        throw new Error(res.description);
      }
    } catch (e: any) {
      const defaultRegisterFailureMessage = 'Register failed, please try again!';
      message.error(e.message ?? defaultRegisterFailureMessage);
    }
  };
  // const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="User Management System"
          subTitle={' ------ Software Containerization Project ----- '}
          submitter={{
            searchConfig: {
              submitText: "Register",
            },
          }}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'Register with account and password'} />
          </Tabs>
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
                    message: 'Please input account!',
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
                placeholder={'Input password:'}
                rules={[
                  {
                    required: true,
                    message: 'Please input password!',
                  },
                  {
                    min:8,
                    type:'string',
                    message:'No shorter than 8 characters'
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'Input password again:'}
                rules={[
                  {
                    required: true,
                    message: 'Please input password again!',
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
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
