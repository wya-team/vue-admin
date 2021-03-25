<template>
	<div class="v-order-batch">
		<div class="__explain">
			<div style="margin-bottom: 32px;">
				<p class="__title">使用说明</p>
				<p>
					1.下载Excel模板文件。
					<a
						class="g-c-main"
						href="https://xls-web.oss-cn-hangzhou.aliyuncs.com/common/系统批量发货模板.xlsx"
					>下载模板</a>
				</p>
				<p>2.根据要求录入信息（订单号、物流公司、物流单号）。</p>
				<p>上传文件，点击确认发货即可。</p>
			</div>
			<div>
				<p class="__title">注意</p>
				<p>1.最大支持1MB的xlsx的文件。</p>
				<p>2.当前仅支持状态为等待总部发货或追溯码已录入待发货的订单。</p>
				<p>3.云订单和自提订单不能进行批量发货。</p>
				<p>4.对于拆分发货的订单仅需填写拆分后的订单号即可。</p>
				<!-- <p>
					5.订单类型必须为：
					<template
						v-for="(item, i) in orderType"
					>
						<span v-if="item.show" :key="i">
							<template v-if="i !== 0">
								、
							</template>
							{{ item.name }}
						</span>
					</template>
				</p> -->
			</div>
		</div>
		<div class="g-flex __uploda-wrapper">
			<span class="g-c-333">选择文件上传：</span>
			<div style="margin-top: -7px; width: 300px;">
				<xls-upload-files />
			</div>
		</div>
		<div class="g-m-t-30">
			<vc-paging
				ref="tableTarget"
				:data-source="listInfo.data"
				:total="listInfo.total"
				:count="listInfo.count"
				:reset="listInfo.reset"
				:history="true"
				:load-data="loadData"
				class="v-order-setting-logistics-list"
				mode="table"
				@page-size-change="handleChangePageSize"
			>
				<vc-table-item
					style="margin-top: 52px;"
				>
					<vc-table-column
						prop="create_time"
						label="操作时间"
					/>
					<vc-table-column
						prop="admin_user_name"
						label="操作人"
					/>
					<vc-table-column
						prop="total_count"
						label="发货数"
					/>
					<vc-table-column
						prop="success_count"
						label="发货成功数"
					/>
					<vc-table-column
						prop="status"
						label="发货状态"
					>
						<template #default="{ row }">
							{{ row.status === 1 ? '进行中' : '已完成' }}
						</template>
					</vc-table-column>
					<vc-table-column
						label="操作"
						align="right"
					>
						<template #default="{ row }">
							<a
								v-if="row.status === 2"
								:href="row.oss_url"
								class="g-c-main"
								target="_blank"
							>
								下载发货进度
							</a>
						</template>
					</vc-table-column>
				</vc-table-item>
			</vc-paging>
		</div>
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import FilesUpload from './files-upload';

export default {
	name: 'xls-batch',
	components: {
		'xls-upload-files': FilesUpload
	},
	data() {
		return {
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.orderBatch.listInfo;
		}
	},
	created() {
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = URL.parse(); // 解析路径；
			return this.request({
				url: 'ORDER_BATCH_GET',
				type: 'GET',
				param: {
					...query,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				this.$Message.error(error);
				console.log(error, 'error');
			});
		},
		handleChangePageSize() {
			this.$store.commit('ORDER_BATCH_INIT');
		},
		handleError() {

		},
	},
};
</script>

<style lang="scss">
.v-order-batch {
	margin: 0 24px 24px;
	padding-top: 24px;
	.__explain {
		padding: 22px 24px;
		background: $cf9;
		p {
			color: $c51;
			margin-bottom: 8px;
			&.__title {
				color: $c000;
				margin-bottom: 16px;
			}
		}

	}
	.__uploda-wrapper {
		margin-top: 32px;
		.__upload-button {
			width: 112px;
			height: 32px;
			line-height: 32px;
			text-align: center;
			border: 1px solid $cd9;
			border-radius: 4px;
			color: $c51;
			font-size: 12px;
		}
	}
	// 覆盖loading的相关样式
	.vcp-files-picker {
		margin: 0;
	}
}
</style>
