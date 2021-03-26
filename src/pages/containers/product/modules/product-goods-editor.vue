<template>
	<set-title :routes="routes" :title="title">
		<tpl-content />
	</set-title>
</template>

<script>

import Content from '@components/product/goods-editor/content';

export default {
	name: 'tpl-product-goods-editor',
	components: {
		'tpl-content': Content
	},
	data() {
		let title = this.$route.params.id ? '编辑商品' : '添加商品';
		return {
			title,
			routes: [
				{
					path: '/product/goods', // TODO: tpl
					name: '商品管理'
				},
				{
					path: ``,
					name: title
				}
			],
		};
	},
};
</script>

