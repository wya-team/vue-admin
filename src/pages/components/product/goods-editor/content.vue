<template>
	<div class="v-product-goods-editor">
		<vc-steps-bar v-model="step" :data-source="STEPS" readonly />

		<tpl-basic v-if="step == 1" ref="basic" />
		<tpl-detail v-else-if="step == 2" />

		<vca-footer 
			:ok-text="okText"
			:cancel-text="cancelText"
			@ok="handleOk"
			@cancel="handleCancel"
		/>
	</div>
</template>

<script>
import Basic from './steps/basic';
import Detail from './steps/detail';

export default {
	name: 'tpl-content',
	components: {
		'tpl-basic': Basic,
		'tpl-detail': Detail,
	},
	data() {
		return {
			step: 1,
			STEPS: [
				{ value: 1, label: '1、基本信息' },
				{ value: 2, label: '2、商品详情' }
			]
		};
	},
	computed: {
		okText() {
			return this.step == 1 ? '下一步' : '保存';
		},
		cancelText() {
			return this.step == 1 ? '取消' : '上一步';
		},
	},
	methods: {
		handleCancel() {},
		async handleOk() {
			if (this.step == 1) {
				await this.$refs.basic.validate();
				this.step = 2;
			}
		}
	},
};
</script>

<style lang="scss">
.v-product-goods-editor {
	padding: 20px;
	padding-bottom: 70px;
}
</style>
