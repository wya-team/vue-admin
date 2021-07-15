<template>
	<div class="c-layout-left-menu g-flex">
		<div class="_one-level">
			<div style="height: 56px">
				<slot name="logo" />
			</div>
			<template v-for="(chunk, index) in chunks">
				<router-link 
					:key="index"
					:to="chunk.path"
					:class="currentChunk.path === chunk.path ? '__chunk-item-active' : '__chunk-item-unactive'" 
					class="__chunk-item"
				>
					<i class="iconfont icon-add g-m-r-10" />
					{{ chunk.title }}
				</router-link>
			</template>
		</div>
		<div v-if="childMenus.length" class="_two-level">
			<div class="__name">
				{{ currentChunk.title }}
			</div>
			<div style="padding: 12px">
				<template v-for="(menu, index) in childMenus">
					<router-link 
						:key="index"
						:to="menu.path"
						:class="$route.path.includes(menu.path) ? '__menu-item-active' : '__menu-item-unactive'" 
						class="__menu-item"
					>
						{{ menu.title }}
					</router-link>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { NAV_DATA } from './nav-config';

export default {
	name: 'tpl-layout-left',
	components: {

	},
	props: {

	},
	data() {
		return {
		};
	},
	computed: {
		chunks() {
			return NAV_DATA;
		},
		currentChunk() {
			let routeArray = this.$route.path.split('/');
			let oneLevel = `/${routeArray[1]}`;
			return this.chunks.filter(chunk => chunk.path === oneLevel)[0] || {};
		},
		/**
		 * 获取二级导航菜单
		 */
		childMenus() {
			return this.currentChunk.children || [];
		},
	},
	watch: {
		childMenus(newVal, oldVal) {
			if (newVal.length !== oldVal.length) {
				this.emitLeftMenuWidth();
			}
		}
	},
	mounted() {
		this.emitLeftMenuWidth();
		// 防止其他组件在其发射时还没渲染
		this.$vc.on('layout-left-menu-emit-again', this.emitLeftMenuWidth);
	},
	destroyed() {
		this.$vc.emit('layout-left-menu', { distance: 0 });
		this.$vc.off('layout-left-menu-emit-again', this.emitLeftMenuWidth);
	},
	methods: {
		emitLeftMenuWidth() {
			this.$vc.emit('layout-left-menu', { distance: this.childMenus.length ? 232 : 102 });
		},
	},
};
</script>

<style lang="scss">
.c-layout-left-menu {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 4;
	height: 100vh;
	user-select: none;
	._one-level {
		height: 100%;
		width: 102px;
		background-color: $c444;
		.__chunk-item {
			height: 42px;
			line-height: 42px;
			display: block;
			padding-left: 23px;
			font-size: 15px;
			cursor: pointer;
		}
		.__chunk-item-unactive {
			color: $cbd;
			&:hover {
				background-color: $c67;
				transition: background-color 0.2s linear;
			}
		}
		.__chunk-item-active {
			background-color: $cf8;
			color: $c000;
		}
	}
	._two-level {
		width: 130px;
		background-color: $white;
		.__name {
			height: 56px; 
			line-height: 56px;
			font-size: 14px;
			color: $c000;
			border-bottom: 1px solid $cd9;
			border-right: 1px solid $cd9;
			text-align: center
		}
		.__menu-item {
			height: 32px;
			line-height: 32px;
			font-size: 14px;
			cursor: pointer;
			margin-bottom: 5px;
			text-align: center;
			display: block;
		}
		.__menu-item-unactive {
			color: #676767;
			&:hover {
				color: $main;
				transition: color 0.2s linear;
			}
		}
		.__menu-item-active {
			color: $c000;
			background:$cef;
			border-radius:4px;
		}
	}
}
</style>
