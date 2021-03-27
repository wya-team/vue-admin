<template>
	<div class="v-product-goods-sku-spec-item g-b g-m-tb-16">
		<div class="_header g-flex-ac g-jc-sb">
			<vc-select
				:value="info.spec_id"
				class="g-m-l-24"
				style="width: 180px;"
				transfer
				@change="handleSelectSpecType"
			>
				<vc-option
					v-for="(item, index) in dataSource"
					:key="index"
					:value="item.spec_id"
				>
					{{ item.spec_name }}
				</vc-option>
			</vc-select>
			<span class="g-link-text g-m-r-24" @click="$emit('delete')">
				删除
			</span>
		</div>
		<div class="g-pd-24">
			<vc-checkbox-group 
				:value="info.spec_value_arr"
				class="g-inline-block"
				@change="handleSelectSpecValue"
			>
				<vc-checkbox 
					v-for="(it, index) in info.spec_value_list"
					:key="index"
					:label="it.spec_value_id"
					class="_spec-value-item"
				>
					{{ it.spec_value_name }}
					<span class="_delete g-link-text" @click.stop="handleDeleteSpecValue(it.spec_value_id, index)">删除</span>
				</vc-checkbox>
			</vc-checkbox-group>
			<span class="g-link-text" @click="handleAddSpecValue">添加</span>
		</div>
	</div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { AddSpecValue } from './popup/add-spec-value';

export default {
	name: 'tpl-product-goods-sku-spec-item',
	props: {
		// 选择规格的下拉框数据
		dataSource: {
			type: Array,
			default: () => ([])
		},
		// 当前规格的信息
		info: {
			type: Object,
			defualt: () => ({})
		}
	},
	mounted() {
		if (this.info.spec_id) {
			this.loadSpecValue(this.info.spec_id);
		}
	},
	methods: {
		loadSpecValue(spec_id) {
			this.$request({
				url: '_PRODUCT_GOODS_EDITOR_SPEC_VALUE_GET',
				type: 'GET',
				param: { spec_id },
			}).then((res) => {
				this.sync({ spec_value_list: res.data });
			});
		},
		handleSelectSpecType(spec_id, spec_name) {
			this.sync({ spec_id, spec_name });
			this.loadSpecValue(spec_id);
		},
		handleSelectSpecValue(value) {
			this.sync({ 
				spec_value_arr: value,
				spec_name_arr: value.map((id) => {
					let specObj = this.info.spec_value_list.find(it => it.spec_value_id == id);
					return specObj.spec_value_name;
				})
			});
		},
		handleAddSpecValue() {
			AddSpecValue.popup({
				specID: this.info.spec_id
			}).then((data) => {
				let list = cloneDeep(this.info.spec_value_list);
				list = list.concat(data);
				this.sync({ spec_value_list: list });
			});
		},
		handleDeleteSpecValue(spec_value_id, index) {
			this.$request({
				url: '_PRODUCT_GOODS_EDITOR_SPEC_VALUE_DELETE_POST',
				type: 'POST',
				param: { spec_value_id },
			}).then((res) => {
				let list = cloneDeep(this.info.spec_value_list);
				list.splice(index, 1);
				this.sync({ spec_value_list: list });
			});
		},
		sync(value) {
			this.$emit('change', { ...this.info, ...value });
		}
	},
};
</script>

<style lang="scss">
.v-product-goods-sku-spec-item {
	._header {
		background-color: #f9f9f9;
		height: 42px;
		border-bottom: 1px solid #cdcdcd;
	}
	._spec-value-item {
		margin: 10px;
		margin-left: 5px;
		&:hover {
			._delete {
				visibility: visible;
			}
		}
	}
	._delete {
		margin-left: 8px;
		visibility: hidden;
	}
}
</style>
