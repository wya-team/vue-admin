/** 多个数组的笛卡尔积 */
// descartes([1,2,3],[4,5,6],[7,8,9],[10,11,12]);
const descartes = (...array) => {
	if (array.length < 2) return array[0] || [];

	return [].reduce.call(array, (col, set) => {
		let res = [];
		col.forEach((c) => {
			set.forEach((s) => {
				let t = [].concat(Array.isArray(c) ? c : [c]);
				t.push(s);
				res.push(t);
			});
		});
		return res;
	});
};

// 生成规格组合数据
export const combineSpec = (data) => {
	let effectiveData = data.filter((it) => it.spec_id && it.spec_value_arr.length); // 一个二维数组
	let dataLength = effectiveData.length === 0 ? 0 : effectiveData.reduce((pre, cur) => {
		pre *= cur.spec_value_arr.length;
		return pre;
	}, 1);
	let [valueArr, nameArr] = effectiveData.reduce((pre, cur) => {
		pre[0].push(cur.spec_value_arr);
		pre[1].push(cur.spec_name_arr);
		return pre;
	}, [[], []]);
	let specValueDescartes = descartes(...valueArr);
	let specNameDescartes = descartes(...nameArr);

	return Array.from({ length: dataLength }).map((it, index) => {
		let specValue = specValueDescartes[index];
		let specName = specNameDescartes[index];
		specValue = Array.isArray(specValue) ? specValue : [specValue];
		specName = Array.isArray(specName) ? specName : [specName];
		return { 
			spec_value_arr: specValue, 
			spec_name_arr: specName,
			sku_sn: '',
			sku_price: '',
			sku_weight: '',
			sku_image: []
		};
	});
};