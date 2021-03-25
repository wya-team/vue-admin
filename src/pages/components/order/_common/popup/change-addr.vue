<template>
	<vc-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		size="medium"
		title="修改地址"
		class="c-order-change-addr-modal"
		@ok="handleOk"
	>
		<div class="g-flex-cc" style="margin-top: 21px">
			<vc-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="80"
			>
				<vc-form-item
					prop="consignee"
					label="收货人："
					class="g-form-item-unset"
				>
					<vc-input 
						v-model="formValidate.consignee" 
						placeholder="请输入收货人" 
						style="width: 300px"
					/>
				</vc-form-item>
				<vc-form-item
					prop="mobile"
					label="收货人电话："
					class="g-form-item-unset"
				>
					<vc-select
						v-model="formValidate.mobile_country_code"
						transfer
						style="width: 70px; display: inline-block"
						portal-class-name="g-mobile-prefix-pop"
						@change="handleGetMobileCode"
					>
						<vc-option
							v-for="(item, index) in mobilePrefix"
							:key="index"
							:value="item.code"
						>
							{{ item.label }}
						</vc-option>
					</vc-select>
					<vc-input 
						v-model="formValidate.mobile" 
						:maxlength="11" 
						placeholder="请输入收货人电话"
						class="g-m-l-10"
						style="width: 216px;"
					/>
				</vc-form-item>
				<!-- 不一定是国内地址看  后台设置 -->
				<vc-form-item
					prop="addr"
					label="收货人地址："
					class="g-form-item-unset"
				>
					<vc-cascader
						v-model="formValidate.addr"
						:data-source="reveiverAddress"
						clearable
						transfer
						placeholder="请选择收货人地址"
						style="width: 300px;"
						@change="handleChangeAddr"
					/>
					<vc-form-item
						:label-width="0"
						prop="address"
						class="g-form-item-unset g-m-t-16"
					>
						<vc-textarea 
							v-model="formValidate.address" 
							:maxlength="200"
							:rows="4"
							indicator
							placeholder="请填写详细地址"
							style="width: 300px"
						/>
					</vc-form-item>
				</vc-form-item>
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
	name: 'order-change-addr-modal',
	components: {
	},
	mixins: [
		commonServices.region(),
		commonServices.mobilePrefix()
	],
	props: {
		title: String,
		verify: [String, Number]
	},
	data() {
		let { 
			country_id, province_id, city_id, area_id,
			country_name, province_name, city_name, area_name
		} = this.$options.propsData.data || {};
		let { plug_national_address, border_bonded } = this.$config;

		const addrValidator = (rule, value, callback, source, options) => {
			if (!value[0]) {
				callback('请选择收货地址');
				return;
			}
			callback();
		};
		return {
			visible: false,
			plug_national_address,
			formValidate: {
				mobile_country_code: 'CN',
				...this.$options.propsData.data,
				addr: plug_national_address == 1 ? [+country_id ? country_id : '1', province_id, city_id, area_id] : [province_id, city_id, area_id],
				addrName: plug_national_address == 1 
					? [
						country_name || '中国', 
						province_name, 
						city_name, 
						area_name
					] 
					: [province_name, city_name, area_name] 
			},
			ruleValidate: {
				addr: [
					{ validator: addrValidator, type: 'array', trigger: "change" }
				]
			}
		};
	},
	computed: {
		reveiverAddress() {
			if (this.plug_national_address == 1) {
				return this.region;
			}
			return this.region[0].children;
		}
	},
	watch: {
		mobilePrefix: {
			immediate: true,
			deep: false,
			handler(data) {
				const { mobile_country_code, mobile_prefix } = this.formValidate;
				if (!mobile_country_code && data.length) {
					const target = data.find(it => it.value === mobile_prefix);
					target && (this.formValidate.mobile_country_code = target.code);
				}
			}
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleGetMobileCode(val) {
			this.formValidate.mobile_prefix = this.mobilePrefix.find(item => item.code === val).value;
		},
		handleOk() {
			return this.$refs.formValidate.validate().then((res) => {
				this.handleSubmit();
			}).catch((error) => {
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleChangeAddr(value, label) {
			this.formValidate.addrName = label;
		},
		handleSubmit() {
			let { plug_national_address } = this.$config;
			let addr = [...this.formValidate.addr];
			let addrName = [...this.formValidate.addrName];
			
			let params = {
				...this.formValidate,
				orders_type: this.$options.propsData.data.orders_type,
				child_orders_id: this.$options.propsData.data.child_orders_id,
			};
			params = {
				...params,
				province_id: addr.shift(),
				city_id: addr.shift(),
				area_id: addr.shift(),
				province_name: addrName.shift(),
				city_name: addrName.shift(),
				area_name: addrName.shift(),
			};

			this.$request({
				url: '_ORDER_COMMON_CHANGE_ADDR_POST',
				type: "POST",
				verify: this.verify,
				param: params
			}).then(res => {
				this.$emit('sure', {});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
export default config;
export const ChangeAddr = new Portal(config, {
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
.c-order-change-addr-modal {
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