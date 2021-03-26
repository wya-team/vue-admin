<template>
	<vc-modal
		v-model="visible"
		title="添加规格值"
		size="medium"
		class="v-product-goods-add-spec-value-modal"
		@cancel="handleCancel"
		@ok="handleOk"
	>
		<template v-if="page === 'main'">
			<vc-alert closable>此处勾选表示已选规格</vc-alert>
			<div class="g-m-t-20">
				<vc-button type="primary" @click="handleBatchAdd">+批量添加</vc-button>
				<vc-button class="g-m-l-10" @click="handleSingleAdd">添加</vc-button>
				<vc-button :disabled="!selected.length" class="g-m-l-10" @click="handleBatchDelete">批量删除</vc-button>
			</div>

			<vc-table
				:data-source="dataSource"
				class="g-m-t-20"
				max-height="270"
				@selection-change="handleSelectionChange"
			>
				<vc-table-column type="selection" />
				<vc-table-column label="规格">
					<template #default="{ row, $index }">
						<vc-input
							v-if="row.sponsor === 'add' || row.sponsor === 'edit'"
							ref="input"
							v-model="row.spec_value_name"
							:maxlength="40"
							clearable
							autofocus
							placeholder="请输入规格值"
							@blur="handleEnter(row, $index)"
							@enter="handleEnter(row, $index)"
						/>
						<span v-else class="_sku-name-wrapper" @click="handleEditName($index)">
							{{ row.spec_value_name }}
							<vc-icon 
								type="edit" 
								class="g-link-text _edit-icon"
							/>
						</span>
					</template>
				</vc-table-column>
				<vc-table-column label="操作" align="right">
					<template #default="{ $index }">
						<div class="g-flex-ac g-jc-fe">
							<span class="g-flex-cc g-fd-c g-m-r-5 g-pointer">
								<vc-icon 
									v-if="$index > 0" 
									type="triangle-up" 
									class="_triangle-icon _triangle-up g-fs-8"
									@click="handlePrev($index)"
								/>
								<vc-icon 
									v-if="$index < dataSource.length - 1" 
									type="triangle-down" 
									class="_triangle-icon _triangle-down g-fs-8"
									@click="handleNext($index)"
								/>
							</span>
							<span class="g-link-text" @click="handleSingleDelete($index)">删除</span>
						</div>
					</template>
				</vc-table-column>
			</vc-table>
		</template>
		<tpl-batch-add v-else-if="page === 'batchAdd'" ref="batchAdd" />
	</vc-modal>
</template>

<script>
import { Portal, Modal, Message } from '@wya/vc';
import { Utils } from '@utils/utils';
import BatchAdd from './batch-add';

const config = {
	name: 'tpl-product-goods-add-spec-value-modal',
	components: {
		'tpl-batch-add': BatchAdd
	},
	props: {
		specID: [String, Number]
	},
	data() {
		return {
			visible: false,
			page: 'main',
			dataSource: [],
			selected: []
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleBatchAdd() {
			this.page = 'batchAdd';
		},
		handleSingleAdd() {
			this.dataSource.push({
				spec_value_name: '',
				sponsor: 'add',
				uid: Utils.getUid()
			});
			this.$nextTick(() => {
				this.$refs.input.focus();
				this.$refs.input.$el.scrollIntoView();
			});
		},
		handleBatchDelete() {
			Modal.warning({
				title: '您确定要删除所选规格值吗？',
				onOk: () => {
					this.dataSource = this.dataSource.filter((it) => !this.selected.includes(it.uid));
				}
			});
		},
		handleSingleDelete(index) {
			this.dataSource.splice(index, 1);
		},
		handleSelectionChange(selection) {
			this.selected = selection.map((it) => it.uid);
		},
		handleEnter(row, index) {
			if (row.spec_value_name !== '') {
				// 校验是否重复
				const target = this.dataSource.find((it, idx) => it.spec_value_name === row.spec_value_name && index !== idx);
				if (target) {
					Message.warning('规格值重复');
					row.spec_value_name = '';
				} else {
					this.$set(this.dataSource[index], 'sponsor', '');
					this.$refs.input.blur();
				}
			}
		},
		handlePrev(index) {
			const temp = { ...this.dataSource[index] };
			this.dataSource[index] = { ...this.dataSource[index - 1] };
			this.$set(this.dataSource, index - 1, temp);
		},
		handleNext(index) {
			const temp = { ...this.dataSource[index] };
			this.dataSource[index] = { ...this.dataSource[index + 1] };
			this.$set(this.dataSource, index + 1, temp);
		},
		handleCancel(e, cb) {
			return new Promise((resolve, reject) => {
				if (this.page === 'main') {
					cb();
					resolve();
				} else {
					this.page = 'main';
					resolve();
				}
			});
		},
		handleOk(e, cb) {
			return new Promise(async (resolve, reject) => { // eslint-disable-line
				if (this.page === 'main') {
					try {
						let res = await this.handleSaveSpecValue();
						cb();
						this.$emit('sure', res.data);
					} catch (error) {
						reject();
					}
				} else {
					const list = this.$refs.batchAdd.getList();
					list.length && (this.dataSource = this.dataSource.concat(list));
					this.page = 'main';
					resolve();
				}
			});
		},
		handleSaveSpecValue() {
			const list = this.dataSource.filter(it => it.spec_value_name).map(it => it.spec_value_name);
			if (!list.length) return Promise.resolve();
			return this.$request({
				url: '_PRODUCT_GOODS_EDITOR_SPEC_VALUE_ADD_POST',
				type: 'POST',
				param: {
					spec_id: this.specID,
					spec_value_name: list
				},
			});
		},
	},
};

export default config;
export const AddSpecValue = new Portal(config, {});
</script>

<style lang="scss">
.v-product-goods-add-spec-value-modal {
	._sku-name-wrapper {
		display: inline-block;
		._edit-icon {
			display: none;
			margin-left: 5px;
		}
		&:hover {
			._edit-icon {
				display: inline;
			}
		}
	}
	._triangle-icon {
		&:hover {
			color: $main;
		}
		svg {
			width: .8em;
			height: .8em;
		}
	}
}
</style>
