<template>
	<div class="v-order-setting-logistics g-m-b-24">
		<vc-button 
			type="primary" 
			class="g-m-b-24"
			@click="handleEditor"
		>
			新增物流公司
		</vc-button> 
		<div class="g-flex g-m-b-24">
			<div class="g-flex-ac">
				<span>物流公司：</span>
				<vc-input 
					v-model="keywords.express_name" 
					placeholder="请输入物流公司名称" 
					clearable
					style="width: 240px;"
					@enter="handleSearch"
					@change="handleInputChange"
				/>
			</div>
			<div class="g-m-l-32">
				<span>选择状态：</span>
				<vc-select
					v-model="keywords.is_use"
					clearable
					placeholder="请选择状态"
					style="width: 240px;"
					@change="handleSearch"
				>
					<vc-option value="0">关闭</vc-option>
					<vc-option value="1">开启</vc-option>
				</vc-select>
			</div>
			<vc-button 
				type="primary"
				class="g-m-l-24"
				@click="handleSearch"
			>
				查询
			</vc-button>
		</div>
	</div>
</template>
<script>
import { debounce } from 'lodash';
import { URL } from '@utils/utils';
import { Editor } from './popup/editor';

export default {
	name: 'tpl-filter',
	components: {
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keywords: {
				...query,
				is_use: '',
				express_name: ''
			},
		};
	},
	computed: {
		setting() {
			return this.$store.state.orderSettingLogistics.setting;
		}
	},
	created() {
	},
	methods: {
		handleSubmit(query) {
			this.$router.replace(URL.merge({
				path: '/order/setting/logistics',
				query,
			}));
			this.$store.commit('ORDER_SETTING_LOGISTICS_LIST_INIT');
		},
		handleEditor() {
			Editor.popup({
				store: this.$store,
			}).then(res => {
			}).catch(e => {
				console.log(e);
			});
		},
		handleSearch: debounce(function (value) {
			let query = {
				...this.$route.query,
				...this.keywords,
			};
			this.handleSubmit(query);
		}, 300),
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	},
};
</script>

<style lang="scss">
.v-order-setting-logistics {
	._coolapse-header {
		height: 40px;
		line-height: 40px;
		.title {
			margin-left: 64px;
		}
		.state {
			margin-right: 48px;
		}
	}
}
</style>
