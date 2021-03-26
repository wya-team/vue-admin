<template>
	<vc-modal
		v-model="visible"
		size="small"
		title="新增自定义规格"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<vc-form
			ref="form"
			:model="formData"
			:rules="ruleValidate"
			:label-width="90"
			class="g-pd-24"
		>
			<vc-form-item label="规格名称：" prop="spec_name">
				<vc-input
					v-model="formData.spec_name"
					clearable
					placeholder="请输入"
					style="width: 300px"
				/>
			</vc-form-item>
		</vc-form>
	</vc-modal>
</template>
<script>
import { Portal } from '@wya/vc';

const config = {
	name: "vc-tpl-basic",
	props: {
	},
	data() {
		return {
			visible: false,
			formData: {
				spec_name: ''
			},
			ruleValidate: {
				spec_name: [{ required: true, message: '请输入规格名称' }]
			},
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		async handleOk(e, cb) {
			await this.$refs.form.validate();
			let res = await this.request({
				url: '_PRODUCT_GOODS_EDITOR_SPEC_ADD_POST',
				type: 'POST',
				param: {
					spec_name: this.formData.spec_name
				},
				loading: false,
			});
			cb();
			this.$emit('sure', res.data);
		},
		handleCancel() {
			this.$emit('close');
		},
	}
};
export default config;

export const CustomSpec = new Portal(config, {});
</script>
<style lang="sass">

</style>


