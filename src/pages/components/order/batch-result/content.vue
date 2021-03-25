<template>
	<div class="v-batch-result g-pd-b-24">
		<div class="__result-box">
			<div>
				<vc-icon 
					:class="status === 0 ? 'g-c-error-red' : 'g-icon-success'" 
					:type="status === 0 ? 'error' : 'success'"
					class="__big-icon " 
				/>
			</div>
			<p 
				class="g-fs-18 g-c-333 g-m-t-24" 
				style="font-weight: bold"
			>
				{{ status ? '导入数据成功':'导入失败' }}
			</p>
			<div v-if="status === 0">
				<p class="g-fs-12 g-c-999 g-m-t-8">请核对并修改一下信息后，再重新提交。</p>
				<div class="__reason">
					<p class="__title g-c-333">失败原因</p>
					<div v-for="(item, i) in msg" :key="i" class="g-m-t-15 g-flex-ac">
						<vc-icon class="g-c-error-red g-fs-16" type="error" />
						<span class="g-m-l-8 g-c-51">{{ item }}</span>
					</div>
				</div>
			</div>
			<div class="g-m-t-32">
				<vc-button type="primary" class="g-m-r-8" @click="handleCancel">返回列表</vc-button>
			</div>
		</div>
	</div>
</template>

<script>
import { Storage } from "@utils/utils";

export default {
	name: 'tpl-batch-result',
	components: {
	},
	data() {
		return {
			msg: '',
			status: 0,
		};
	},
	created() {
		
	},
	mounted() {
		let msgData = Storage.get('send', { session: 'sessionStorage' }).msg;
		this.msg = msgData ? msgData.split(';') : [];
		if (!this.msg[this.msg.length - 1]) {
			this.msg.splice(-1, 1);
		} 
		this.status = Storage.get('send', { session: 'sessionStorage' }).status;
	},
	methods: {
		handleClose() {
			window.close();
		},
		handleCancel() {
			Storage.remove('send', { session: 'sessionStorage' });
			this.$router.push('/order/batch');
		}
	},
};
</script>

<style lang="scss">
.v-batch-result {
	padding-top: 99px; 
	.__result-box {
		text-align: center;
		.__big-icon {
			font-size: 70px;
		}
		.__reason {
			width: 680px;
			max-height: 400px;
			margin:  49px auto 0 auto;
			padding: 16px 24px;
			text-align: left;
			background-color: $cf9;
			overflow-y: auto;
		}
	}
}
</style>
