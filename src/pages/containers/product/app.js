export const productConfig = [
	{
		path: '/product/category',
		name: 'product-category',
		meta: { title: '' },
		components: [
			() => import('./modules/product-category.vue'),
			'left',
			'top'
		]
	}
];
