[toc]
## PC端SKU的使用文档
### 业务组件介绍

#### 主文件
##### 包含的组件
+ **SpecItem**
+ **SkuTable**
+ **Popup**
  - CustomSpec
  - ManageSpec
##### 请求接口
mutation| 说明 | 参数
---|---|---
_PRODUCT_GOODS_EDITOR_SPEC_LIST_GET | 获取所有的规格项，给SpecItem组件使用 | -
#### 1. SpecItem
规格项组件。功能：选择规格项，删除规格项，选择要设置的规格值
##### 1.1 数据格式
```json
{
	spec_id: 1, // 规格ID
	spec_value_list: [{spec_value_id: 1, spec_value_name: '白色' }], // 当前规格的规格值数据
	spec_value_arr: [1] // 当前选中的规格值
}
```
##### 1.2 请求接口
mutation| 说明 | 参数
---|---|---
`_PRODUCT_GOODS_EDITOR_SPEC_VALUE_GET`| 根据规格id获取规格值数据 | `spec_id` 
`_PRODUCT_GOODS_EDITOR_SPEC_VALUE_DELETE_POST`| 删除规格值 | `spec_value_id` 
##### 1.3 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
dataSource | 选择规格的下拉框数据 | `Array` | - | []
info | 当前规格的信息 | `Object` | - | {}

##### 1.4 事件
事件名 | 说明 | 类型 | 参数
---|---|---|---
change | `info`值改变的回调 | `(info: Object) => void 0` | `info`规格项信息
#### 2. SkuTable
SKU的设置表格
##### 2.1 数据格式
```json
[
	{
		spec_value_arr: [1, 2], // 这个sku包含的规格值
		spec_name_arr: ['白色', 'XL'],
		sku_sn: '',
		sku_price: '',
		sku_weight: 120,
		sku_image: ''
	}
]
```
##### 2.2 请求接口
mutation| 说明 | 参数
---|---|---
_PRODUCT_GOODS_EDITOR_SKU_SN_EXIST_POST | 改产品的货号能否使用 | `product_id`、`checked_sn`
##### 2.3 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
dataSource | 表格数据 | `Array` | - | []
specDataSource | 要设置的规格项 | `Array` | - | []
productImage | 商品主图,规格图片有跟随主图的功能 | `String` | - | -

##### 2.4 方法
方法名 | 说明 | 参数
---|---|---
validate | 校验表格中的表单数据 | -
#### 3. Popup
###### 3.1 CustomSpec [新增自定义规格]
###### 3.1.1 请求接口
mutation| 说明 | 参数
---|---|---
`_PRODUCT_GOODS_EDITOR_SPEC_ADD_POST`| 添加规格项 | `spec_name`

##### 3.2 ManageSpec [规格管理]
###### 3.2.1 请求接口
mutation| 说明 | 参数
---|---|---
`_PRODUCT_GOODS_EDITOR_SPEC_DELETE_POST`| 删除规格项 | `spec_id`
`_PRODUCT_GOODS_EDITOR_SPEC_ADD_POST`|  添加规格项 | `spec_name`
`_PRODUCT_GOODS_EDITOR_SPEC_SORT_POST`|  规格排序 | `spec_sort_list`

###### 3.2.2 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
dataSource | 规格项的列表数据 | `Array` | - | []

##### 3.3 AddSpecValue [添加规格值]
###### 3.3.1 请求接口
mutation| 说明 | 参数
---|---|---
`_PRODUCT_GOODS_EDITOR_SPEC_VALUE_ADD_POST`| 新增规格值 | `spec_id`、`spec_value_name`
##### 3.3.2 包含的组件
+ **BatchAdd**

##### 3.3.3 属性
属性 | 说明 | 类型 | 可选值 | 默认值
---|---|---|---|---
specID | 规格项ID | `Number`、`String` | | 