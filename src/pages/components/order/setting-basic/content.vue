<template>
	<div>
		<div class="v-order-setting-basic g-m-lr-24 g-pd-tb-24" style="padding-bottom: 120px;">
			<vc-collapse 
				v-model="currentType"
				accordion
			>
				<!-- 多个订单设置，建议每种订单一个文件，防止配置项过多造成文件代码量大不好阅读 -->
				<vc-collapse-item name="1" class="g-b">
					<div class="_collapse-title g-pd-l-24 g-fs-14 g-flex-ac">
						<span>订单设置</span>
						<span class="g-m-l-12 g-c-main g-fs-12 g-pointer">{{ currentType == '1' ? '收起' : '展开' }}</span>
					</div>
					<template #content>
						<div class="g-pd-b-24">
							<div class="g-pd-t-24 ">
								<div class="g-flex-ac">
									<span class="_collapse-subtitle">待确认订单自动取消时间：</span>
									<tpl-append 
										v-model="info.unit"
										@change="info.time = 0"
									>
										<vc-input-number
											v-model="info.time"
											:min="0" 
											:max="9999"
											:step="0"
											required
											style="width: 88px;"
											placeholder="请输入"
										/>
									</tpl-append>
								</div>
								<div class="_collapse-describe g-c-999 g-m-t-8 g-oneline">
									订单超时未确认运费，系统自动取消订单，交易关闭。(为0表示不自动取消)  
								</div>
							</div>
						</div>
					</template>
				</vc-collapse-item>
			</vc-collapse>
		</div>
		<vca-footer ok-text="保存" cancel-text="" @ok="handleSave" />
	</div>
</template>

<script>
import Append from './append';

export default {
	name: 'tpl-content',
	components: {
		'tpl-append': Append
	},
	data() {
		return {
			info: {},
			currentType: '1'
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_ORDER_SETTING_BASIC_GET',
				type: 'GET',
			}).then((res) => {
				this.info = res.data;
			});
		},
		handleSave() {
			this.$request({
				url: '_ORDER_SETTING_BASIC_SAVE_POST',
				type: 'POST',
				param: {}
			}).then((res) => {});
		}
	},
};
</script>

<style lang="scss">
.v-order-setting-basic {
	color: $c333;
	.vc-input__wrapper {
		overflow: visible
	}
	._remain_input {
		line-height: 24px !important;
	}
	._bottom-border {
		border-bottom: 1px solid $ce8;
	}
	._collapse-title {
		height: 50px;
		line-height: 50px;
		background-color: $cf9;
		&::before {
			content: '';
			width: 2px;
			height: 14px;
			background-color: $label-red;
			margin-right: 8px;
			display: inline-block;
		}
	}
	._collapse-subtitle {
		display: inline-block;
		width: 14rem;
		margin-left: 16px;
		text-align: right;
	}
	._collapse-describe {
		margin-left: 214px;
	}


	._collapse-subtitle-inOrder {
		display: inline-block;
		width: 12rem;
		margin-left: 16px;
		text-align: right;
	}
	._collapse-describe-inOrder {
		margin-left: 182px;
	}

	._collapse-subtitle-retail {
		display: inline-block;
		width: 12rem;
		margin-left: 16px;
		text-align: right;
	}

	._collapse-describe-retail  {
		margin-left: 182px;
	}
	._collapse-subtitle-delivery {
		width: 12rem;
		text-align: right;
		margin-left: 16px;

	}
	._collapse-describe-delivery {
		margin-left: 182px;
	}

	._collapse-subtitle-exchange  {
		margin-left: 24px;
	}
	._collapse-describe-exchange {
		margin-left: 130px;
	}
	._btn {
		width: 88px;
		height: 28px;
		text-align: center;
		line-height: 28px;
		border:1px solid $main;
		color: $main;
		border-radius: 4px;
		cursor: pointer;
	}
	.__retail-from {
		.vc-form-item__tip {
			margin-left: 171px;
		}
	}
}
</style>
