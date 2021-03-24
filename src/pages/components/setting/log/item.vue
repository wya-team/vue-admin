<template>
	<vc-table-item>
		<vc-table-column
			prop="log_id"
			label="ID"
			min-width="150"
		/>
		<vc-table-column
			prop="action_user"
			label="操作人"
			min-width="150"
		/>
		<vc-table-column
			prop="module"
			label="模块"
			min-width="150"
		/>
		<vc-table-column
			prop="info"
			label="操作详情"
			min-width="150"
		/>
		<vc-table-column
			prop="data_info"
			label="变更数据"
			min-width="220"
		>
			<template #default="{ row }">
				<vc-popover
					v-if="row.data_info.length > 50"
					content="row.data_info"
					trigger="hover"
					placement="top"
					theme="dark"
				>
					<div class="g-pointer" v-html="filterContent(row.data_info)" />
					<template #content>
						<div style="max-width: 300px;padding: 5px 0;word-wrap:break-word;" v-html="row.data_info">
							<!-- {{ row.data_info }} -->
						</div>
					</template>
				</vc-popover>
				<div v-else v-html="row.data_info" />
			</template>
		</vc-table-column>
		<vc-table-column
			prop="create_time"
			label="操作时间"
			min-width="220"
		/>
		<vc-table-column
			prop="ip"
			label="操作人IP"
			min-width="150"
		/>
	</vc-table-item>
</template>

<script>
export default {
	name: 'v-tpl-item',
	components: {

	},
	filters: {
	},
	props: {

	},
	data() {
		return {
		};
	},
	computed: {

	},
	watch: {

	},
	created() {

	},
	methods: {
		filterContent(text) {
			if (text.length > 50) { 
				return text.substr(0, 50) + '...'; 
			} else {
				return text;
			}
		},
		handleResetFirst() {
			this.$store.commit('SETTING_LOG_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SETTING_LOG_LIST_RESET', { type: this.type });
		},
	},
};
</script>

<style lang="scss">
</style>
