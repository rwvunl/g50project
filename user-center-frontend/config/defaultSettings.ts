import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#ffb218',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'User Management Platform',
  pwa: false,
  logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Talk_face.svg',
  iconfontUrl: '',
};

export default Settings;
