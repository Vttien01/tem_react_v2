import { createReducer } from '@store/utils';
import { appActions } from '@store/actions';

const { saveData } = appActions;

const initialState = {
    data: null,
    key: null,
    total: null,
};

const dataReducer = createReducer(
    {
        reducerName: 'data',
        initialState,
        storage: false,
    },
    {
        [saveData.type]: (state, { payload: { key, data, total} }) => {
            state.data = data || null;
            state.key = key;
            state.total = total;
        },
    }
);

export default dataReducer;
