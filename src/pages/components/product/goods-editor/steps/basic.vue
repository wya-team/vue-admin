<template>
	<div class="v-product-goods-basic">
		<vc-form
			ref="form"
			:model="formData"
			:rules="ruleValidate"
			:label-width="190"
			position="left"
			@submit.native.prevent
		>
			<!-- 如果有多个设置块，建议每个块一个文件，方便阅读 -->
			<vca-section-title content="基础信息" />
			<div class="g-m-t-24">
				<vc-form-item label="商品名称：" prop="product_name">
					<vc-input
						v-model="formData.product_name"
						:maxlength="100"
						placeholder="请输入商品名称"
						:indicator="{ inline: true, inverted: false }"
						style="width:300px"
					/>
				</vc-form-item>
				<vc-form-item label="商品主图：" prop="image_list" required>
					<vc-upload-picker
						v-model="formData.image_list"
						:picker="['image']"
						:max="{image: 10}"
						sortable
					/>
					<div class="g-c-999 g-m-t-5" style="line-height: 1">建议尺寸：640x640像素。最多上传10张，拖拽可调整顺序，默认第一张为商品主图</div>
				</vc-form-item>
				<vc-form-item label="商品货号：" prop="product_sn">
					<vc-input
						v-model="formData.product_sn"
						:maxlength="64"
						placeholder="请输入商品货号"
						style="width:300px"
					/>
				</vc-form-item>
				<vc-form-item label="商品排序：" prop="sort">
					<vc-input 
						v-model="formData.sort" 
						placeholder="请输入" 
						style="width:300px"
					/>
					<p class="g-c-999 g-m-t-5" style="line-height: 1">数值越大，在商品列表以及手机端分类选购中的位置越靠前</p>
				</vc-form-item>
				<vc-form-item label="基础销量：" prop="base_sales">
					<vc-input 
						v-model="formData.base_sales" 
						placeholder="请输入" 
						style="width:300px"
					/>
					<p class="g-c-999 g-m-t-5" style="line-height: 1">新品销量较低时，可以使用基础销量为商品增加销量</p>
				</vc-form-item>

				<tpl-sku 
					ref="sku"
					:spec-data-source="formData.spec"
					:table-data-source="formData.sku_table"
					:product-image="(formData.image_list || [])[0]"
				/>
			</div>
		</vc-form>
	</div>
</template>

<script>
import SKU from '../sku/index';

export default {
	name: 'tpl-product-goods-basic',
	components: {
		'tpl-sku': SKU
	},
	props: {

	},
	data() {
		return {
			formData: {
				image_list: []
			},
			ruleValidate: {
				product_name: [{ required: true, message: '请填写商品名称' }],
				image_list: [{ required: true, message: '请选择商品主图' }],
				product_sn: [{ required: true, message: '请填写商品货号' }],
			}
		};
	},
	methods: {
		async validate() {
			await this.$refs.sku.validate();
			return this.$refs.form.validate();
		}
	},
};
</script>

<style lang="scss">
.v-product-goods-basic {
	margin-top: 24px;
}
</style>
