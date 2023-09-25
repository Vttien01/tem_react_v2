import apiConfig from '@constants/apiConfig';
import NewsListPage from '.';
import CategoryListPage from './category';
import CategorySavePage from './category/CategorySavePage';
import NewsSavePage from './NewsSavePage';
import CategoryListPageDemo from './categoryDemo';
import CategorySavePageDemo from './categoryDemo/CategorySavePageDemo';
import NewsClone from './newsClone/NewsClone';
import NewsSavePageClone from './newsClone/NewsSavePageClone';
export default {
    newsListPage: {
        path: '/news',
        title: 'News',
        auth: true,
        component: NewsListPage,
        permission: [apiConfig.news.getList.baseURL],
    },
    newsListPageClone: {
        path: '/news-clone',
        title: 'News Clone',
        auth: true,
        component: NewsClone,
        permission: [apiConfig.news.getList.baseURL],
    },
    newsSavePage: {
        path: '/news/:id',
        title: 'News Save Page',
        auth: true,
        component: NewsSavePage,
        separateCheck: true,
        permission: [apiConfig.news.create.baseURL, apiConfig.news.update.baseURL],
    },
    newsSavePageClone:{
        path: '/news-clone/:id',
        title:'News Save Page Clone',
        auth: true,
        component: NewsSavePageClone,
        separateCheck: true,
        permission: [apiConfig.news.create.baseURL, apiConfig.news.update.baseURL],
    },
    newsCategoryListPage: {
        path: '/news-category',
        title: 'News Category',
        auth: true,
        component: CategoryListPage,
        permission: [apiConfig.category.getList.baseURL],
    },
    newsCategoryListPageDemo:{
        path: '/news-category-demo',
        title:'News Category Demo',
        auth: true,
        component: CategoryListPageDemo,
        permission: [apiConfig.category.getList.baseURL],
    },
    newsCategorySavePage: {
        path: '/news-category/:id',
        title: 'News Category Save Page',
        auth: true,
        component: CategorySavePage,
        permission: [apiConfig.category.create.baseURL],

    },
    newsCategorySavePageDemo: {
        path: 'news-category-demo/:id',
        title:'News Category Save Page Demo',
        auth: true,
        component: CategorySavePageDemo,
        permission: [apiConfig.category.create.baseURL]
    }
};
