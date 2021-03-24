import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	ORDER_SETTING_LOGISTICS_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			...data.page,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	ORDER_SETTING_LOGISTICS_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	ORDER_SETTING_LOGISTICS_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ORDER_SETTING_LOGISTICS_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const orderSettingLogistics = {
	state: { ...initialState },
	mutations,
};
