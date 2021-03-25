<template>
	<vc-paging
		:data-source="listInfo.data"
		:total="listInfo.total"
		:count="listInfo.count"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		class="v-order-setting-logistics-list"
		mode="table"
		@page-size-change="handleChangePageSize"
	>
		<tpl-item />
	</vc-paging>
</template>
<script>
import { URL } from '@utils/utils';
import Item from './item';

export default {
	name: 'tpl-logistics-table',
	components: {
		'tpl-item': Item,
	},
	data() {
		const { query } = this.$route;
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.orderSettingLogistics.listInfo;
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse(); 
			return this.request({
				url: 'ORDER_SETTING_LOGISTICS_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChangePageSize() {
			this.$store.commit('ORDER_SETTING_LOGISTICS_LIST_INIT');
		}
	}

    
};
</script>
<style lang="scss">
.v-order-setting-logistics-list {
	._red-label {
		padding: 0 5px;
		display: inline-block;
		height: 18px;;
		line-height: 18px;;
		font-size: 12px;
		color: #fff;
		background-color: $label-red;
		border-radius: 8px;
		flex-shrink: 0;
	}
}
</style>

