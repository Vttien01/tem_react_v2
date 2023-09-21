import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar,Tag } from 'antd';
import React from 'react';
import BaseTable from '@components/common/table/BaseTable';

import { UserOutlined } from '@ant-design/icons';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';

const message = defineMessages({
    objectName: 'category',
    name: 'Name',
    createdDate: 'Created date',
    currentDate: 'Current Date',
    createdBy: 'Created By'

});

const CategoryListPageCommon = ({ routes, kind }) => {
    const translate = useTranslate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.category,
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

            const prepareGetListParams = funcs.prepareGetListParams;
            funcs.prepareGetListParams = (params) => {
                return {
                    ...prepareGetListParams(params),
                    kind: kind,
                };
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'categoryImage',
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
        { title: translate.formatMessage(message.name), dataIndex: 'categoryName' },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '90px' }),
        {
            title: translate.formatMessage(message.createdDate),
            dataIndex: 'createdDate',
            width: '80px',
            // render: (createdDate) => convertUtcToTimezone(createdDate),
        },
        {
            title: translate.formatMessage(message.createdBy), // Tiêu đề cho trường ngày hiện tại
            dataIndex: 'createdBy', // Tên của trường ngày hiện tại
            width: '80px', // Độ rộng của cột
        },
        mixinFuncs.renderStatusColumn({ width: '90px' }),

    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    return (
        <PageWrapper routes={routes}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                    />
                }
            />
        </PageWrapper>
    );
};

export default CategoryListPageCommon;
