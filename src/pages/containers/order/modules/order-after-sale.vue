<template>
	<set-title title="" style="padding: 24px">
		<tpl-filter />
		<tpl-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/order/after-sale/tabs-list';
import Filter from '@components/order/after-sale/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-order-after-sale',
	components: {
		"tpl-tabs-list": TabsList,
		"tpl-filter": Filter,
	},
	mixins: [navigator('ORDER_AFTER_SALE')],
};
</script>

