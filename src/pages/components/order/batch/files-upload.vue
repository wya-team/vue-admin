<template>
	<div class="v-file-upload">
		<vc-upload
			ref="upload"
			:max="1"
			:url="uploadUrl"
			:extra="{
				verify: 95,
				loading: true,
			}"
			accept=".xlsx"
			@file-before="handleFileBefore"
			@file-progress="handleFileProgress"
			@file-success="handleFileSuccess"
			@file-error="handleFileError"
		>
			<div class="__upload-button g-flex-cc g-pointer">
				<vc-icon type="upload" />
				<span class="g-m-l-5">上传文件</span>
			</div>
		</vc-upload>
		<div 
			v-if="fileData.name"
			:class="fileData.percent == 100 || isSuccess ? '' : '__error'"
			class="__item"
		>
			<vc-icon type="link" class="__download" />
			<div :title="fileData.name" class="__title">{{ fileData.name }}</div>
			<template v-if="fileProgress.percent >= 0">
				<div style="flex: 1; display: flex; align-items: center">
					<div class="__pcontainer">
						<div :style="{width: fileProgress.percent + '%'}" class="__progress" />
					</div>
				</div>
			</template>
			<span 
				v-if="fileProgress.percent == 100"
				class="__close" 
			>
				<vc-icon type="cancel" />
			</span>
		</div>
		<vc-button 
			v-if="fileData.name" 
			:disabled="disable" 
			type="primary" 
			class="g-m-t-15"
			@click="handleContinueBefore"
		>确认发货</vc-button>
	</div>
</template>

<script>
import { ajax } from '@wya/http';
import { Storage } from "@utils/utils";

export default {
	name: 'files-upload',
	components: {

	},
	props: {

	},
	data() {
		return {
			uploadUrl: '',
			fileData: {}, 
			fileProgress: {},
			isSuccess: true,
			disable: false,
			msgInstance: null
		};
	},
	computed: {

	},
	watch: {
		
	},
	created() {
		this.uploadUrl = ''; // TODO: tpl
	},
	methods: {
		handleFileBefore(file = {}) {
			return new Promise((reslove, reject) => {
				this.fileData = file;
				this.handleContinue = reslove;
			});
			
		},
		handleContinue() {},
		handleContinueBefore() {
			this.handleContinue();
			this.disable = true;
			this.msgInstance = this.$Message.loading('数据处理中，请您耐心等待');
		},
		handleFileProgress(file) {
			this.fileProgress = file;
		},
		handleFileSuccess(res, file) {
			this.isSuccess = true;
			this.disable = false;
			this.msgInstance && this.$Message.destroy(this.msgInstance);
			Storage.set('send', res, { session: 'sessionStorage' });
			this.$router.push('/order/batch/result');
		},
		handleFileError(error) {
			this.isSuccess = false;
			this.disable = false;
			this.msgInstance && this.$Message.destroy(this.msgInstance);
			Storage.set('send', error, { session: 'sessionStorage' });
			this.$router.push('/order/batch/result');
		}
	},
};
</script>

<style lang="scss">
.v-file-upload {
	.__error {
		.__title {
			color: $error-red !important;
		}
		.__progress {
			background-color: $error-red !important;
		}
	}
	.__item {
		position: relative;
		align-items: center;
		box-sizing: border-box;
		margin-top: 16px;
		padding-left: 20px;
		.__title {
			font-size: 12px;
			color: $c67;
			padding-right: 20px;
		}
		.__download {
			position: absolute;
			left: 0px;
			top: 4px;
		}
		span:first-child {
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			min-width: 100px;
			max-width: 100px;
		}
		.__close {
			position: absolute;
			top: 4px;
			right: 0px;
			cursor: pointer;
			font-size: 12px;
		}
		.__pcontainer {
			flex: 1;
			background-color: $ce8;
			height: 4px;
			border-radius: 2px;
			overflow: hidden;
			margin-top: 6px;
			.__progress {
				display: block;
				margin: 0;
				background-color: $main;
				height: 4px;
				border-radius: 2px;
			}
		}
	}
}
</style>
