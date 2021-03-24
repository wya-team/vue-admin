<template>
	<div class="g-pd-t-8">
		<vc-alert
			:visible="true"
			:title="tip"
			type="info"
		/>
		<div class="g-m-t-24">
			<span>任务类型：</span>
			<vc-select
				v-model="keywords.task_type"
				style="width: 240px"
				clearable
				placeholder="请选择任务类型"
				@change="handleSearch"
			>
				<vc-option
					v-for="(value, key, index) in typeList"
					:key="index"
					:value="key"
				>
					{{ value }}
				</vc-option>
			</vc-select>
			<vc-button
				type="primary"
				class="g-m-l-20"
				@click="handleSearch"
			>
				查询
			</vc-button>
			<vc-button
				class="g-m-l-8"
				@click="handleRefresh"
			>
				刷新
			</vc-button>
		</div>
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import { debounce } from 'lodash';

export default {
	name: 'xls-filter',
	components: {
	},
	data() {
		const { query = {} } = this.$route;
		return {
			tip: '提示：导出任务正在进行中，请手动刷新，实时查看下载进度；如若导出的数据量比较大，请耐心等待1-30分钟再手动刷新',
			keywords: {
				task_type: String(query.task_type || ''),
			},
			show: false,
			typeList: {}
		};
	},
	mounted() {
		this.loadTypeData();
	},
	methods: {
		handleSearch: debounce(function (value) {
			let query = {
				...this.$route.query,
				...this.keywords,
			};
			this.$router.replace(URL.merge({
				path: '/setting/task',
				query
			}));
			this.$store.commit('SETTING_TASK_LIST_INIT');
		}, 300),
		// 任务类型下拉框列表获取
		loadTypeData() {
			this.$request({
				url: '_SETTING_TASK_TYPE_GET',
				type: 'GET',
			}).then((res) => {
				this.typeList = res.data;
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleToggle() {
			this.show = !this.show;
		},
		handleChange(obj) {
			let type = Object.keys(obj)[0];
			let value = obj[type];
			this.keywords[type] = value;
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleRefresh() {
			this.$store.commit('SETTING_TASK_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
