<template>
	<set-title title="" style="padding: 24px">
		<tpl-filter />
		<tpl-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/order/main-all/tabs-list';
import Filter from '@components/order/main-all/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-order-main-all',
	components: {
		"tpl-tabs-list": TabsList,
		"tpl-filter": Filter,
	},
	mixins: [navigator('ORDER_MAIN_ALL')],
};
</script>

