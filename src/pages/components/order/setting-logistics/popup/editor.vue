<template>
	<vc-modal
		v-model="visible"
		:mask-closable="false"
		:title="isNewAdd ? '新增物流公司' : '编辑物流公司'"
		class="v-order-setting-logistics-add-modal"
		@cancel="handleCancel"
		@ok="handleOk"
	>
		<vc-alert :visible="true" title="自定义新增的物流公司，无法获取到快递信息" />
		<vc-form
			ref="form"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="100"
		>
			<vc-form-item label="物流公司名称：" prop="campName" class="g-m-t-24">
				<vc-input
					v-model="formValidate.campName"
					:maxlength="10"
					:indicator="{ inline: true }"
					style="width: 240px;"
					placeholder="请输入物流公司名称"
					clearable
				/>
					
			</vc-form-item>
			<vc-form-item prop="status" label="状态：">
				<vc-switch
					v-model="formValidate.status"
					size="large"
				>
					<template #open>
						<div>开</div>
					</template>
					<template #close>
						<div>关</div>
					</template>
				</vc-switch>
			</vc-form-item>
		</vc-form>
        
	</vc-modal>
</template>
<script>
import { Portal } from '@wya/vc';

const config = {
	name: 'tpl-order-setting-logistics-add',
	props: {
		isNewAdd: {
			type: Boolean,
			default: true,
		},
		expressId: {
			type: Number,
			default: 0
		},
		shippingId: {
			type: Number,
			default: 0
		},
		name: {
			type: String,
			default: ''
		},
		use: {
			type: Number,
			default: 1,
		}
	},
	data() {
		return {
			visible: false,
			formValidate: {
				campName: this.name,
				status: this.use == '1',
			},
			ruleValidate: {
				campName: [{ required: true, message: '请输入物流公司名称', trigger: 'change' }]
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleCancel() {
			this.$emit('close');
		},
		handleOk() {
			this.$refs['form'].validate().then(() => {
				let express_name = this.formValidate.campName;
				let is_use = this.formValidate.status ? '1' : '0';
				let url; let param;
				if (this.isNewAdd) { // 新增
					url = "_ORDER_SETTING_LOGISTICS_ADD_POST";
					param = {
						express_name,
						is_use,
					};
				} else { // 修改
					url = "_ORDER_SETTING_LOGISTICS_EDIT_POST";
					param = {
						express_name,
						is_use,
						express_id: this.expressId,
						shipping_id: this.shippingId,
					};
				}
				
				this.$request({
					url,
					type: "POST",
					param,
					verify: this.isNewAdd ? 1445 : ''
				}).then(res => {
					this.$store.commit('ORDER_SETTING_LOGISTICS_LIST_INIT');
					this.$emit('sure');
				}).catch(err => {
					console.log(err);
				});
				
			}).catch(err => {
				console.log('validate fail');
			}); 
		},
	}
};
export default config;
export const Editor = new Portal(config, {});
</script>
<style lang="scss">              

</style>

