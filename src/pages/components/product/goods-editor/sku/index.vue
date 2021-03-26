<template>
	<vc-form-item label="商品规格：" class="v-product-goods-sku">
		<div>
			<span class="g-blue-btn g-m-r-16" @click="handleAddSpecItem">+添加规格</span>
			<span class="g-link-text" @click="handleAddCustomSpec">新增自定义规格</span>
			<vc-divider vertical style="margin: 0 4px !important" />
			<span class="g-link-text" @click="handleManageSpec">规格管理</span>
		</div>

		<tpl-spec-item 
			v-for="(spec, index) in curSpecDataSource"
			:key="index"
			:data-source="specList"
			:info.sync="curSpecDataSource[index]"
			@delete="handleDeleteSpecItem(index)"
		/>

		<tpl-table v-if="curSpecDataSource.length" :data-source="tableDataSource" />
	</vc-form-item>
</template>

<script>
import { cloneDeep } from 'lodash';
import SpecItem from './spec-item';
import Table from './table';
import { CustomSpec } from './popup/custom-spec';
import { ManageSpec } from './popup/manage-spec';

export default {
	name: 'tpl-product-goods-sku',
	components: {
		'tpl-spec-item': SpecItem,
		'tpl-table': Table,
	},
	props: {
		// 当前商品的规格类型数据
		specDataSource: {
			type: Array,
			default: () => ([])
		},
		// 当前商品规格设置数据
		tableDataSource: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			curSpecDataSource: cloneDeep(this.specDataSource),
			curTableDataSource: cloneDeep(this.tableDataSource),
			specList: [], // 选择规格下拉框的数据
		};
	},
	computed: {

	},
	watch: {
		specDataSource(data) {
			this.curSpecDataSource = cloneDeep(data);
		},
		tableDataSource(data) {
			this.curTableDataSource = cloneDeep(data);
		},
	},
	created() {
		this.loadSpecData();
	},
	methods: {
		loadSpecData() {
			this.$request({
				url: '_PRODUCT_GOODS_EDITOR_SPEC_LIST_GET',
				type: 'GET',
			}).then((res) => {
				this.specList = res.data;
			});
		},
		handleAddSpecItem() {
			this.curSpecDataSource.push({
				spec_value_list: [],
				spec_and_value_info: []
			});
		},
		handleDeleteSpecItem(index) {
			this.curSpecDataSource.splice(index, 1);
		},
		handleAddCustomSpec() {
			CustomSpec.popup({
			}).then((spec) => {
				console.log('spec', spec);
				this.specList.push(spec);
			});
		},
		handleManageSpec() {
			ManageSpec.popup({
				dataSource: this.specList
			}).then((specList) => {
				this.specList = cloneDeep(specList);
			});
		},
	},
};
</script>

<style lang="scss">
</style>
