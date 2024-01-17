import {ActionType, ProColumns, ProProvider, enUSIntl} from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import React, { useRef} from 'react';
import {deleteUser, searchUsers} from "@/services/ant-design-pro/api";
import {Image, Modal} from "antd";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};
const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id', //把表格的列名和后端返回的字段对应上
    valueType: 'indexBorder',
    width: 48,
    hideInSearch:true
  },
  {
    title: 'username',
    dataIndex: 'username',
    copyable: true,
  },
  {
    title: 'account',
    dataIndex: 'userAccount',
    copyable: true,
  },
  {
    title: 'avatar',
    dataIndex: 'avatarUrl',
    render: (_, record) => (
      <div>
        <Image
          src={record.avatarUrl}
          width={35}
          fallback={"https://upload.wikimedia.org/wikipedia/commons/b/bb/Talk_face.svg"}
        />
      </div>
    ),
  },
  {
    title: 'gender',
    dataIndex: 'gender',
  },
  {
    title: 'phone',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    title: 'email',
    dataIndex: 'email',
    copyable: true,
  },
  {
    title: 'account status',
    dataIndex: 'userStatus',
  },
  {
    title: 'account role',
    dataIndex: 'userRole',
    valueType: 'select', // 可枚举的值定义成select
    valueEnum: {
      0: { text: 'Normal User',status:'Default' },
      1: { text: 'Admin',status:'Success' }
    },
  },
  {
    title: 'account create time',
    dataIndex: 'createTime',
    valueType: 'dateTime',
  },

  {
    title: 'Delete',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="delete"
        onClick={async () => {
          Modal.confirm({
            title: 'Delete Warning',
            content: `Do you want to delete ${record.username} (user id: ${record.id})?`,
            okText: 'Delete',
            cancelText: 'Cancel',
            async onOk() {

              // 调用删除接口
              deleteUser(record.id).then(() => {

                // 删除操作成功后重定向到当前页面
                window.location.href = window.location.href;
              });

            },
          });
        }}
      >
        Delete
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProProvider.Provider value={enUSIntl}>
    <ProTable<API.CurrentUser>
      search={false}
      options = {false}
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        const res = await searchUsers();
        const userList = res.data;
        return {
          data: userList
        }
      }}
      // editable={{
      //   type: 'multiple',
      // }}
      // columnsState={{
      //   persistenceKey: 'pro-table-singe-demos',
      //   persistenceType: 'localStorage',
      //   defaultValue: {
      //     option: { fixed: 'right', disable: true },
      //   },
      //   onChange(value) {
      //     console.log('value: ', value);
      //   },
      // }}
      rowKey="id"
      // search={{
      //   labelWidth: 'auto',
      // }}
      // c={{
      //   setting: {
      //     listsHeight: 400,
      //   },
      // }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="Table"
    />
    </ProProvider.Provider>
  );
};
