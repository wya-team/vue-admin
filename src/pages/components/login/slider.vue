<template>
	<vc-popover
		ref="popover" 
		:arrow="false"
		:visible="visible"
		:portal="false"
		:disabled="disabled"
		trigger="click"
		placement="top"
		portal-class-name="c-slider"
		@visible-change="handleVisibleChange"
	>
		<slot />
		<template #content>
			<div class="slider-container">
				<div class="_box">
					<vcm-icon 
						type="close" 
						class="_box-close" 
						@click="handleClose"
					/>
					<div class="_box-header">
						<span v-show="!isFail" class="g-fs-14 g-c-000">拖动下方滑块完成拼图</span>
						<span v-show="isFail" class="g-c-error g-fs-14">请控制拼图块对齐缺口</span>
						<span class="g-c-67 g-fr g-pointer" @click="handleRefresh">刷新</span>
					</div>
					<div class="_box-img">
						<vm-draggable
							:x.sync="x"
							:handles="[]"
							@drag-end="handleEndDrag"
							@dragging="handleDragging"
						> 	
							<img 
								ref="imgSilde" 
								:src="getImgSrc"
								class="slider"
								alt="滑块"
							>
						</vm-draggable>
						<img 
							:src="getImgSrc" 
							class="incomplete"
							alt="扣图"
						>
						<div v-show="isSuccess" class="_success g-tc">
							<div class="icon g-m-b-5">
								<vcm-icon type="p-success" />
							</div>
							<p>只用了{{ drag.time }}s，这速度简直完美</p>
						</div>
					</div>
					<div class="_box-slider-container">
						<vm-draggable 
							:x.sync="x"
							:y="-7"
							:handles="[]"
							:w="45"
							:h="24"
							:parent="false"
							class="_box-slider g-flex-cc"
							@drag-end="handleEndDrag"
							@dragging="handleDragging"
						>
							<span class="line" />
							<span class="line g-m-lr-5" />
							<span class="line" />
						</vm-draggable>
					</div>
				</div>
			</div>
		</template>
	</vc-popover>
</template>

<script>
import { Draggable } from '@wya/vm';
import { Popover } from '@wya/vc';

export default {
	name: "xls-slider",
	components: {
		'vm-draggable': Draggable,
		'vc-popover': Popover
	},
	props: {
		imgUrl: { // 校验图片地址
			type: String,
			default: '',
			required: true
		},
		verifyApi: { // 发送校验数据api常量
			type: String,
			default: '',
			required: true
		},
		disabled: { // 禁用
			type: Boolean
		},
		getPopupContainer: {
			type: Function
		}
	},
	data() {
		return {
			x: 0, // 拖拽偏移量
			visible: false,
			isFail: false, // 是否校验失败,控制上方提示文字切换
			isSuccess: false, // 控制成功后蒙层背景
			timeoutTimer: null, // 定时重置滑块定时器对象
			successTimer: null, // 校验成功定时器对象
			random: '', // 图片地址后续随机数，用于刷新图片
			drag: {
				startTime: 0,
				time: 0, // 滑块耗时
				count: 0, // 失败次数
				flag: false, // 是否拖动中，用于判断拖动时长，由于点击开始事件失效
			}
		};
	},
	computed: {
		getImgSrc() {
			return this.imgUrl + '?' + this.random;
		}
	},
	destroyed() {
		clearTimeout(this.timeoutTimer);
		clearTimeout(this.successTimer);
	},
	methods: {
		handleDragging() {
			if (!this.drag.flag) {
				this.drag.flag = true;
				this.drag.startTime = new Date().getTime(); // 开始计时
			}
			
			// 拖动区域限制
			if (this.x <= 0) {
				this.x = 0;
			} else if (this.x >= 263) {
				this.x = 263;
			}
		},
		handleEndDrag() {
			let endTime = new Date().getTime();
			this.drag.time = ((endTime - this.drag.startTime) / 1000).toFixed(1); // 耗时保留一位小数
			this.drag.count++; // 计数count++
			this.verifyData(this.x);
		},
		handleVisibleChange(visible) {
			if (visible) {
				Object.assign(this.$data, this.$options.data());
				this.random = Math.random(); // 每次显示都切换背景图
			}
			this.visible = visible;
		},
		// 刷新
		handleRefresh() {
			this.showFullImg = true;
			this.drag.count = 0;
			this.random = Math.random(); // 通过随机数刷新图片
		},
		// 重置滑块的位置
		resetSlider() {
			this.x = 0;
	
			// 失败三次，刷新图片，放在这里为了体验更好一点，不会立即刷新掉图片
			if (this.drag.count >= 3) {
				this.handleRefresh();
			}
		},
		// 校验滑块位置
		verifyData(offsetX) {
			this.$request({
				url: this.verifyApi,
				type: 'GET',
				param: {
					tn_r: offsetX
				},
				errorTip: false,
				successTip: false
			}).then((res) => {
				this.status = 'success';
				this.isFail = false;
				this.isSuccess = true;
				this.successTimer && clearTimeout(this.successTimer);
				this.successTimer = setTimeout(() => {
					this.handleClose();
					this.$emit('success'); // 校验成功
				}, 1000);
			}).catch((err) => {
				// 校验失败，恢复初始状态
				this.isFail = true;
				this.timeoutTimer && clearTimeout(this.timeoutTimer);
				this.timeoutTimer = setTimeout(this.resetSlider, 1000);
			}).finally(() => {
				this.drag.flag = false;
			});
		},
		handleClose(e) {
			this.visible = false;
		},
	},
};

</script>

<style lang="scss">
.c-slider{
	.vc-popover-core__container {
		padding: 0;
	}
	.slider-container {
		width: 360px;
		height: 270px;
		padding: 27px 32px 18px;
		background:$white;
		box-shadow: 0px 0px 7px 1px rgba(0, 0, 0, 0.18);
		z-index: 999;
		._box {
			position: relative;
			&-close {
				position: absolute;
				right: -15px;
				top: -17px;
				&:hover {
					cursor: pointer;
				}
			}
			&-header {
				line-height: 21px;
			}
			&-img {
				width: 296px;
				height: 172px;
				margin-bottom: 16px;
				overflow: hidden;
				position: relative;
				.full {
					position: absolute;
					top: -344px;
				}
				.slider {
					position: absolute;
					top: -172px;
					z-index: 9;
					transform: translate3d(0, 0, 0);
				}
				.incomplete {
					position: absolute;
					top: 0;
				}
				._success {
					position: absolute;
					width: 100%;
					height: 100%;
					z-index: 10;
					background: $white;
					opacity: .9;
					.icon {
						font-size: 20px;
						color: $light-green;
						margin-top: 64px;
					}
					p {
						font-size: 14px;
						color: $light-green;
					}
				}
			}
			&-slider-container {
				width: 297px;
				height: 12px;
				background: $cd9;
				border-radius: 6px;
				position: relative;
			}
			&-slider {
				position: absolute;
				top: -7px;
				left: 0px;
				width: 45px;
				height: 24px;
				background: $blue-tint;
				border-radius: 12px;
				&:hover {
					cursor: pointer;
				}
				div {
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.line {
					width: 2px;
					height: 11px;
					background: $white;
					border-radius: 1px;
				}
			}
			.fail {
				transition: all 1s;
			}
		}
	}
}
</style>

