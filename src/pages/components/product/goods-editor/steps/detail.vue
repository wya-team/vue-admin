<template>
	<div class="v-product-goods-editor-detail">
		<vca-section-title content="商品详情" />
		<div class="g-flex" style="width: 100%">
			<div class="g-b _detail" style="width: 375px; height: 667px">
				<div class="g-relative" style="width:375px">
					<img src="@assets/image/goods_bar.png">
					<p class="g-absolute _header g-fs-18 g-c-black">商品详情</p>
				</div>
				<div class="__content">
					<img src="@assets/image/goods_detail.png" style="width: 100%" class="__img">
					<vc-editor-view :content="content" />
				</div>
			
			</div>
			<div class="g-m-t-24">
				<vc-editor
					ref="editor"
					v-model="content"
					:options="options"
					:video-upload-opts="videoUploadOpts"
					:video-poster="videoPosterFormatter"
					:preview="false"
					style="width: 536px; height: 580px"
					@change="handleChange"
				/>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'tpl-product-goods-editor-detail',
	props: {
		value: String,
	},
	data() {
		return {
			content: this.value,
			options: {
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike'],
						['blockquote', 'code-block'],
						[{ 'header': 1 }, { 'header': 2 }],
						[{ 'list': 'ordered' }, { 'list': 'bullet' }],
						[{ 'script': 'sub' }, { 'script': 'super' }],
						[{ 'indent': '-1' }, { 'indent': '+1' }],
						[{ 'direction': 'rtl' }],
						[{ 'size': ['12px', '14px', '16px', '18px', '20px', '22px', '24px', '50px'] }],
						[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
						[{ 'color': [] }, { 'background': [] }],
						[{ 'font': [] }],
						[{ 'align': [] }]
					]
				}
			},
			videoUploadOpts: {
				max: 1,
				size: 100,
				multiple: true, // upload的max会判断是不是开启multiple，后面可以改editor内部剩余的max为0时，禁用upload
			}
		};
	},
	watch: {
		content(v) {
			this.$emit('input', v);
		},
		value(v) {
			this.content = v; 
		}
	},
	created() {
		this.options.modules.toolbar.push(['link', 'vc-image', 'vc-video', 'vc-undo', 'vc-redo']);
	},
	methods: {
		handleChange(arg) {
			this.content = arg.html;
		},
		videoPosterFormatter(url) {
			return `${url}?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast`;
		}
	}
};
</script>
<style lang="scss">
.v-product-goods-editor-detail {
	._detail {
		width: 375px;
		margin: 24px 80px 24px 56px;
		img {
			max-width: 100%;
		}
	}
	._header {
		top: 25px;
		text-align: center;
		left: 0;
		right: 0;
	}
	.__content {
		overflow: auto;
		height: 600px;
		.__img {
			width: 100%
		}
	}
	.ql-container.ql-snow {
		overflow: visible; 
	}
}
</style>
