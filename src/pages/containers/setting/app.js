export const settingConfig = [
	{
		path: '/setting/log',
		name: 'setting-log',
		meta: { title: '' },
		components: [
			() => import('./modules/setting-log.vue'),
			'left',
			'top'
		]
	}
];