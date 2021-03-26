<template>
	<div class="v-batch-add">
		<vc-alert closable>按回车键换行表示该规格已填好</vc-alert>

		<vc-input
			v-model="inputValue"
			:maxlength="40"
			clearable
			autofocus
			placeholder="请输入规格值"
			style="width: 300px;"
			class="g-m-tb-20"
			@enter="handleEnter"
		/>

		<ul class="_value-lsit">
			<li
				v-for="(item, index) in list"
				:key="index"
				class="_value-item g-m-b-10"
			>
				{{ item.spec_value_name }}
				<vc-icon type="close" class="_close-icon g-m-l-5 g-fs-12 g-pointer" @click="handleDelItem(index)" />
			</li>
		</ul>
	</div>
</template>

<script>
import { Message } from '@wya/vc';
import { Utils } from '@utils/utils';

export default {
	name: 'tpl-product-spec-value-batch-add',
	data() {
		return {
			inputValue: '',
			list: []
		};
	},
	methods: {
		handleEnter() {
			if (this.inputValue !== '') {
				if (this.list.some(ite => ite.spec_value_name == this.inputValue)) {
					Message.warning('规格值重复');
					return;
				}
				this.list.push({
					spec_value_name: this.inputValue,
					uid: Utils.getUid()
				});
				this.inputValue = '';
			}
		},
		handleDelItem(index) {
			this.list.splice(index, 1);
		},
		getList() {
			return this.list;
		}
	}
};
</script>

<style lang="scss">
.v-batch-add {
	._value-list {
		display: flex;
		flex-wrap: wrap;
	}
	._value-item {
		display: inline-block;
		padding: 3px 10px;
		color: $c51;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		background-color: #f5f5f6;
		list-style: none;
		&:not(:last-child) {
			margin-right: 10px;
		}
		._close-icon {
			transform: scale(.65);
		}
	}
}
</style>
