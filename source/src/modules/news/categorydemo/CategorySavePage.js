import CategorySavePageCommon from '@components/common/page/category/CategorySavePageCommon';
import { categoryKind } from '@constants';
import React from 'react';
import { useIntl } from 'react-intl';
import routes from '../routes';
import { defineMessages } from 'react-intl';

const message = defineMessages({
    home: 'Home',
    newsCategory: 'News Category',
});

const CategorySavePage = () => {
    const intl = useIntl();

    return (
        <CategorySavePageCommon
            routes={[
                { breadcrumbName: intl.formatMessage(message.home) },
                {
                    breadcrumbName: intl.formatMessage(message.newsCategory),
                    path: routes.newsCategoryListPageDemo.path,
                },
            ]}
            getListUrl={routes.newsCategoryListPageDemo.path}
            kind={categoryKind.news}
        />
    );
};

export default CategorySavePage;
