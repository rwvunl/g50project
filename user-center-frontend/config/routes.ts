export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: 'Login', path: '/user/login', component: './user/Login' },
      { name: 'Register', path: '/user/register', component: './user/Register' },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: 'Welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: 'Admin Only',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      { path: '/admin/user-manage', name: 'User Management', icon: 'smile', component: './Admin/UserManage' },
      { component: './404' },
    ],
  }
];
