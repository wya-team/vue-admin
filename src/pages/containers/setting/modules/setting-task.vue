<template>
	<set-title title="任务管理" style="padding: 24px">
		<tpl-filter />
		<tpl-list />
	</set-title>
</template>

<script>
import List from '@components/setting/task/list';
import Filter from '@components/setting/task/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-setting-task',
	components: {
		"tpl-list": List,
		"tpl-filter": Filter,
	},
	mixins: [navigator('SETTING_TASK')],
};
</script>

