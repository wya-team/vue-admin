<template>
	<set-title title="">
		<tpl-content />
	</set-title>
</template>

<script>

import Content from '@components/order/after-sale-detail/content';

export default {
	name: 'tpl-order-after-sale-detail',
	components: {
		'tpl-content': Content
	},
};
</script>

