<template>
	<vc-form-item label="商品规格：" class="v-product-goods-sku">
		<div>
			<span class="g-blue-btn g-m-r-16" @click="handleAddSpecItem">+添加规格</span>
			<span class="g-link-text" @click="handleAddCustomSpec">新增自定义规格</span>
			<vc-divider vertical style="margin: 0 4px !important" />
			<span class="g-link-text" @click="handleManageSpec">规格管理</span>
		</div>

		<!-- TODO: 规格不能选一样 -->
		<tpl-spec-item 
			v-for="(spec, index) in curSpecDataSource"
			:key="index"
			:data-source="specList"
			:info="spec"
			@delete="handleDeleteSpecItem(index)"
			@change="handleChangeSpec(arguments[0], index)"
		/>

		<tpl-table 
			v-if="curTableDataSource.length"
			ref="table"
			:data-source.sync="curTableDataSource"
			:spec-data-source="curSpecDataSource"
			:product-image="productImage"
		/>
	</vc-form-item>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash';
import SpecItem from './spec-item';
import Table from './table';
import { CustomSpec } from './popup/custom-spec';
import { ManageSpec } from './popup/manage-spec';
import { combineSpec } from './utils';

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
		},
		// 商品主图,拿第一张
		productImage: String
	},
	data() {
		return {
			curSpecDataSource: cloneDeep(this.specDataSource),
			curTableDataSource: cloneDeep(this.tableDataSource),
			specList: [], // 选择规格下拉框的数据
		};
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
		createTableDataSource() {
			return combineSpec(this.curSpecDataSource).map((spec, i) => {
				let { spec_value_arr } = spec;
				let index = this.curTableDataSource.findIndex((table) => isEqual(table.spec_value_arr.sort(), spec_value_arr.sort()));
				if (index > -1) return this.curTableDataSource[index];
				return spec;
			});
		},
		handleAddSpecItem() {
			this.curSpecDataSource.push({
				spec_value_list: [], // 所有的规格值
				spec_value_arr: [], // 选中的规格值
			});
		},
		handleDeleteSpecItem(index) {
			this.curSpecDataSource.splice(index, 1);
		},
		handleChangeSpec(specInfo, index) {
			this.$set(this.curSpecDataSource, index, specInfo);
			this.curTableDataSource = this.createTableDataSource(); // 更改规格需要重新生成表格数据
		},
		handleAddCustomSpec() {
			CustomSpec.popup({
			}).then((spec) => {
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
		validate() {
			if (this.$refs.table) {
				return this.$refs.table.validate();
			}
			return Promise.resolve();
		}
	},
};
</script>

<style lang="scss">
</style>
