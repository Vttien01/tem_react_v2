import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar } from 'antd';
import React from 'react';
import BaseTable from '@components/common/table/BaseTable';

import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'admin',
    username: 'User name',
    fullName: 'Full name',
    phone: 'Phone',
    group: 'Group',
    createdDate: 'Created date',
    home: 'Home',
    userAdmin: 'Admins',
});

const UserAdminListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.user,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.data,
                        total: response.data.totalElements,
                    };
                }
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 100,
            render: (avatar) => (
                <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: translate.formatMessage(message.username), dataIndex: 'username' },
        { title: translate.formatMessage(message.fullName), dataIndex: 'fullName' },
        { title: translate.formatMessage(message.phone), dataIndex: 'phone', width: '130px' },
        {
            title: translate.formatMessage(message.group),
            dataIndex: 'group',
            width: '200px',
            render: (group) => group?.name || '-',
        },
        {
            title: translate.formatMessage(message.createdDate),
            dataIndex: 'createdDate',
            width: '180px',
            // render: (createdDate) => convertUtcToTimezone(createdDate),
        },
        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '90px' }),
    ];

    const searchFields = [
        {
            key: 'username',
            placeholder: translate.formatMessage(message.username),
        },
        {
            key: 'fullName',
            placeholder: translate.formatMessage(message.fullName),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.userAdmin) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default UserAdminListPage;
