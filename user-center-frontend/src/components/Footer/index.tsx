import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
const Footer: React.FC = () => {
  const defaultMessage = 'Created by Group 50 - Ivy Rui Wang, Delong Yuan, Mingjiang Ma';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: <> <GithubOutlined /> Software Containerization Project</>,
          href: 'https://github.com',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
