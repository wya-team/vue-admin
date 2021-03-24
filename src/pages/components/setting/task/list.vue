<template>
	<vc-paging
		ref="tableTarget"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:count="listInfo.count"
		:history="true"
		:load-data="loadData"
		mode="table"
		class="g-m-t-20 v-setting-task-list"
		@page-size-change="handleChangePageSize"
	>
		<tpl-item />
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
			return this.$store.state.settingTask.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse();
			return this.request({
				url: 'SETTING_TASK_LIST_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
				// console.log(res, 'res');
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChangePageSize() {
			this.$store.commit('SETTING_TASK_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
