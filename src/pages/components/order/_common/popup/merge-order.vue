<template>
	<vc-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		size="large"
		title="合并订单"
		class="c-order-merge-modal"
		@ok="handleOk"
	>
		<div class="_merge-content">
			<vc-table
				:data-source="data"
				:max-height="390"
				@selection-change="handleSelectChange"
			>
				<vc-table-column
					type="selection"
					width="55"
				/>
				<vc-table-column
					prop="child_orders_sn"
					label="子订单"
					width="180"
				/>
				<vc-table-column
					prop="items"
					label="商品信息"
					align="center"
				>
					<template #default="{ row }">
						<div class="g-flex-cc">
							<div class="g-m-r-8" style="max-width: 270px">
								<tpl-relation-chain :data="row.items">
									<tpl-img-tip 
										v-for="(item) in row.items"
										:key="item.product_id"
										:src="item.product_image"
										:content="item.quantity > 1 ? `x${item.quantity}` : ''" 
										class=" g-m-r-8" 
										img-class="g-imgr-56" 
									/>
								</tpl-relation-chain>
							</div>
							共{{ row.items | totalProduct }}件
						</div>
					</template>
				</vc-table-column>
				<vc-table-column
					prop="status_name"
					label="发货状态"
					width="120"
				/>
			</vc-table>
		</div>
	</vc-modal>
</template>

<script>
import { Portal } from '@wya/vc';
import { debounce } from 'lodash';
import net from '@utils/net';
import ImgTip from '../../img-tip/img-tip';
import { MergeAddr } from './merge-addr';

const config = {
	name: 'order-merge-modal',
	components: {
		'tpl-img-tip': ImgTip
	},
	props: {
		orderID: [String, Number],
		ordersType: [String, Number],
	},
	filters: {
		totalProduct(data) {
			return data.reduce((pre, cur) => {
				pre += cur.quantity;
				return pre;
			}, 0);
		}
	},
	data() {
		let { list, plug_send_examine, orders_shipping_status } = this.$options.propsData.data;
		return {
			visible: false,
			send_examine: 1,
			data: list,
			selected: [],
			plug_send_examine,
			orders_shipping_status
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (this.selected.length < 2) {
				this.$Message.info('至少选择两个以上的包裹进行合并', 2);
				return true;
			}
			return this.$request({
				url: "_ORDER_COMMON_MERGE_CHECK_POST",
				type: "POST",
				param: {
					child_orders_id: this.selected,
					orders_type: this.ordersType
				},
				successTip: false
			}).then(res => {
				if (res.data && res.data.length > 0) { // 收货详细地址不同，不能合单
					MergeAddr.popup({
						dataSource: res.data
					}).then((delivery_id) => {
						this.handleMerge(delivery_id);
					});
				} else {
					this.handleMerge();
				}
			});
		},
		handleMerge(delivery_id) {
			this.$request({
				url: "_ORDER_COMMON_MERGE_POST",
				type: "POST",
				param: {
					delivery_id,
					child_orders_id: this.selected,
					orders_type: this.ordersType
				}
			}).then(res => {
				this.$emit('sure', {
					child_orders_id: res.data.child_orders_id
				});
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSelectChange(value) {
			this.selected = value.map((it) => {
				return it.child_orders_id;
			});
		}
	}
};
export default config;
export const MergeOrder = new Portal(config, {
	onBefore({ orderID, verify }) {
		return net.ajax({
			url: "_ORDER_COMMON_MERGE_LIST_GET",
			type: "GET",
			verify,
			param: {
				child_orders_id: orderID,
			}
		});
	}
});
</script>

<style lang="scss">
.c-order-merge-modal {
	._merge-content {
		padding-top: 24px;
	}
}
</style>