<template>
	<vc-table-item>
		<vc-table-column
			prop="task_name"
			label="任务类型"
		/>
		<vc-table-column
			prop="task_status"
			label="状态"
		>
			<template #default="{ row }">
				<span v-if="row.task_status * 1 == 0" class="g-status-dot g-bg-999" />
				<span v-if="row.task_status * 1 == 1" class="g-status-dot g-bg-success" />
				<span v-if="row.task_status * 1 == 2" class="g-status-dot g-bg-info" />
				<span v-if="row.task_status * 1 == 3" class="g-status-dot g-bg-error" />
				<span v-if="row.task_status * 1 == 0">正在导出</span>
				<span v-if="row.task_status * 1 == 1">已结束</span>
				<span v-if="row.task_status * 1 == 2">未开始</span>
				<span v-if="row.task_status * 1 == 3">暂停</span>
			</template>
		</vc-table-column>
		<vc-table-column label="是否成功">
			<template #default="{ row }">
				<span>
					{{ row.is_success * 1 == 0 ? '待定' : (row.is_success * 1 == 1 ? '成功' : '失败') }}
				</span>
			</template>
		</vc-table-column>
		<vc-table-column
			prop="orders_sn"
			label="执行数/总数"
		>
			<template #default="{ row }">
				<span>{{ row.complete_number }}/{{ row.total_number }}</span>
			</template>
		</vc-table-column>
		<vc-table-column
			prop="complete_percent"
			label="进度"
			width="180"
		>
			<template #default="{ row }">
				<div class="v-setting-task-item">
					<vc-progress
						:key="row.task_id"
						:stroke-width="7"
						:percent="row.complete_percent"
						:status="statusList[row.is_success]"
					/>
					<span v-if="row.is_success * 1 == 0" class="g-c-999">
						正在导出，请手动刷新
					</span>
					<span v-if="row.is_success * 1 == 2" class="g-c-999">
						请重新下载
					</span>
				</div>
			</template>
		</vc-table-column>
		<vc-table-column
			prop="create_time"
			label="创建时间"
		/>
		<vc-table-column
			prop="update_time"
			label="更新时间"
		/>
		<vc-table-column
			prop="complete_time"
			label="完成时间"
		>
			<template #default="{ row }">
				<span>{{ row.complete_time == '-' ? '--' : row.complete_time }}</span>
			</template>
		</vc-table-column>
		<vc-table-column
			prop="operate"
			min-width="60"
			align="right"
			fixed="right"
			label="操作"
		>
			<template #default="{ row }">
				<span
					v-if="row.file_url != ''"
					class="g-pointer g-c-main"
					@click="handleDownLoad(row.file_url)"
				>
					下载
				</span>
			</template>
		</vc-table-column>
	</vc-table-item>
</template>

<script>
import { URL } from '@utils/utils';

export default {
	name: 'v-tpl-item',
	data() {
		return {
			statusList: {
				0: 'active',
				1: 'success',
				2: 'error'
			}
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SETTING_TASK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SETTING_TASK_LIST_RESET', { type: this.type });
		},
		handleDownLoad(url) {
			window.open(`${url}`);
		}
	},
};
</script>

<style lang="scss">
.v-setting-task-item{
	.vc-progress-line__inner {
		height: 3px !important;
	}
	.vc-progress-line__icon--success {
		color: #00A854;
	}
}
</style>
