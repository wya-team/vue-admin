<template>
	<vc-table-item>
		<vc-table-column
			prop="express_name"
			label="物流公司"
			align="left"
		>
			<template #default="{ row }">
				<div class="g-flex">
					<div class="g-oneline">{{ row.express_name }}</div>
					<span v-if="row.default" class="_red-label g-m-l-8">默认</span>
				</div>
			</template>
		</vc-table-column>
		<vc-table-column label="状态">
			<template #default="{ row }">
				<span :class="row.is_use ? 'g-bg-success' : 'g-bg-bbb'" class="g-status-dot" />
				{{ row.is_use ? '已开启' : '未开启' }}
			</template>
		</vc-table-column>

		<vc-table-column 
			label="操作"
			align="right"
			width="140"
		>
			<template #default="{ row }">
				<vca-table-operate 
					:data-source="getOperations(row)"
					@ok="(label, operate) => handleOperation(operate.value, row)"
				/>
			</template>
		</vc-table-column>

	</vc-table-item>
</template>
<script>
import { Modal } from '@wya/vc';
import { Editor } from './popup/editor';

export default {
	name: 'tpl-logistics-table',
	components: {
	},
	methods: {
		getOperations(row) {
			// is_default表示是否为系统初始物流，是不可编辑和删除的，default才是表示是否为默认物流
			const { is_default, default: isDefault, is_use } = row;
			const list = [];
			if (!is_default) {
				list.push({
					label: '编辑',
					value: 'edit'
				});
			}
			list.push({
				label: is_use ? '关闭' : '开启',
				value: 'switch'
			});
			if (!isDefault && is_use) {
				list.push({
					label: '设为默认',
					value: 'setDefault'
				});
			}
			if (!is_default) {
				list.push({
					label: '删除',
					value: 'delete'
				});
			}
			return list;
		},
		handleOperation(name, row) {
			const { express_id, shipping_id, express_name, is_use } = row;
			switch (name) {
				case 'edit':
					this.handleEditor(express_id, shipping_id, express_name, is_use);
					break;
				case 'switch':
					this.handleSwitchChange(shipping_id, is_use);
					break;
				case 'setDefault':
					this.handleSetDefault(express_id);
					break;
				case 'delete':
					this.handleDelete(shipping_id, express_name);
					break;
				default:
					break;
			}
		},
		handleEditor(expressId, shippingId, name, use) {
			// 为编辑modal需要传 isNewAdd: false
			Editor.popup({
				isNewAdd: false,
				expressId,
				shippingId,
				name,
				use,
				store: this.$store,
			}).then(res => {

			}).catch(e => {
				console.log(e);
			});
		},
		handleSwitchChange(shipping_id, is_use) {
			this.$request({
				url: '_ORDER_SETTING_LOGISTICS_CHANGE_STATUS_POST',
				type: 'POST',
				verify: 87,
				param: {
					shipping_id,
					is_use: is_use === 1 ? 0 : 1,
				},
			}).then(() => {
				this.$store.commit('ORDER_SETTING_LOGISTICS_LIST_INIT');
			}).catch(e => {
				this.$store.commit('ORDER_SETTING_LOGISTICS_LIST_INIT');
			});
		},
		handleSetDefault(expressId) {
			this.$request({
				url: '_ORDER_SETTING_LOGISTICS_SET_DEFAULT_GET',
				type: 'GET',
				param: {
					express_id: expressId
				}
			}).then(() => {
				this.$store.commit('ORDER_SETTING_LOGISTICS_LIST_INIT');
			}).catch(error => {
				console.log(error);
			});
		},
		handleDelete(id, name) {
			Modal.warning({
				title: `是否确认删除该物流公司：${name}？`,
				onOk: () => {
					this.$request({
						url: '_ORDER_SETTING_LOGISTICS_DELETE_POST',
						type: 'POST',
						param: {
							shipping_id: id,
						}
					}).then(res => {
						this.$store.commit('ORDER_SETTING_LOGISTICS_LIST_INIT');
					}).catch(e => {
						console.log(e);
					});
				}
			});
		},
	}

};
</script>

<style lang="scss">

</style>
