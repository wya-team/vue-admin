<template>
	<set-title title="操作日志" style="padding: 24px">
		<tpl-filter />
		<tpl-list />
	</set-title>
</template>

<script>
import List from '@components/setting/log/list';
import Filter from '@components/setting/log/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-setting-log',
	components: {
		"tpl-list": List,
		"tpl-filter": Filter,
	},
	mixins: [navigator('SETTING_LOG')],
};
</script>

