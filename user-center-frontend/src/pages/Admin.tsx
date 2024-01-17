import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
const Admin: React.FC = (props) => {
  const{children} = props;
  return (
    <PageHeaderWrapper>
        <Alert
          message={'This page is only open to admin users.'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 48,
          }}
        />
      {children}
    </PageHeaderWrapper>
  );
};
export default Admin;
