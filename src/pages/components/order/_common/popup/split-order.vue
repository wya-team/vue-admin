<template>
	<vc-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		size="large"
		title="拆分订单"
		class="c-order-split-modal"
		@ok="handleOk"
	>
		<div class="_split-content">
			<div class="g-c-999" style="height: 28px; line-height: 28px;">
				按输入拆分数量的商品拆分出一个子订单，剩下的商品为一个子订单
			</div>
			<vc-table
				:data-source="data"
				:max-height="390"
			>
				<vc-table-column
					prop="product"
					label="商品"
					width="380"
				>
					<template #default="{ row }">
						<div class="g-flex">
							<img :src="`${row.product_image}!4-4`" class="g-imgr-56">
							<div class="g-m-l-12" style="margin-top: -4px;">
								<div class="g-break">
									{{ row.product_name }}
								</div>
								<div class="g-c-999">{{ row.sku_value }}</div>
								<div class="g-c-label-red">{{ $config.finance_pay_icon }}{{ row.price }}</div>
							</div>
						</div>
					</template>
				</vc-table-column>
				<vc-table-column
					prop="quantity"
					label="商品数量"
				>
					<template #default="{ row }">
						x {{ row.quantity }}
					</template>
				</vc-table-column>
				<vc-table-column
					prop="split_num"
					label="选择拆分数量"
				>
					<template #default="{ row }">
						<vc-input-number
							v-model="row.split_num"
							:max="+row.quantity"
							:min="0"
							:precision="0"
							style="width: 64px"
						/>
					</template>
				</vc-table-column>
			</vc-table>
		</div>
	</vc-modal>
</template>

<script>
import { Portal } from '@wya/vc';
import { debounce } from 'lodash';
import net from '@utils/net';

const config = {
	name: 'order-split-modal',
	components: {
	},
	props: {
		orderID: [String, Number],
		ordersType: [String, Number],
	},
	data() {
		let { list } = this.$options.propsData.data;
		return {
			visible: false,
			data: list
		};
	},
	computed: {
		
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			let param = {
				child_orders_id: this.orderID,
				orders_type: this.ordersType,
			};
			return this.$request({
				url: "_ORDER_COMMON_SPLIT_POST",
				type: "POST",
				param,
			}).then(res => {
				this.$emit('sure', {
					child_orders_id: res.data.child_orders_id
				});
			});
		},
		handleCancel() {
			this.$emit('close');
		},
	}
};
export default config;
export const SplitOrder = new Portal(config, {
	onBefore({ orderID, verify }) {
		return net.ajax({
			url: "_ORDER_COMMON_SPLIT_LIST_GET",
			type: "GET",
			verify,
			param: {
				child_orders_id: orderID
			}
		});
	}
});
</script>

<style lang="scss">
.c-order-split-modal {
	._split-content {
		padding-top: 13px;
	}
}
</style>
