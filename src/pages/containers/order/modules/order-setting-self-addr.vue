<template>
	<set-title title="" style="padding: 24px">
		<tpl-filter />
		<tpl-list />
	</set-title>
</template>

<script>
import List from '@components/order/setting-self-addr/list';
import Filter from '@components/order/setting-self-addr/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-order-setting-self-addr',
	components: {
		"tpl-list": List,
		"tpl-filter": Filter,
	},
	mixins: [navigator('ORDER_SETTING_SELF_ADDR')],
};
</script>

