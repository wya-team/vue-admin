<template>
	<vc-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		size="medium"
		title="订单退款"
		class="c-order-refund-modal"
		@ok="handleOk"
	>
		<div class="g-flex-cc">
			<vc-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="90"
			>
				<vc-form-item class="_form-text-item" label="订单编号：">{{ info.child_orders_sn }}</vc-form-item>
				<vc-form-item class="_form-text-item" label="订单状态：">{{ info.orders_shipping_status_name }}</vc-form-item>
				<vc-form-item class="_form-text-item" label="订单实付：">xxx</vc-form-item>
				<vc-form-item class="_form-text-item1" label="全额退款："><span class="g-c-money">xxz</span></vc-form-item>
				<vc-form-item
					prop="revoke_remark"
					label="退款备注："
					class="g-form-item-unset"
				>
					<vc-textarea
						v-model="formValidate.revoke_remark"
						:maxlength="200"
						:rows="4"
						indicator
						placeholder="请填写退款备注"
						style="width: 300px"
					/>
				</vc-form-item>
			</vc-form>
		</div>
	</vc-modal>
</template>

<script>
import { Portal } from '@wya/vc';
import { RegEx, Calc } from "@utils/utils";
import { debounce } from 'lodash';
import net from '@utils/net';
import { RefundResult } from '../../after-sale/refund-result';

const config = {
	name: 'order-refund-modal',
	components: {
	},
	props: {
		title: String,
		orderID: [String, Number],
		ordersType: [String, Number],
		verify: [String, Number],
	},
	data() {
		let { info } = this.$options.propsData.data;
		return {
			visible: false,
			info,
			formValidate: {
				revoke_remark: '',
				back_orders_freight: info.is_already_send && info.orders_freight > 0 ? '0' : '1',
				back_orders_tax: '0'
			},
			ruleValidate: {
			}
		};
	},
	computed: {
		refundInfo() {
			let { refund_infos, refund_info } = this.$options.propsData.data;
			if (this.formValidate.back_orders_freight == 1) {
				return refund_infos;
			}
			return refund_info;
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			return this.handleSubmit();
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSubmit() {
			return this.$request({
				url: '_ORDER_COMMON_REFUND_POST',
				type: "POST",
				verify: this.verify,
				param: {
					child_orders_id: this.orderID,
					orders_type: this.ordersType,
					revoke_remark: this.formValidate.revoke_remark,
					back_orders_freight: this.formValidate.back_orders_freight,
					back_tax_fee: this.info.orders_shipping_status == 5 ? 1 : this.formValidate.back_orders_tax 
				}
			}).then(({ data }) => {
				this.$emit('sure', {});
			}).catch(error => {
				console.log(error);

			});
		}
	}
};
export default config;
export const Refund = new Portal(config, {
	onBefore({ orderID, ordersType }) {
		return net.ajax({
			url: "_ORDER_COMMON_REFUND_GET",
			type: "GET",
			param: {
				child_orders_id: orderID,
				orders_type: ordersType
			}
		});
	}
});
</script>

<style lang="scss">
.c-order-refund-modal {
	.ivu-form-item {
		margin-bottom: 24px !important;
	}
	._form-text-item {
		margin-bottom: 8px !important;
		white-space: nowrap;
	}
	._form-text-item1 {
		margin-bottom: 17px !important;
		white-space: nowrap;
	}
}
</style>
