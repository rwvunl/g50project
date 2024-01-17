import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import styles from './Welcome.less';
const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);
const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Alert
          message={'All users can see this welcome page.'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <a
            rel="noopener noreferrer"
            target="__blank"
          >
            User management page can only be seen by admin.
            Login via admin account to manage users.
            （admin account:admin, password:12345678）
          </a>
        </Typography.Text>
        <CodePreview>https://Github.com</CodePreview>
        <a>
          Learn more in README.md on our github repo.
        </a>
      </Card>
    </PageContainer>
  );
};
export default Welcome;
