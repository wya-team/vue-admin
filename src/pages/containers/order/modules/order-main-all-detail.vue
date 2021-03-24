<template>
	<set-title title="">
		<tpl-content />
	</set-title>
</template>

<script>

import Content from '@components/order/main-all-detail/content';

export default {
	name: 'tpl-order-main-all-detail',
	components: {
		'tpl-content': Content
	},
};
</script>

