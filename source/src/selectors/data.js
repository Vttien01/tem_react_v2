import { createSelector } from 'reselect';

export const selectLoadData = createSelector([(state) => state.data], (acc) => acc.data);
export const selectLoadDataKey = createSelector([(state) => state.data], (acc) => acc.key);
export const selectLoadDataPagination = createSelector([(state) => state.data], (acc) => acc.total);

const dataSelectors = {
    selectLoadData,
    selectLoadDataKey,
    selectLoadDataPagination,
};

export default dataSelectors;
