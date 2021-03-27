<template>
	<vc-form 
		ref="form"
		:model="formData"
		:rules="ruleValidate"
		class="v-product-goods-sku-table"
	>
		<vc-table
			:data-source="formData.dataSource"
			:get-span="getSpan"
			:border="true"
		>
			<vc-table-column
				v-for="(spec, index) in curSpecDataSource"
				:key="spec.spec_id"
				:label="spec.spec_name"
				:resizable="false"
			>
				<template #default="{ row }">{{ row.spec_name_arr[index] }}</template>
			</vc-table-column>
			<vc-table-column
				:min-width="120"
				:resizable="false"
				label="货号"
				class-name="_validate-cloumn"
			>	
				<template #header><span class="g-c-error">*</span>货号</template>
				<template #default="{ row, $index }">
					<vc-form-item 
						:prop="`dataSource.${$index}.sku_sn`"
						:rules="ruleValidate.sku_sn"
						class="_sku-sn-form-item"
					>
						<vc-input
							v-model="row.sku_sn"
							clearable
							placeholder="请输入"
						/>
					</vc-form-item>
				</template>
			</vc-table-column>
			<vc-table-column :min-width="120" :resizable="false" class-name="_validate-cloumn">
				<template #header="{}">
					<span class="g-c-error">*</span>价格
					<tpl-batch-setting @ok="handleBatch('price', arguments[0])" />
				</template>
				<template #default="{ row, $index }">
					<vc-form-item
						:prop="`dataSource.${$index}.sku_price`"
						:rules="ruleValidate.sku_price"
					>
						<vc-input-number
							v-model="row.sku_price"
							:precision="2"
							:step="0"
							clearable
							placeholder="请输入"
						/>
					</vc-form-item>
				</template>
			</vc-table-column>
			<vc-table-column :min-width="120" :resizable="false" class-name="_validate-cloumn">
				<template #header="{}">
					<span class="g-c-error">*</span>重量
					<tpl-batch-setting :precision="0" @ok="handleBatch('weight', arguments[0])" />
				</template>
				<template #default="{ row, $index }">
					<vc-form-item 
						:prop="`dataSource.${$index}.sku_weight`"
						:rules="ruleValidate.sku_weight"
					>
						<vc-input-number
							v-model="row.sku_weight"
							:step="0"
							clearable
							placeholder="请输入"
						/>
					</vc-form-item>
				</template>
			</vc-table-column>
			<vc-table-column
				:min-width="140"
				:resizable="false"
				class-name="_validate-cloumn"
			>
				<template #header>
					<div class="g-flec-ac" style="padding-right: 0;">
						<span class="g-c-error">*</span>图片
						<!-- upload-pick目前还不支持tag属性，所以这里暂时用imgs-picker -->
						<vc-imgs-picker
							ref="imgPicker"
							v-model="batchImages"
							:max="1"
							class="_img-picker"
							tag="span"
							:gallery="false"
							@change="handleImgPickerChange"
						>
							<template #upload>
								<span class="g-link-text" @click.stop="handleBatch('image', $event)">批量设置</span>
							</template>
						</vc-imgs-picker>
						<vc-debounce-click tag="span" @click="handleSyncMainImage">
							<vc-icon type="image" class="g-link-text g-fs-16" style="margin-top: -2px;" />
						</vc-debounce-click>
					</div>
				</template>
				<template #default="{ row, $index }">
					<vc-form-item
						:prop="`dataSource.${$index}.sku_image`"
						:rules="ruleValidate.sku_image"
						class="g-pd-b-10"
					>
						<vc-upload-picker
							v-model="row.sku_image"
							:picker="['image']"
							:max="{image: 1}"
						/>
					</vc-form-item>
				</template>
			</vc-table-column>
		</vc-table>
	</vc-form>
</template>

<script>
import { Message } from '@wya/vc';
import BatchSetting from './popup/batch-setting';

export default {
	name: 'tpl-product-goods-sku-table',
	components: {
		'tpl-batch-setting': BatchSetting
	},
	props: {
		dataSource: {
			type: Array,
			default: () => ([])
		},
		specDataSource: {
			type: Array,
			default: () => ([])
		},
		// 商品主图,拿第一张
		productImage: String
	},
	data() {
		return {
			curSpecDataSource: [],
			batchImages: [],
			formData: {
				dataSource: []
			},
			ruleValidate: {
				sku_sn: [
					{ required: true, message: '请输入规格货号', trigger: 'blur' },
					{
						validator: async (rule, value, cb) => {
							let target = this.formData.dataSource.filter((it) => it.sku_sn == value);
							let isExist = target.length > 1;
							isExist = isExist || await this.checkSkuSNExist(value);
							if (isExist) {
								cb('货号重复请重新输入');
							} else cb();
						}
					}
				],
				sku_price: [{ required: true, message: '请输入规格价格', trigger: 'blur' }],
				sku_weight: [{ required: true, message: '请输入规格重量', trigger: 'blur' }],
				sku_image: [{ required: true, message: '请设置规格图片', trigger: 'change' }]
			},
		};
	},
	computed: {

	},
	watch: {
		specDataSource: {
			immediate: true,
			handler(val) {
				this.curSpecDataSource = val.filter((spec) => spec.spec_id && spec.spec_value_arr.length);
			}
		},
		dataSource: {
			immediate: true,
			handler(val) {
				this.formData.dataSource = val;
			}
		}
	},
	created() {
		
	},
	methods: {
		calcRowSpan(colIndex) {
			let specNumArray = this.curSpecDataSource.reduce((pre, cur) => {
				pre.push((cur.spec_value_arr || []).length);
				return pre;
			}, []);
			return specNumArray.reduce((pre, cur, index) => {
				if (colIndex < index) {
					pre *= specNumArray[index]; //  * 后面规格选中的规格值
				}
				return pre;
			}, 1);
		},
		// columnIndex 从0开始
		getSpan({ row, column, rowIndex, columnIndex }) {
			let rowspan = this.calcRowSpan(columnIndex);
			return {
				rowspan: ((rowIndex + rowspan) % rowspan) ? 0 : rowspan, // 当前规格的第一行合并，剩余的为0
				colspan: 1
			};
		},
		checkSkuSNExist(sku_sn) {
			return this.$request({
				url: '_PRODUCT_GOODS_EDITOR_SKU_SN_EXIST_POST',
				type: 'POST',
				param: { 
					product_id: this.$route.params.id,
					checked_sn: sku_sn 
				}
			}).then(() => {
				// TODO: tpl 是否重复的接口自己判断
				return true;
			}).catch(() => false);
		},
		handleBatch(type, value) {
			let data;
			switch (type) {
				case 'price':
				case 'weight':
					data = this.formData.dataSource.map((it) => {
						return { ...it, [`sku_${type}`]: value };
					});
					this.sync(data);
					break;
				case 'image':
					this.$refs.imgPicker.reset();
					this.$refs.imgPicker.handleClick(value);
					break;
				default:
					break;
			}
		},
		handleImgPickerChange(imgs) {
			let data = this.formData.dataSource.map((it) => ({ ...it, sku_image: imgs }));
			this.sync(data);
			this.batchImages = [];
		},
		// 同步商品主图
		handleSyncMainImage() {
			if (!this.productImage) {
				Message.warning('请先设置商品主图', 2);
				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
				return;
			}
			let data = this.formData.dataSource.map((it) => ({ ...it, sku_image: [this.productImage] }));
			this.sync(data);
		},
		validate() {
			return this.$refs.form.validate();
		},
		sync(value) {
			this.$emit('update:dataSource', value);
		},
	},
};
</script>

<style lang="scss">
.v-product-goods-sku-table {
	position: relative;
	.vc-table td:first-child {
		padding-left: 0px;
	}
	.vc-table th {
		padding-left: 0px !important;
	}
	.__img-btn {
		border: 1px solid #d9d9d9;
		width: 112px;
		height: 28px;
		line-height: 28px;
		text-align: center;
		border-radius: 4px;
	}
	.vcp-imgs-picker {
		height: 70px
	}
	._img-picker {
		display: inline-block;
	}
	._validate-cloumn {
		.vc-table__cell {
			overflow: unset;
		}
	}
	.vc-upload-picker__upload {
		margin-right: 0px;
		margin-bottom: 0px;
	}
	.vc-upload-picker__item {
		margin-right: 0px;
		margin-bottom: 0px;
	}
}
</style>
