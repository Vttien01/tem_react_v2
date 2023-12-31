import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Avatar, Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import BaseTable from '@components/common/table/BaseTable';

import { UserOutlined } from '@ant-design/icons';
import { AppConstants, categoryKind, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import useFetch from '@hooks/useFetch';
import { FieldTypes } from '@constants/formConfig';
import useTranslate from '@hooks/useTranslate';
import { statusOptions } from '@constants/masterData';
import { EyeOutlined } from '@ant-design/icons';
import useNotification from '@hooks/useNotification';
import styles from './index.module.scss';
import { defineMessages, FormattedMessage } from 'react-intl';
import { IconPinnedOff, IconPin } from '@tabler/icons-react';
import { render } from '@testing-library/react';

const message = defineMessages({
    objectName: 'news',
    previewFailed: 'Preview failed',
    title: 'Title',
    category: 'Category',
    status: 'Status',
    home: 'Home',
    news: 'News',
});

const NewsListPage = () => {
    const translate = useTranslate();
    const notification = useNotification();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const { execute: executeUpdateNewsPin, loading: updateNewsPinLoading } = useFetch(apiConfig.news.update);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.news,
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
            funcs.additionalActionColumnButtons = () => ({
                preview: ({ id }) => (
                    <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => {
                            executeGetNews({
                                pathParams: {
                                    id,
                                },
                                onCompleted: () => setShowPreviewModal(true),
                                onError: () =>
                                    notification({ type: 'error', title: 'Error', message: translate.formatMessage(message.previewFailed) }),
                            });
                        }}
                    >
                        <EyeOutlined />
                    </Button>
                ),
            });
        },
    });

    const {
        execute: executeGetNews,
        loading: getNewsLoading,
        data: newsContent,
    } = useFetch(apiConfig.news.getById, {
        immediate: false,
        mappingData: ({ data }) => ({ content: data.content, newTitle: data.title }),
    });
    const {
        data: categories,
        loading: getCategoriesLoading,
        execute: executeGetCategories,
    } = useFetch(apiConfig.category.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.data.map((item) => ({ value: String(item.id), label: item.categoryName })),
    });

    const handleUpdatePinTop = (item) => {
        executeUpdateNewsPin({
            pathParams: {
                id: item.id,
            },
            data: {
                ...item,
                pinTop: Number(!item.pinTop),
            },
        });
    };
    const handleRowClick = (dataRow) => {
        // usenavigate(mixinFuncs.getItemDetailLink(dataRow), {
        //     state: { action: 'edit', prevPath: location.pathname },
        // });
    };

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
        { title: <FormattedMessage defaultMessage="Title" />, dataIndex: 'title' },
        {
            title: <FormattedMessage defaultMessage="Category" />,
            width: 120,
            dataIndex: 'categoryId',
            render: (dataRow) => {
                const category = categories?.find((item) => item.value == dataRow);

                return (
                    <Tag color="#108ee9">
                        <div style={{ padding: '0 4px', fontSize: 14 }}>{category?.label}</div>
                    </Tag>
                );
            },
        },
        {
            title: <FormattedMessage defaultMessage="Created Date" />,
            width: 180,
            dataIndex: 'createdDate',
        },
        {
            title: <FormattedMessage defaultMessage="Pin top" />,
            width: 80,
            align: 'center',
            render: (dataRow) => {
                const Icon = dataRow.pinTop ? IconPin : IconPinnedOff;

                return <Icon onClick={() => handleUpdatePinTop(dataRow)} size={18} />;
            },
        },
        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn({ preview: true, edit: true, delete: true }, { width: '130px' }),

    ];

    const searchFields = [
        {
            key: 'title',
            placeholder: translate.formatMessage(message.title),
        },
        {
            key: 'categoryId',
            placeholder: translate.formatMessage(message.category),
            type: FieldTypes.SELECT,
            options: categories,
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(message.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];

    useEffect(() => {
        executeGetCategories({
            params: {
                kind: categoryKind.news,
            },
        });
    }, []);

    return (
        <PageWrapper
            loading={getNewsLoading}
            routes={[
                { breadcrumbName: translate.formatMessage(message.home) },
                { breadcrumbName: translate.formatMessage(message.news) },
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
                        loading={loading || getCategoriesLoading || updateNewsPinLoading}
                        onRow={(dataRow) => ({
                            onClick: () => handleRowClick(dataRow), // Xác định hành động onClick cho từng hàng
                        })}
                        pagination={pagination}
                    />
                }
            />
            <Modal
                title={<FormattedMessage defaultMessage="{title}" values={{ title: newsContent?.newTitle }} />}
                width={1000}
                open={showPreviewModal}
                footer={null}
                centered
                onCancel={() => setShowPreviewModal(false)}
            >

                {newsContent?.content && (
                    <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: newsContent?.content }}></div>
                )}
            </Modal>
        </PageWrapper>
    );
};

export default NewsListPage;
