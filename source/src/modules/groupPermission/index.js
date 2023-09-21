import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';
import BaseTable from '@components/common/table/BaseTable';

import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { defineMessages } from 'react-intl';
import useTranslate from '@hooks/useTranslate';

const message = defineMessages({
    objectName: 'group permission',
    name: 'Name',
    description: 'Description',
    home: 'Home',
    groupPermission: 'Group Permission',
});

const GroupPermissionListPage = () => {
    const translate = useTranslate();
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.groupPermission,
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
        { title: translate.formatMessage(message.name), dataIndex: 'name' },
        { title: translate.formatMessage(message.description), dataIndex: 'description', width: 200 },
        mixinFuncs.renderActionColumn({ edit: true }, { width: '100px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.groupPermission) },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
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

export default GroupPermissionListPage;
