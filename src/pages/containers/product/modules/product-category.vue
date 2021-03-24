<template>
	<set-title title="" style="padding: 24px">
		<tpl-filter />
		<tpl-list />
	</set-title>
</template>

<script>
import List from '@components/product/category/list';
import Filter from '@components/product/category/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'tpl-product-category',
	components: {
		"tpl-list": List,
		"tpl-filter": Filter,
	},
	mixins: [navigator('PRODUCT_CATEGORY')],
};
</script>

