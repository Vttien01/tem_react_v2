import React from 'react';

import CategoryListPageCommonDemo from "@components/common/page/categoryDemo";

import { defineMessages, useIntl } from 'react-intl';
import routes from '../routes';

const message = defineMessages({
    home: 'Home',
    newsCategoryDemo: 'News Category Demo',
});

const CategoryListPageDemo = () => {
    const intl = useIntl();

    return (
        <CategoryListPageCommonDemo 
            routes = {[
                { breadcrumbName: intl.formatMessage(message.home) },
                { breadcrumbName: intl.formatMessage(message.newsCategoryDemo),
                    path: routes.newsCategoryListPageDemo.path,
                },
            ]}
        />
    );
};
export default CategoryListPageDemo; 