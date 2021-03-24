export const settingConfig = [
	{
		path: '/setting/task',
		name: 'setting-task',
		meta: { title: '' },
		components: [
			() => import('./modules/setting-task.vue'),
			'left',
			'top'
		]
	},
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
