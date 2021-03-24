<template>
	<set-title title="">
		<tpl-content />
	</set-title>
</template>

<script>

import Content from '@components/order/setting-postage/content';

export default {
	name: 'tpl-order-setting-postage',
	components: {
		'tpl-content': Content
	},
};
</script>

