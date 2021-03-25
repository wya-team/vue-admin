<template>
	<!-- 编辑、新增一级、新增二级 -->
	<vc-modal
		v-model="visible"
		:title="title"
		size="medium"
		class="v-product-category-editor"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<div style="max-height: 700px; overflow: auto;">
			<vc-form
				ref="form"
				:label-width="163"
				:model="formData"
				class="g-pd-lr-24"
			>
				<div
					v-for="(item, index) in formData.list"
					:key="item.index"
					class="g-pd-tb-24"
				>
					<vc-form-item
						v-if="index === 0 && isShowSetLevel"
						label="设置级别："
					>
						<vc-radio-group
							v-model="item.level"
							@change="handleRadio"
						>
							<vc-radio :label="1">一级</vc-radio>
							<vc-radio :label="2" class="g-m-l-24">二级</vc-radio>
						</vc-radio-group>
					</vc-form-item>
					<vc-form-item
						v-if="isShowParentCategory && item.level == 2 && index === 0"
						:prop="'list.' + index + '.parent_id'"
						:rules="{required: true, message: `分类名称不能为空`}"
						label="上级分类："
					>
						<vc-select
							v-model="item.parent_id"
							:value="String(item.parent_name)"
							clearable
							style="width: 300px"
						>
							<vc-option
								v-for="(category, categoryIndex) in categoryOneList.filter(e => e.category_id != categoryID)"
								:key="categoryIndex"
								:value="category.category_id"
							>{{ category.category_name }}</vc-option>
						</vc-select>
					</vc-form-item>
					<vc-form-item
						:label="`${item.level == 1 ? '一级' : '二级'}分类名称：`"
						:prop="'list.' + index + '.category_name'"
						:rules="{required: true, message: `分类名称不能为空`}"
					>
						<vc-input
							v-model="item.category_name"
							:maxlength="20"
							:indicator="{ inline: true }"
							placeholder="请输入"
							style="width: 300px"
						/>
					</vc-form-item>
					<vc-form-item label="关联属性组：">
						<vc-select
							v-model="item.attribute_group_id"
							:value="item.attribute_group_name"
							clearable
							style="width: 300px"
						>
							<vc-option
								v-for="(attr, attrIndex) in attributeList"
								:key="attrIndex"
								:value="attr.attribute_group_id"
							>{{ attr.attribute_group_name }}</vc-option>
						</vc-select>
					</vc-form-item>
					<vc-form-item label="排序：">
						<vc-input-number
							v-model="item.sort"
							placeholder="请输入"
							style="width: 300px"
						/>
					</vc-form-item>
					<vc-form-item
						label="分类图片："
						prop="imgs"
						style="margin-bottom: 0px !important; width: 300px;"
					>
						<vc-imgs-picker
							v-model="item.category_img"
							:max="1"
							style="width: 300px"
						/>
						<p
							v-if="index != 0"
							class="g-c-main g-pointer"
							@click="handleDelete(index)"
						>删除</p>
					</vc-form-item>
				</div>
			</vc-form>
			<div v-if="currentLevel == 1 && !isAddChild && !isEditTwoLevel" :class="{'g-bt': true}">
				<vc-button
					style="margin: 24px 0px 24px 185px"
					@click="handleAdd"
				>新增子分类</vc-button>
			</div>
		</div>
	</vc-modal>
</template>
<script>
import { Portal } from '@wya/vc';
import net from '@utils/net';

const LVELE_ONE_DATA = {
	level: 1,
	category_name: '',
	attribute_group_id: '',
	sort: '',
	category_img: [],
	parent_id: 0
};
const LVELE_TWO_DATA = {
	level: 2,
	category_name: '',
	attribute_group_id: '',
	sort: '',
	category_img: [],
};
const config = {
	name: "tpl-category-editor",
	props: {
		categoryID: Number,
		parentCategoryID: Number,
		level: Number,
		trigger: String,
	},
	mixins: [

	],
	data() {
		return {
			visible: false,
			categoryOneList: [], // TODO: tpl 
			attributeList: [], // TODO: tpl 
			formData: {
				list: []
			},
			currentLevel: this.level
		};
	},
	computed: {
		isEdit() {
			return !!this.categoryID;
		},
		isEditTwoLevel() {
			return this.isEdit && this.level == 2;
		},
		isAddChild() {
			return this.parentCategoryID;
		},
		// 新增一级分类和编辑二级分类才会有
		isShowSetLevel() {
			return (this.level == 1 && !this.isEdit) || this.isEditTwoLevel;
		},
		// filter上的新增二级分类、编辑状态下的二级分类
		isShowParentCategory() {
			return this.trigger === 'filter' || this.isEditTwoLevel;
		},
		title() {
			return this.isEdit ? '编辑分类' : '新增分类';
		},
	},
	mounted() {
		this.visible = true;
		if (this.isEdit) {
			this.loadData();
		} else {
			this.formData.list = [this.isAddChild ? { ...LVELE_TWO_DATA } : { ...LVELE_ONE_DATA }];
		}
	},
	methods: {
		loadData() {
			 this.$request({
				url: '_PRODUCT_CATEGORY_EDITOR_GET',
				type: 'GET',
				param: { category_id: this.categoryID },
			}).then(({ data }) => {
				this.formData.list = [{
					...data,
					category_img: data.category_img ? [data.category_img] : []
				}];
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		/**
		 * 分类删除
		 */
		handleDelete(index) {
			this.formData.list.splice(index, 1);
		},
		handleAdd() {
			this.formData.list = [...this.formData.list, { ...LVELE_TWO_DATA }];
		},
		handleRadio(level) {
			this.currentLevel = level;
			if (level == 2) {
				this.formData.list = [{ ...LVELE_TWO_DATA }];
			} else {
				this.formData.list = [{ ...LVELE_ONE_DATA }];
			}
		},
		handleCancel() {
			this.$emit('close');
		},
		handleOk(e, callback) {
			return new Promise((resolve, reject) => {
				this.$refs.form.validate().then(() => {
					let data = this.formData.list.map((it) => ({
						...it,
						category_img: it.category_img[0]
					}));
					this.$request({
						url: '',
						type: 'POST',
						param: data,
					}).then((res) => {
						callback();
					}).catch((error) => {
						resolve();
					});
				});
			});
		},
	}
};
export default config;

export const Editor = new Portal(config, {});
</script>
<style lang="scss">
.v-product-category-editor {
	.vc-imgs-picker-item, .vc-imgs-picker__upload {
		margin-bottom: 0px;
	}
}
</style>
