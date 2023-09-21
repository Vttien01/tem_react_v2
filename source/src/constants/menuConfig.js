import React from 'react';
import {
    UsergroupAddOutlined,
    ControlOutlined,
    InboxOutlined,
} from '@ant-design/icons';
import routes from '@routes';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';


const navMenuConfig = [
    {
        label: <FormattedMessage  defaultMessage='User management'/>,
        key: 'user-management',
        icon: <UsergroupAddOutlined />,
        children: [
            {
                label: <FormattedMessage  defaultMessage='Admins'/>,
                key: 'admin',
                path: routes.adminsListPage.path,
                permission: [apiConfig.user.getList.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage  defaultMessage='News management'/>,
        key: 'news-management',
        icon: <InboxOutlined />,
        children: [
            {
                label: <FormattedMessage  defaultMessage='News'/>,
                key: 'news-list',
                path: routes.newsListPage.path,
                permission: [apiConfig.news.getList.baseURL],
            },
            {
                label: <FormattedMessage  defaultMessage='News 2'/>,
                key: 'news-list-demo',
                path: routes.newsListPageDemo.path,
                permission: [apiConfig.news.getList.baseURL],
            },
            {
                label: <FormattedMessage  defaultMessage='News category'/>,
                key: 'news-category',
                path: routes.newsCategoryListPage.path,
                permission: [apiConfig.category.getList.baseURL],
            },
            {
                label: <FormattedMessage  defaultMessage='News category Demo'/>,
                key: 'news-category-demo',
                path: routes.newsCategorySavePageDemo.path,
                permission: [apiConfig.category.getList.baseURL],
            },
        ],
    },
    {
        label: <FormattedMessage  defaultMessage='System management'/>,
        key: 'system-management',
        icon: <ControlOutlined />,
        children: [
            {
                label: <FormattedMessage  defaultMessage='Role'/>,
                key: 'role',
                path: routes.groupPermissionPage.path,
                permission: [apiConfig.groupPermission.getGroupList.baseURL],
            },
        ],
    },
];

export default navMenuConfig;
