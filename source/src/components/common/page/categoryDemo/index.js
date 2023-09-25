import React, { useEffect } from 'react';
import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, categoryKind } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Tag } from 'antd';
import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '@hooks/useFetch';

const message = defineMessages({
    objectName: 'category',
    id: 'ID',
    name: 'Name',
    createdBy: 'Created By',
    createDate: 'Created Date',
});

const CategoryListPageCommonDemo = ({ routes }) => {
    const translate = useTranslate();
    const { pathname: pagePath } = useLocation();
    const queryParameters = new URLSearchParams(window.location.search);
    const parentId = queryParameters.get('parentId');
    const categoryName = queryParameters.get('categoryName');
    console.log("parentId indexcategoryDemo "+parentId);
    const navigate = useNavigate();
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
            funcs.getCreateLink = () => {
                if (parentId) {
                    return `${pagePath}/create?parentId=${parentId}`;
                } else {
                    return `${pagePath}/create`;
                }
            };
            funcs.handleFilterSearchChange = (values) => {
                const queryParams = {
                    ...queryFilter,
                    ...values,
                };
                if ('page' in queryParams) {
                    delete queryParams.page;
                }
                mixinFuncs.changeFilter(queryParams);
            };
        },
    });

    const handleOnClick = (event, record) => {
        event.preventDefault();
        navigate(`?parentId=${record.id}&categoryName=${record.categoryName}`);
        // navigate(`?parentId=${record.id}`);
    };

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
        {
            title: translate.formatMessage(message.name),
            dataIndex: 'categoryName',
            align: 'center',
            render: (categoryName, record) =>
                !record.parentId ? (
                    <div
                        onClick={(event) => handleOnClick(event, record)}
                        style={{ color: 'blue', cursor: 'pointer', fontSize: '16px' }}
                    >
                        {categoryName}
                    </div>
                ) : (
                    <div>{categoryName}</div>
                ),
        },
        {
            title: translate.formatMessage(message.createdBy),
            dataIndex: 'createdBy',
            align: 'center',
            render: (createdBy) => (
                <Tag color="#108ee9">
                    <div style={{ padding: '5px', fontSize: '16px' }}>{createdBy}</div>
                </Tag>
            ),
        },
        { title: translate.formatMessage(message.createDate), dataIndex: 'createdDate', align: 'center' },
        mixinFuncs.renderActionColumn({ edit: true, delete: true }, { width: '90px' }),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.name),
        },
    ];

    const customChangeFilter = (filter) => {
        // Thêm parentId và categoryName vào filter nếu chúng tồn tại
        if (parentId) {
            filter.parentId = parentId;
        }
        if (categoryName) {
            filter.categoryName = categoryName;
        }
        // Gọi hàm gốc để thay đổi URL
        mixinFuncs.changeFilter(filter);
    };


    // const {
    //     data: categories,
    //     loading: getCategoriesLoading,
    //     execute: executeGetCategories,
    // } = useFetch(apiConfig.category.autocomplete, {
    //     immediate: false,
    //     mappingData: ({ data }) => data.data.map((item) => ({ 
    //         value: item.id, label: item.categoryName })),
    // });

    // useEffect(() => {
    //     executeGetCategories({
    //         params: {
    //             kind: categoryKind.news,
    //         },
    //     });
    // }, []);


    // if (parentId) {
    //     console.log(categories);
    //     console.log(parentId);
    //     const foundItem = categories.find(item => item.value == parentId);

    //     // Check if a matching item is found and update categoryName
    //     if (foundItem) {
    //         categoryName = foundItem.label;
    //     }

    //     console.log(categoryName);
    // }
    return (
        <PageWrapper routes={categoryName ? [...routes, { breadcrumbName: categoryName }] : [...routes]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: queryFilter,
                    parentId: parentId,
                    onReset: () => {
                        // Gọi hàm customChangeFilter để giữ lại parentId và categoryName
                        customChangeFilter({});
                    },
                })}
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
            ></ListPage>
        </PageWrapper>
    );
};

export default CategoryListPageCommonDemo;