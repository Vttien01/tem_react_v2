import React from "react";
import CategorySavePageCommonDemo from '@components/common/page/categoryDemo/CategorySavePageCommonDemo';
import { defineMessages, useIntl } from "react-intl";
import routes from "../routes";
import { categoryKind } from '@constants';

const message = defineMessages({
    home: 'Home',
    newsCategoryDemo: 'News Category Demo',
});
const CategorySavePageDemo = () => {
    const intl = useIntl();
    const queryParameters = new URLSearchParams(window.location.search);
    const parentId = queryParameters.get("parentId");
    console.log("parentid +savepage",parentId);
    return(
        <CategorySavePageCommonDemo
            parentId={parentId}
            routes={[
                { breadcrumbName: intl.formatMessage(message.home) },
                {
                    breadcrumbName: intl.formatMessage(message.newsCategoryDemo),
                    path: routes.newsCategoryListPageDemo.path,
                },
            ]}
            getListUrl={routes.newsCategoryListPageDemo.path}
            kind={categoryKind.news}
        />
    );
};

export default CategorySavePageDemo;