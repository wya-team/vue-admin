import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
	}
};

const mutations = {
	ORDER_AFTER_SALE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				...data.page,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			}
		};
	},
	ORDER_AFTER_SALE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ORDER_AFTER_SALE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ORDER_AFTER_SALE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const orderAfterSale = {
	state: { ...initialState },
	mutations,
};
