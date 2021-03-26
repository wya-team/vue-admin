<template>
	<vc-modal
		v-model="visible"
		size="medium"
		title="规格管理"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<div style="margin: 8px 0 16px 0px">
			<div class="g-flex g-m-b-24">
				<vc-input
					v-model="specName"
					clearable
					placeholder="请输入"
					style="width: 300px"
				/>
				<vc-button 
					type="primary" 
					class="g-m-l-24"
					@click="handleAddCustomerSpec"
				>新增规格</vc-button>
			</div>
			<vc-table
				:data-source="specList"
				class="c-product-goods-sku-popup-sku"
				style="max-height: 500px overflow-y: scroll;"
			>
				<vc-table-column
					prop="spec_name"
					label="规格"
					width=" width"
				/>
				<vc-table-column
					:width="95"
					prop="prop"
					label="操作"
					align="right"
				>
					<template #default="{ row, $index }">
						<div class="g-flex-ac">
							<div class="_sort-icon g-inline-block">
								<vc-icon 
									v-if="$index !== 0" 
									type="triangle-up"
									class="_sort_up"
									@click="handlePrev($index)"
								/>
								<vc-icon 
									v-if="$index !== specList.length - 1"
									class="_sort_down"
									type="triangle-down"
									@click="handleNext($index)" 
								/>
							</div>
							<span 
								class="g-link-text g-pointer g-m-l-24"
								@click="handleDel(row.spec_id)"
							>删除</span>
						</div>
					</template>
				</vc-table-column>
			</vc-table>
		</div>	
	</vc-modal>
</template>
<script>
import { Portal, Message } from '@wya/vc';
import { cloneDeep } from "lodash";

const config = {
	name: "tpl-product-goods-manage-spec",
	props: {
		dataSource: Array,
	},
	data() {
		return {
			visible: false,
			specName: '',
			specList: cloneDeep(this.dataSource),
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handlePrev(index) {
			const temp = { ...this.specList[index] };
			this.specList[index] = { ...this.specList[index - 1] };
			this.$set(this.specList, index - 1, temp);
		},
		handleNext(index) {
			const temp = { ...this.specList[index] };
			this.specList[index] = { ...this.specList[index + 1] };
			this.$set(this.specList, index + 1, temp);
		},
		handleDel(id) {
			this.$request({
				url: "_PRODUCT_GOODS_EDITOR_SPEC_DELETE_POST",
				param: { spec_id: id, },
				type: "POST",
			}).then(res => {
				let data = cloneDeep(this.specList.filter((item) => item.spec_id != id));
				this.specList = [...data];
			}).catch(err => {
				console.log(err);
			});
		},
		handleAddCustomerSpec() {
			if (!this.specName) {
				Message.warning('请先填写规格名称');
				return;
			}
			return this.$request({
				url: '_PRODUCT_GOODS_EDITOR_SPEC_ADD_POST',
				type: 'POST',
				param: { spec_name: this.specName },
				loading: false,
			}).then((res) => {
				this.specList.push(res.data);
				this.specName = '';
			}).catch((error) => {
			});
		},
		handleCancel() {
			this.$emit('close', this.specList);
		},
		async handleOk(e, cb) {
			let list = this.specList.map((it) => it.spec_id);
			await this.$request({
				url: "_PRODUCT_GOODS_EDITOR_SPEC_SORT_POST",
				type: "POST",
				param: { spec_sort_list: list },
			});
			cb();
			this.$emit("sure", this.specList);
		},
	}
};
export default config;

export const ManageSpec = new Portal(config, {});
</script>
<style lang="scss">
.c-product-goods-sku-popup-sku {
	._sort-icon {
		position: relative;
		width: 14px;
		height: 28px;
		left: 10px;
		._sort_up, ._sort_down {
			position: absolute;
			top: 5px
		}
		._sort_down {
			top: 14px
		}
		.vc-icon svg {
			width: 0.8em;
			height: 0.8em;

		}
	}
	.vc-form-item__tip {
		left: 70px;
	} 
}

</style>
