<template>
	<div class="c-order-append">
		<div class="_left">
			<slot />
		</div>
		<div class="_right">
			<vc-select
				:value="value"
				:clearable="clearable"
				:class="className"
				class="_top"
				style="width: 60px"
				@change="$emit('change', arguments[0])"
			>
				<vc-option :value="60">分</vc-option>
				<vc-option :value="3600">时</vc-option>
				<vc-option :value="86400">天</vc-option>
			</vc-select>
		</div>
		
	</div>
</template>

<script>
export default {
	name: 'c-order-append',
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: [String, Number],
		className: String,
		clearable: {
			type: Boolean,
			default: false
		},
	},
};
</script>

<style lang="scss">
.c-order-append {
	._top .vc-select__input {
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	._left {
		margin-right: -7px;
		display: inline-block;
	}
	._right {
		display: inline;
	}
	._right .vc-input {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
	}
	._right .ivu-input {
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
	}
}

</style>
