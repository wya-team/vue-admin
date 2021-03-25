import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};
const mutations = {
	ORDER_BATCH_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			...data.page,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	ORDER_BATCH_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	ORDER_BATCH_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ORDER_BATCH_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const orderBatch = {
	state: { ...initialState },
	mutations,
};
