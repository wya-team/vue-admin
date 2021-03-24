<template>
	<vc-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@click="handleChange"
	>
		<vc-tabs-pane 
			v-for="(item) in tabs"
			:key="item.value"
			:label="item.label" 
			:name="item.value"
		>
			<vc-paging
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:count="listInfo[item.value].count"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-order-after-sale-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			>
				<template #default="{ dataSource }">
					<tpl-item :data-source="dataSource" />
				</template>
			</vc-paging>
		</vc-tabs-pane>
	</vc-tabs>
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
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '标签一', value: '1' }, 
				{ label: '标签二', value: '2' }, 
				{ label: '标签三', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.orderAfterSale.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse();
			return this.request({
				url: 'ORDER_AFTER_SALE_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				console.log(res, 'res');
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = URL.parse(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(URL.merge({ path: '/order/after-sale', query }));
		},
		handleChangePageSize() {
			this.$store.commit('ORDER_AFTER_SALE_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
