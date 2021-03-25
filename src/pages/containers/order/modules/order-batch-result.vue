<template>
	<set-title title="上传结果页面" class="v-order-batch-result">
		<tpl-content />
	</set-title>
</template>

<script>

import Content from '@components/order/batch-result/content';

export default {
	name: 'tpl-order-batch-result',
	components: {
		'tpl-content': Content
	},
};
</script>

<style lang="scss">
.v-order-batch-result {
	height: 100vh;
}
</style>
