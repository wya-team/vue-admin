<template>
	<set-title title="" style="padding: 24px">
		<tpl-filter />
		<tpl-list />
	</set-title>
</template>

<script>
import List from '@components/order/setting-template/list';
import Filter from '@components/order/setting-template/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-order-setting-template',
	components: {
		"tpl-list": List,
		"tpl-filter": Filter,
	},
	mixins: [navigator('ORDER_SETTING_TEMPLATE')],
};
</script>

