import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	PRODUCT_CATEGORY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			...data.page,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	PRODUCT_CATEGORY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	PRODUCT_CATEGORY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	PRODUCT_CATEGORY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const productCategory = {
	state: { ...initialState },
	mutations,
};
