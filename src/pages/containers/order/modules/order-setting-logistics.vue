<template>
	<set-title title="" style="padding: 24px">
		<tpl-filter />
		<tpl-list />
	</set-title>
</template>

<script>
import List from '@components/order/setting-logistics/list';
import Filter from '@components/order/setting-logistics/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-order-setting-logistics',
	components: {
		"tpl-list": List,
		"tpl-filter": Filter,
	},
	mixins: [navigator('ORDER_SETTING_LOGISTICS')],
};
</script>

