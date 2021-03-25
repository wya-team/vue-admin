<template>
	<set-title title="批量发货">
		<tpl-content />
	</set-title>
</template>

<script>

import Content from '@components/order/batch/content';

export default {
	name: 'tpl-order-batch',
	components: {
		'tpl-content': Content
	},
};
</script>

