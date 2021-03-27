<template>
	<vc-popover
		v-model="visible"
		:transfer="false"
		trigger="click"
		placement="top-left"
	>
		<p class="g-link-text g-pointer g-inline-block">批量设置</p>
		<template #content>
			<div class="g-relative c-product-goods-batch-setting-content">
				<div class="g-bb g-pd-tb-8 g-pd-l-16 g-c-333 _batch-title">批量设置</div>
				<div class="g-flex g-pd-16 _batch-content">
					<div class="g-lh-28">请输入：</div>
					<vc-input-number
						v-model="value"
						:max="9999999.99"
						:min="0"
						:precision="precision"
						placeholder="请输入"
						style="width: 104px"
					/>

				</div>
				<div class="g-tr g-m-b-16">
					<vc-button
						class="g-m-r-8"
						@click="visible = false"
					>取消</vc-button>
					<vc-button
						type="primary"
						@click="handleOk"
					>确认</vc-button>
				</div>
			</div>
		</template>
	</vc-popover>
</template>

<script>
import { Message } from '@wya/vc';

export default {
	name: 'v-tpl',
	components: {

	},
	props: {
		precision: {
			type: Number,
			default: 2
		}
	},
	data() {
		return {
			visible: false,
			value: '',
		};
	},
	created() {
		
	},
	methods: {
		handleOk() {
			if (!this.value) {
				Message.warning("请输入批量设置的内容");
				return;
			}
			this.visible = false;
			this.$emit('ok', this.value);
		}
	},
};
</script>

<style lang="scss">
.c-product-goods-batch-setting-content {
	._batch-title {
		position: absolute;
		width: 208px;
		left: -12px;
	}
	._batch-content {
		padding-top: 54px;
	}
}
</style>
