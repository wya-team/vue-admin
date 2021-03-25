<template>
	<vc-paging
		ref="tableTarget"
		:key="tableKey"
		:data-source="listInfo.data"
		:total="listInfo.total"
		:reset="listInfo.reset"
		:count="listInfo.count"
		:history="true"
		:load-data="loadData"
		:table-opts="table"
		mode="table"
		class="g-m-t-24 v-product-category-list"
		@page-size-change="handleResetFirst"
		@sort-change="handleSortChange"
	>
		<tpl-item :info="listInfo.data" />
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
			table: {
				lazy: true,
				rowKey: 'category_id',
				defaultSort: {
					prop: query.sort_field,
					order: query.sort_order,
				},
				loadExpand: this.loadExpand,
			}
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.productCategory.listInfo;
		},
		tableKey() {
			return this.$store.state.productCategory.tableKey;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse();
			return this.request({
				url: 'PRODUCT_CATEGORY_LIST_GET',
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
		handleResetFirst() {
			this.$store.commit('PRODUCT_CATEGORY_LIST_INIT');
		},
		/**
		 * 展开分类
		 */
		loadExpand(tree, treeNode) {
			return new Promise((resolve, reject) => {
				this.$request({
					url: '_PRODUCT_CATEGORY_GET_CHILD_GET',
					type: 'GET',
					param: { category_id: tree.category_id },
					loading: false
				}).then(({ data }) => {
					data.forEach(it => {
						it.isChild = true;
					});
					resolve(data);
				}).catch((error) => {
					reject();
					console.log(error, 'error');
				});
			});
		},
		handleSortChange(sortInfo) {
			this.table.defaultSort = sortInfo;
			this.$router.replace(URL.merge({
				path: '/product/category',
				query: {
					...this.$route.query,
					sort_field: sortInfo.order ? sortInfo.prop : '',
					sort_order: sortInfo.order
				}
			}));
			this.handleResetFirst();
		}
	}
};

</script>
<style lang="scss">

</style>
