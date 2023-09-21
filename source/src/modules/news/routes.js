import apiConfig from '@constants/apiConfig';
import NewsListPage from '.';
import CategoryListPage from './category';
import CategorySavePage from './category/CategorySavePage';
import CategorySavePageDemo from './categorydemo/CategorySavePage';
import NewsSavePage from './NewsSavePage';
import newsSavePageDemo from './NewsSavePageDemo';


export default {
    newsListPage: {
        path: '/news',
        title: 'News',
        auth: true,
        component: NewsListPage,
        // permission: [apiConfig.news.getList.baseURL],
    },
    newsSavePage: {
        path: '/news/:id',
        title: 'News Save Page',
        auth: true,
        component: NewsSavePage,
    },
    newsListPageDemo: {
        path: '/news-list-demo',
        title: 'News',
        auth: true,
        component: NewsListPage,
        // permission: [apiConfig.news.getList.baseURL],
    },
    newsSavePageDemo: {
        path: '/news-list-demo/:id',
        title: 'News Save Page',
        auth: true,
        component: newsSavePageDemo,
    },
    newsCategoryListPage: {
        path: '/news-category',
        title: 'News Category',
        auth: true,
        component: CategoryListPage,
    },
    newsCategoryListPageDemo: {
        path: '/news-category-demo',
        title: 'News Category',
        auth: true,
        component: CategoryListPage,
    },
    newsCategorySavePage: {
        path: '/news-category/:id',
        title: 'News Category Save Page',
        auth: true,
        component: CategorySavePage,
    },
    newsCategorySavePageDemo: {
        path: '/news-category-demo/:id',
        title: 'News Category Save Page Demo',
        auth: true,
        component: CategorySavePageDemo,
    },
};
