import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	},
	tableKey: 0
};

const mutations = {
	PRODUCT_CATEGORY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		// TODO: tpl
		for (let i = 0; i < data.list.length; i++) {
			if (data.list[i].child_category_num > 0) {
				data.list[i].hasChildren = true;
			}	
		}
		state.listInfo = {
			...state.listInfo,
			...data.page,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	PRODUCT_CATEGORY_LIST_RESET(state) {
		state.tableKey += 1;
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	PRODUCT_CATEGORY_LIST_INIT(state, payload) {
		state.tableKey += 1;
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
