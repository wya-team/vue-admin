<template>
	<div :style="{left: `${leftMenuWidth}px`}" class="v-layout-top">
		<div v-if="typeof topMenus === 'string'" class="_name">
			{{ topMenus }}
		</div>
		<div v-else-if="(topMenus instanceof Array)" class="g-flex-ac g-fw-w">
			<router-link 
				v-for="(menu) in topMenus"
				:key="menu.path"
				:to="menu.path"
				:class="$route.path.indexOf(menu.path) > -1 ? '_menu-item-active' : '_menu-item-unactive'" 
				class="_menu-item"
			>
				{{ menu.title }}
			</router-link>
		</div>
	</div>
</template>

<script>
import { NAV_DATA } from './nav-config';

export default {
	name: 'tpl-layout-top',
	components: {

	},
	props: {

	},
	data() {
		return {
			leftMenuWidth: 0
		};
	},
	computed: {
		navRouteArray() {
			let routeArray = this.$route.path.split('/');
			let oneLevel = `/${routeArray[1]}`;
			let towLevel = `${oneLevel}/${routeArray[2]}`;
			let threeLevel = `${towLevel}/${routeArray[3]}`;
			return [oneLevel, towLevel, threeLevel];
		},
		topMenus() {
			return this.findMenu(NAV_DATA, 0);
		},
	},
	watch: {
		
	},
	created() {
		this.$vc.on('layout-left-menu', this.setLeftDistance);
	},
	mounted() {
		// 让left-menu 再次告知它自己当前的宽度
		this.$vc.emit('layout-top-menu', { distance: 55 });
		this.$vc.emit('layout-left-menu-emit-again', { emit: true });
	},
	destroyed() {
		this.$vc.emit('layout-top-menu', { distance: 0 });
		this.$vc.off('layout-left-menu', this.setLeftDistance);
	},
	methods: {
		setLeftDistance({ distance }) {
			this.leftMenuWidth !== distance && (this.leftMenuWidth = distance);
		},
		findMenu(data, index) {
			return data.reduce((pre, cur) => {
				const { path, children } = cur;
				const curLevelNav = this.navRouteArray[index];
				const hasChildren = children && children.length > 0;
				if (path === curLevelNav) {
					if (index < 1 && hasChildren) {
						pre = this.findMenu(children, index + 1);
					} else {
						pre = hasChildren ? children : cur.title;
					}	
				}
				return pre;
			}, []);
		}
	},
};
</script>

<style lang="scss">
.v-layout-top {
	position: fixed;
	top: 0px;
	right: 0;
	z-index: 999;
	background-color: $white;
	padding: 0 15px;
	border-bottom: 1px solid $cd9;
	height: 56px;
	._name {
		font-size:14px;
		color:$c000;
		height: 56px;
		line-height: 56px;
		padding-left: 21px;
	}
	._menu-item {
		height: 56px;
		line-height: 56px;
		font-size: 14px;
		margin-right: 48px;
		cursor: pointer;
	}
	._menu-item-unactive {
		color: $c000;
		opacity: 0.8;
		&:hover {
			opacity: 1;			
			will-change: opacity;
			transition: opacity 0.2s ease-in-out;
		}
	}
	._menu-item-active {
		color: $main;
		border-bottom: 2px solid $main;
		box-sizing: border-box
	}
}
</style>
