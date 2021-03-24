<template>
	<vc-paging
		ref="tableTarget"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:count="listInfo.count"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20 v-order-setting-self-addr-list"
		@page-size-change="handleChangePageSize"
	>
		<template #default="{ dataSource }">
			<tpl-item :data-source="dataSource" />
		</template>
	</vc-paging>
</template>

<script>
import { URL } from '@utils/utils';
import Item from './item';

export default {
	name: 'tpl-table',
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
			return this.$store.state.orderSettingSelfAddr.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse();
			return this.request({
				url: 'ORDER_SETTING_SELF_ADDR_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				console.log(res, 'res');
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChangePageSize() {
			this.$store.commit('ORDER_SETTING_SELF_ADDR_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
