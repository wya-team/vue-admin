<template>
	<vc-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		size="medium"
		class="c-order-deliver-modal"
		@ok="handleOk"
	>
		<div class="g-flex-cc" style="margin-top: 21px">
			<vc-form
				ref="form"
				:model="formValidate"
				:rules="formValidate.delivery_type == 1 ? ruleValidate : {}"
				:label-width="80"
				style="width: 380px"
			>
				<vc-form-item class="_form-text-item" label="收货人：">{{ formValidate.consignee }}</vc-form-item>
				<vc-form-item class="_form-text-item" label="收货人电话：">{{ formValidate.mobile }}</vc-form-item>
				<vc-form-item class="_form-text-item1" label="收货地址：">
					<tpl-address-txt
						:address="{
							country: formValidate.country_name,
							province: formValidate.province_name,
							city: formValidate.city_name,
							area: formValidate.area_name,
							address: formValidate.address,
						}"
						style="word-break: break-all"
					/>
				</vc-form-item>
				<vc-form-item
					class="_form-text-item1"
					label="发货方式："
				>
					<vc-radio-group v-model="formValidate.delivery_type">
						<vc-radio :label="1" style="margin-right: 48px;">物流发货</vc-radio>
						<vc-radio :label="3">无需物流</vc-radio>
					</vc-radio-group>
				</vc-form-item>
				<div v-show="formValidate.delivery_type == 1">
					<vc-form-item
						prop="logistics"
						label="物流公司："
						class="g-form-item-unset"
					>
						<vc-select
							:value="formValidate.express_code"
							clearable
							transfer
							label-in-value
							@change="handleChangeExpress"
						>
							<vc-option
								v-for="(item, index) in logistics"
								:key="index"
								:value="item.value"
							>
								{{ item.label }}
							</vc-option>
						</vc-select>
					</vc-form-item>
					<vc-form-item
						prop="delivery_no"
						label="快递单号："
						class="g-form-item-unset"
					>
						<vc-input
							v-model="formValidate.delivery_no"
							placeholder="请输入快递单号"
							style="width: 300px"
							@input="handleInput"
						/>
					</vc-form-item>
				</div>
			</vc-form>
		</div>
	</vc-modal>
</template>

<script>
import { Portal } from '@wya/vc';
import net from '@utils/net';
import { RegEx } from "@utils/utils";
import { debounce } from 'lodash';
import { commonServices } from '@stores/services/_common';

const config = {
	name: 'order-deliver-modal',
	components: {
	},
	mixins: [
		commonServices.logistics({ autoClear: true })
	],
	props: {
		edit: Boolean,
		orderID: [Number, String],
		verify: [Number, String],
	},
	data() {
		const expressValidator = async (rule, value, callback) => {
			if (!value) {
				callback(new Error('快递单号不能为空'));
			} else if (!RegEx.letterAndNumber.test(value)) {
				callback(new Error('快递单号限制数字和字母，不能包含空格'));
			}
			callback();
		};
		return {
			visible: false,
			title: this.edit ? '修改发货' : '发货',
			formValidate: {
				delivery_type: 1,
				...this.$options.propsData.data
			},
			ruleValidate: {
				delivery_no: [
					{ validator: expressValidator, trigger: 'blur' }
				]
			}
		};
	},
	watch: {
		logistics: {
			immediate: true,
			handler(v) {
				if (v.length && !this.formValidate.express_code) {
					this.formValidate.express_code = v[0].value;
					this.formValidate.express_name = v[0].label;
				}
			}
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleInput() {
			this.formValidate.delivery_no = this.formValidate.delivery_no.replace(/[\W]/g, '');
		},
		handleOk() {
			return this.$refs.form.validate().then((res) => {
				this.handleSubmit();
			}).catch((error) => {
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleChangeExpress(value, label) {
			this.formValidate.express_code = value;
			this.formValidate.express_name = label;
		},
		handleSubmit() {
			let url = this.edit ? '_ORDER_COMMON_DELIVER_GOODS_EDIT_POST' : '_ORDER_COMMON_DELIVER_GOODS_POST';
			this.$request({
				url,
				type: "POST",
				verify: this.verify,
				param: {
					child_orders_id: this.orderID,
					delivery_type: this.formValidate.delivery_type,
					express_code: this.formValidate.express_code,
					express_name: this.formValidate.express_name,
					delivery_no: this.formValidate.delivery_no,
				},
				successTip: false
			}).then(res => {
				let { error_code } = res.data || {};
				if (error_code === 20001 || error_code === 20002) {
					this.$Message.error(res.msg);
				} else {
					this.$Message.success(res.msg);
				}
				this.$emit('sure', res);
			}).catch(error => {
			});
		}
	}
};
export default config;
export const Deliver = new Portal(config, {
	onBefore({ orderID, orders_type }) {
		return net.ajax({
			url: "_ORDER_COMMON_CHANGE_ADDR_GET",
			type: "GET",
			param: {
				child_orders_id: orderID,
				orders_type
			}
		});
	}
});
</script>

<style lang="scss">
.c-order-deliver-modal {
	.ivu-form-item {
		margin-bottom: 24px !important;
	}
	._form-text-item {
		margin-bottom: 8px !important;
	}
	._form-text-item1 {
		margin-bottom: 17px !important;
	}
}
</style>
