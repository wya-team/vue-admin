<template>
	<vc-paging
		ref="tableTarget"
		:columns="columns"
		:data-source="listInfo.data" 
		:total="listInfo.total"
		:count="listInfo.count"
		:reset="listInfo.reset"
		:history="true"
		:load-data="loadData"
		mode="native"
		class="g-m-t-20 v-order-setting-template-list"
		@page-size-change="handleChangePageSize"
	>
		<template #default="{ it }">
			<tpl-item :it="it" />
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
			columns: ['Header - 1', 'Header - 2', 'Header - 3', 'Header - 4'],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.orderSettingTemplate.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse();
			return this.request({
				url: 'ORDER_SETTING_TEMPLATE_LIST_GET',
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
			this.$store.commit('ORDER_SETTING_TEMPLATE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-order-setting-template-list table {
	width: 100%;
	thead {
		th {
			text-align: left;
			height: 40px;
			white-space: nowrap;
			overflow: hidden;
			background-color: #f8f8f9;

		}
	}
	tbody {
		background-color: #ffffff;
		td {
			text-align: left;
			height: 40px;
			white-space: nowrap;
			overflow: hidden;
			border: 1px solid #ccc!important
		}
		tr {
			border: 1px solid red!important
		}
	}
}

</style>
