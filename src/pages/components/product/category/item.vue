<template>
	<vc-table-item>
		<vc-table-column
			:width="300"
			prop="category_name"
			label="分类"
		/>
		<vc-table-column
			prop="orders_sn"
			label="分类图片"
			width="80"
		>
			<template #default="it">
				<img v-if="it.row.category_img" :src="it.row.category_img + '!4-4'" class="g-imgr-56">
				<span v-else class="g-block g-imgr-56">--</span>
			</template>
		</vc-table-column>
		<vc-table-column
			prop="goods_num"
			label="商品数量"
			min-width="110"
		>
			<template #default="{ row }">
				<span class="g-link-text">
					{{ row.goods_num }}
				</span>
			</template>
		</vc-table-column>
		<vc-table-column
			prop="sort"
			label="排序"
			min-width="110"
		/>
		<vc-table-column
			prop="create_time"
			label="创建时间"
			min-width="140"
			sortable
		>
			<template #default="it">
				<div>{{ it.row.create_time }}</div>
			</template>
		</vc-table-column>
		<vc-table-column
			prop="set"
			label="操作"
			align="right"
			width="150px"
			fixed="right"
		>
			<template #default="{ row }">
				<vca-table-operate 
					:data-source="getOperations(row)"
					@ok="(label, operate) => handleOperation(operate.value, row)"
				/>
			</template>
		</vc-table-column>
	</vc-table-item>
</template>

<script>
import { Modal } from "@wya/vc";
import { debounce } from 'lodash';
import { URL } from '@utils/utils';
import { Editor } from './popup/editor';

export default {
	name: 'tpl-product-category-item',
	methods: {
		handleResetFirst() {
			this.$store.commit('PRODUCT_CATEGORY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('PRODUCT_CATEGORY_LIST_RESET');
		},
		getOperations(row) {
			let operations = [
				{ label: '编辑', value: 'edit' },
				{ 
					label: '删除',
					value: 'delete',
					message: '你确认要删除该分类吗？',
				}
			];
			
			if (row.level == 1) { // 一级子分类 TODO: tpl
				operations.push({ label: '新增子分类', value: 'add' });
			}
			return operations;
		},
		handleOperation(type, row) {
			switch (type) {
				case 'edit':
					this.handleEdit(row);
					break;
				case 'delete':
					this.handleDelete(row);
					break;
				case 'add':
					this.handleAddChild(row);
					break;
				default:
					break;
			}
		},
		handleEdit({ category_id, level }) {
			Editor.popup({
				categoryID: category_id,
				level,
			}).then((res) => {
				this.handleResetCur();
			}).catch((res) => {
				console.log(res, 'close');
			});
		},
		handleAddChild(row) {
			Editor.popup({
				parentCategoryID: row.category_id,
				level: 2,
			}).then((res) => {
				this.handleResetCur();
			}).catch((res) => {
				console.log(res, 'close');
			});
		},
		handleDelete(row) {
			this.$request({
				url: "_PRODUCT_CATEGORY_DELETE_POST",
				type: "POST",
				param: { category_id: row.category_id },
				loading: false
			}).then(res => {
				this.handleResetFirst();
			}).catch(error => {
			});
		},
	},
};
</script>

<style lang="scss">
</style>
