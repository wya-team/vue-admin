<template>
	<div>
		<vc-button
			type="primary"
			class="g-m-b-24"
			@click="handleAdd"
		>
			新增分类
		</vc-button>
		<div>
			<span>分类名称：</span>
			<vc-input
				v-model="keywords.category_name"
				placeholder="请输入分类名称"
				style="width: 240px"
				clearable
				@enter="handleSearch"
				@change="handleInputChange"
			/>
			<vc-button
				type="primary"
				class="g-m-l-24"
				@click="handleSearch"
			>
				查询
			</vc-button>
		</div>
	</div>
</template>

<script>
import { URL } from '@utils/utils';
import { debounce } from 'lodash';
import { Editor } from './popup/editor';

export default {
	name: 'tpl-filter',
	components: {
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keywords: {
				category_name: String(query.category_name || ''),
				name: String(query.name || ''),
			},
		};
	},
	methods: {
		handleSearch: debounce(function (value) {
			let query = {
				...this.$route.query,
				...this.keywords,
			};
			this.$router.replace(URL.merge({
				path: '/product/category',
				query
			}));
			this.$store.commit('PRODUCT_CATEGORY_LIST_INIT');
		}, 300),
		handleChange(obj) {
			let type = Object.keys(obj)[0];
			let value = obj[type];
			this.keywords[type] = value;
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleAdd() {
			Editor.popup({
				level: 1,
				trigger: 'filter'
			}).then((res) => {
				this.$store.commit('PRODUCT_CATEGORY_LIST_INIT');
			}).catch((res) => {
				console.log(res, 'close');
			});
		}
	}
};

</script>

<style lang="scss">

</style>
