<template>
	<set-title title="基础设置">
		<tpl-content />
	</set-title>
</template>

<script>

import Content from '@components/order/setting-basic/content';

export default {
	name: 'tpl-order-setting-basic',
	components: {
		'tpl-content': Content
	},
};
</script>

