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
				:columns="columns"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:count="listInfo[item.value].count"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				class="v-order-main-all-list"
				mode="native"
				@page-size-change="handleChangePageSize"
			>
				<template #default="{ it }">
					<tpl-item :it="it" />
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
			columns: ['Header - 1', 'Header - 2', 'Header - 3', 'Header - 4'],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.orderMainAll.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse();
			return this.request({
				url: 'ORDER_MAIN_ALL_LIST_GET',
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
			this.$router.replace(URL.merge({ path: '/order/main/all', query }));
		},
		handleChangePageSize() {
			this.$store.commit('ORDER_MAIN_ALL_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">
.v-order-main-all-list table {
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
