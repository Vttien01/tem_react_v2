import apiConfig from '@constants/apiConfig';
import UserAdminListPage from '.';
import UserAdminSavePage from './UserAdminSavePage';
export default {
    adminsListPage: {
        path: '/admins',
        title: 'Admins',
        auth: true,
        component: UserAdminListPage,
        permission: [apiConfig.user.getList.baseURL],
    },
    adminsSavePage: {
        path: '/admins/:id',
        title: 'Admins',
        auth: true,
        component: UserAdminSavePage,
    },
};
