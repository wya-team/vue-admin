<template>
	<vc-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="地址合并"
		class="c-order-merge-addr-modal"
		@ok="handleOk"
	>
		<div class="_merge-addr-content">
			<div class="g-c-999">
				合并的订单中存在多个地址，确认合并订单请确定选择一个地址作为收货地址。
			</div>
			<vc-radio-group v-model="deliveryID" class="g-m-t-12" vertical>
				<vc-radio 
					v-for="(item, index) in dataSource"
					:key="index"
					:label="item.delivery_id" 
					class="g-c-51"
				>
					<span class="g-m-r-15">{{ item.consignee }}</span>
					<span class="g-m-r-15">{{ item.mobile }}</span>
					<template v-if="`${item.country_name}${item.province_name}${item.city_name}${item.area_name}${item.address}`.length > 20">
						<vc-popover
							trigger="hover"
							placement="top"
							theme="dark"
						>
							<tpl-address-txt
								:length="20"
								:address="{
									country: item.country_name,
									province: item.province_name,
									city: item.city_name,
									area: item.area_name,
									address: item.address
								}"
							/>
							...
							<template #content="">
								<div style="width: 200px; word-break: break-all">
									<tpl-address-txt
										:address="{
											country: item.country_name,
											province: item.province_name,
											city: item.city_name,
											area: item.area_name,
											address: item.address
										}"
									/>
								</div>
							</template>
						</vc-popover>
					</template>
					<tpl-address-txt
						v-else
						:address="{
							country: item.country_name,
							province: item.province_name,
							city: item.city_name,
							area: item.area_name,
							address: item.address
						}"
					/>
				</vc-radio>
			</vc-radio-group>
		</div>
	</vc-modal>
</template>

<script>
import { Portal } from '@wya/vc';
import { RegEx } from "@utils/utils";
import { debounce } from 'lodash';

const config = {
	name: 'order-merge-addr-modal',
	components: {
	},
	props: {
		dataSource: {
			type: Array,
			default: () => ([])
		}
	},
	filters: {
		addressStr(item) {
			const arr = [item.country_name, item.province_name, item.city_name, item.area_name, item.address].filter(it => !!it);
			if (+this.$config.plug_area_english) {
				return arr.reverse().join();
			} else {
				return arr.join();
			}
		},
		subAddress(str) {
			return str.substring(0, 20);
		},
	},
	data() {
		return {
			visible: false,
			deliveryID: ''
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (!this.deliveryID) {
				this.$Message.info('请选择一个地址作为收货地址', 2);
				return true;
			}
			this.$emit('sure', { delivery_id: this.deliveryID });
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export default config;
export const MergeAddr = new Portal(config, {});
</script>

<style lang="scss">
.c-order-merge-addr-modal {
	.vc-modal__content {
		padding: 20px 24px;
	}
}
</style>