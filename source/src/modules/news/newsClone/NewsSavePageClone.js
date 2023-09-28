import React, { useEffect } from 'react';
import NewsForm from '../NewsForm';
import PageWrapper from '@components/common/layout/PageWrapper';
import { FormattedMessage, defineMessages } from 'react-intl';
import routes from '../routes';
import apiConfig from '@constants/apiConfig';
import useTranslate from '@hooks/useTranslate';
import useFetch from '@hooks/useFetch';
import { categoryKind } from '@constants';
import useSaveBase from '@hooks/useSaveBase';

const message=defineMessages({
    objectName: 'News Clone'
});

function NewsSavePageClone() {
    const translate = useTranslate();
    const {detail, loading, mixinFuncs,setIsChangedFormValues, isEditing,title}=useSaveBase({
        apiConfig: {
            getById: apiConfig.news.getById,
            create: apiConfig.news.create,
            update: apiConfig.news.update,
        },
        options: {
            getListUrl: routes.newsListPageClone.path,
            objectName: translate.formatMessage(message.objectName)
        },
        override:(funcs) => {
            funcs.prepareUpdateData = (data) => {
                return{
                    ...data,
                    id: detail.id
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: categoryKind. news,
                };
            };
        }
    });

    const{
        data: categories,
        loading: getCategoriesLoading,
        execute: executeGetCategories,
    } = useFetch(apiConfig.category.autocomplete,{
        immediate: false,
        mappingData: ({data}) => data.data.map((item) => ({
            value: item.id, label: item.categoryName
        }))
    });

    useEffect(() => {
        executeGetCategories({
            params:{
                kind: categoryKind.news,
            },
        });
    }, []);
    return ( 
        <PageWrapper 
            loading= {loading || getCategoriesLoading}
            routes={[
                { breadcrumbName: <FormattedMessage defaultMessage="Home" /> },
                { breadcrumbName: <FormattedMessage defaultMessage="News Clone" />, path: routes.newsListPageClone.path },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <NewsForm
                categories={categories}
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
}

export default NewsSavePageClone;