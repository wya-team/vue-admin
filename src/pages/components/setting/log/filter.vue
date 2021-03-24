<template>
	<div class="g-pd-t-8 v-setting-log-filter">
		<vc-button
			type="primary"
			class="g-m-b-24"
			@click="handleExport"
		>
			导出
		</vc-button>
		<div>
			<span>变更数据：</span>
			<vc-input
				v-model="keywords.data_info"
				placeholder="请输入变更数据内容"
				style="width: 240px"
				clearable
				@enter="handleSearch"
				@change="handleInputChange"
			/>
			<vc-button
				type="primary"
				class="g-m-l-20"
				@click="handleSearch"
			>
				查询
			</vc-button>
			<span
				class="g-m-l-12 g-c-black-dark g-fs-12 g-pointer g-no-select"
				@click="handleToggle"
			>
				{{ show ? '收起' : '展开' }}
				<vc-icon :type="show ? 'triangle-up' : 'triangle-down'" class="g-fs-12" />
			</span>
		</div>
		<vc-expand v-model="show">
			<div class="g-pd-t-16">
				<div
					class="g-search-form g-lh-50 g-bg-f4"
					style="padding-top: 5px; padding-bottom: 5px"
				>
					<div class="g-flex g-fw-w" style="min-width: 720px">
						<div>
							<span class="g-filter-label">操作时间：</span>
							<vc-date-picker
								v-model="deal_time"
								type="datetimerange"
								format="YYYY-MM-DD HH:mm:ss"
								placeholder="请选择操作开始时间和结束时间"
								class="g-w-300"
								@change="handleSelectTime"
							/>
						</div>
						<div>
							<span class="g-filter-label">操作人：</span>
							<vc-input
								v-model="keywords.action_user"
								style="width: 160px"
								placeholder="请输入操作人"
								@enter="handleSearch"
								@change="handleInputChange"
							/>
						</div>
						<div>
							<span class="g-filter-label">模块：</span>
							<vc-select
								v-model="keywords.module"
								style="width: 160px"
								clearable
								placeholder="请选择模块"
								@change="handleSearch"
							>
								<vc-option
									v-for="(value, key, index) in moduleList"
									:key="index"
									:value="key"
								>
									{{ value }}
								</vc-option>
							</vc-select>
						</div>
					</div>
				</div>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import { Message, Modal } from '@wya/vc';
import API_ROOT from '@stores/apis/root';
import { debounce } from 'lodash';

export default {
	name: 'xls-filter',
	components: {
	},
	data() {
		const { query = {} } = this.$route;
		return {
			deal_time: [],
			keywords: {
				data_info: String(query.data_info || ''),
				module: String(query.module || ''),
				action_user: String(query.action_user || ''),
				start_time: String(query.start_time || ''),
				end_time: String(query.end_time || ''),
			},
			moduleList: {},
			show: false,
		};
	},
	mounted() {
		this.loadModuleData();
	},
	methods: {
		handleSearch: debounce(function (value) {
			let query = {
				...this.$route.query,
				...this.keywords,
			};
			this.$router.replace(URL.merge({
				path: '/setting/log',
				query
			}));
			this.$store.commit('SETTING_LOG_LIST_INIT');
		}, 300),
		// 模块下拉框列表获取
		loadModuleData() {
			this.$request({
				url: '_SETTING_LOG_MODULE_GET',
				type: 'GET',
			}).then((res) => {
				this.moduleList = res.data;
			}).catch((error) => {
				console.log(error, 'error');
			});
		},
		handleToggle() {
			this.show = !this.show;
		},
		handleSelectTime(v) {
			this.deal_time = v;
			this.keywords.start_time = this.deal_time[0];
			this.keywords.end_time = this.deal_time[1];
			this.handleSearch();
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
		handleExport() {
			this.$request({
				url: '_SETTING_LOG_LIST_EXPORT_GET',
				type: 'GET',
				param: {
					...this.$route.query,
				}
			}).then((result) => {
				Modal.warning({
					title: '创建导出任务成功，请前往任务管理下载',
					content: ``,
					mask: false,
					loading: true,
					onOk: () => {
						this.$router.push('/setting/task');
					}
				});
			}).catch((error) => {
				console.log(error, 'error');
			});
		}
	}
};

</script>

<style lang="scss">
</style>
