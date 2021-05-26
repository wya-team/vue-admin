/**
 * TODO: 
 */
export const settingNavConfig = {
	path: '/setting',
	name: 'setting',
	title: '设置',
	children: [
		{
			path: '/setting/task',
			name: 'setting-task',
			title: '任务管理',
			components: [
				() => import('./modules/setting-task.vue'),
				'left',
				'top'
			]
		},
		{
			path: '/setting/log',
			name: 'setting-log',
			title: '操作日志',
			components: [
				() => import('./modules/setting-log.vue'),
				'left',
				'top'
			]
		}
	]
};

// 非导航路由
export const settingConfig = [
	
];