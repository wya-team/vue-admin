<template>
	<vc-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		title="查看物流"
		size="medium"
		class="c-order-logistics-modal"
		@ok="handleOk"
	>
		<div class="_logistics-content">
			<div class="g-bg-f9 g-pd-lr-24 g-pd-tb-12 g-c-333">
				<div>承运来源：<span class="g-c-51">{{ info.express_name }}</span></div>
				<div class="g-m-t-10">
					运单号：<span class="g-c-51">{{ info.delivery_no }}</span>
					<vc-clipboard
						:value="info.delivery_no"
						class="g-operation g-m-l-10"
						tag="span"
					>
						复制
					</vc-clipboard>
				</div>
			</div>
			<xls-timeline 
				v-if="info.logistics.length > 0" 
				class="__logistics"
			>
				<xls-timeline-item 
					v-for="(logistic, index) in info.logistics"
					:key="index"
					:border-color="index === 0 ? '#5495F6' : '#CDCDCD'"
				>
					<div class="g-m-l-24 g-m-b-26">
						<div class="g-c-333 g-break">{{ logistic.context }}</div>
						<div class="g-c-999 g-m-t-5">{{ logistic.time }}</div>
					</div>
				</xls-timeline-item>
			</xls-timeline>
			<div v-else class="g-flex-cc g-fd-c __empty">
				<img :src="LogisticsEmptyImg" style="width: 150px" class="g-m-b-16">
				<div class="g-tc">
					<p class="g-c-333">暂时获取不到快递信息</p>
					<p class="g-c-999 g-m-t-5">可复制单号至快递官网查询</p>
				</div>
			</div>
		</div>
	</vc-modal>
</template>

<script>
import { Portal } from '@wya/vc';
import { RegEx } from "@utils/utils";
import { debounce } from 'lodash';
import net from '@utils/net';
import LogisticsEmptyImg from '@assets/image/logistics_empty.png';

const config = {
	name: 'order-logistics-modal',
	components: {
	},
	props: {
	
	},
	data() {
		return {
			LogisticsEmptyImg,
			visible: false,
			info: {
				...this.$options.propsData.data
			}
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
	}
};
export default config;
export const Logistics = new Portal(config, {
	
	onBefore({ child_orders_id, url, verify }) {
		return net.ajax({
			url,
			type: "GET",
			verify,
			param: {
				child_orders_id,
			}
		});
	}
});
</script>

<style lang="scss">
.c-order-logistics-modal {
	._logistics-content {
		.__empty {
			padding-top: 30px;
		}
		.__logistics {
			margin-top: 34px; 
			padding-right: 20px; 
			height: 220px; 
			overflow-y: auto;
		}
	}
}
</style>