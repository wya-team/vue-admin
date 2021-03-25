<template>
	<div class="v-login g-bg-white g-flex-holy">
		<div class="_header">
			<div class="_header-logo g-fs-30 g-c-000">
				<img src="../../../assets/image/logo.png" alt="">
			</div>
		</div>
		<div class="_content">
			<div class="_background">
				<vc-carousel 
					:height="600" 
					:draggable="advertisement_image.length > 1" 
					:dots="advertisement_image.length > 1" 
					:arrow="advertisement_image.length > 1"
				>
					<vc-carousel-item 
						v-for="(item, index) in advertisement_image" 
						:key="index" 
						:autoplay="autoplay"
						loop
					>
						<div 
							:style="`background: url('${item.pic}') no-repeat; height: 100%;`" 
							:class="{ 'g-pointer': item.link }" 
							@mousedown="handleMouseDown($event)"
							@mouseup="handleMouseUp($event)"
							@click="handleLink(item)"
						/>
					</vc-carousel-item>
				</vc-carousel>
			</div>
			<div class="_content-layout g-flex g-relative">
				<div class="_content-box">
					<div 
						:class="[ status.isCodeLogin ? 'computer' : 'code' ]" 
						class="_login-switch"
						@click="handleSwitchLogin"
					/>
					<div class="_content-tip">
						<div class="_poptip">
							<div class="_poptip-arrow">
								<em />
								<span />
							</div>
							<div class="_poptip-content">
								<span v-if="status.isCodeLogin">密码登录</span> 
								<span v-else>扫码登录</span>
							</div>
						</div>	
					</div>
					<div class="_container_box g-relative">
						<div class="g-fs-16 g-lh-16 g-c-white" style="margin-bottom: 40px;">商家登录</div>
						<!--扫码登录-->
						<div v-show="status.isCodeLogin && !status.loginFail">
							<div class="g-tc">
								<div class="_content-box-code">
									<div 
										id="code-container" 
										:class="{ 'opcaticy': status.codeLose }"
										class="_content-box-code-img"
									/>
									<div v-if="status.codeLose" class="_content-warn">
										<vcm-icon 
											type="again" 
											class="g-fs-22 g-c-white g-pointer" 
											@click="handleRefreshCode"
										/> 
										<p class="g-c-white g-m-t-10">二维码已失效，请刷新</p>
									</div>
								</div>
							</div>
							<div class="g-m-t-10 g-c-fe g-tc">
								请使用微信扫码登录
							</div>
						</div>

						<!--账号密码登录-->
						<div v-show="!status.isCodeLogin && !status.loginFail">
							<vc-form 
								ref="form" 
								:model="formValidate" 
								:rules="ruleValidate" 
								class="_form g-m-t-20"
							>
								<vc-form-item prop="account" class="g-relative">
									<div :class="[ focus.account ? '_focus' : '_un-focus' ]" class="_base g-c-white g-absolute">账号</div>
									<vc-input 
										v-model="formValidate.account" 
										:maxlength="20" 
										placeholder="" 
										@focus="handleChangeFocus('account')"
										@blur="handleChangeBlur('account')"
									/>
								</vc-form-item>
								<vc-form-item prop="pwd" class="g-relative">
									<div :class="[ focus.pwd ? '_focus' : '_un-focus' ]" class="_base g-c-white g-absolute">密码</div>
									<vc-input 
										ref="pwdInput"
										v-model="formValidate.pwd" 
										:maxlength="18" 
										:type="getPwdInputType"
										placeholder="" 
										@focus="handleChangeFocus('pwd')"
										@blur="handleChangeBlur('pwd')"
										@enter="handleTriggerSilder"
									/>
									<vcm-icon 
										:type="getPwdInpueIcon"  
										class="_invisible-icon g-absolute g-pointer g-c-bd"
										@click="handleSwitchPwd"
									/>
								</vc-form-item>
								<tpl-slider 
									:img-url="API['_LOGIN_MAIN_IMG_GET']" 
									:verify-api="verifyApi"
									:disabled="status.disabledBtn"
									@success="handleLogin"
								>
									<template #default>
										<vc-button 
											ref="loginBtn"
											type="primary"
											long 
											@click.prevent="handleLogin"
										>
											登录
										</vc-button> 
									</template>		
								</tpl-slider>
								<vc-checkbox v-model="status.rememberPwd" class="g-m-t-20">
									<span class="g-c-white">记住密码</span>
								</vc-checkbox>
							</vc-form>
						</div>
							
						<!--登录失败-->
						<div v-if="status.loginFail" class="_warn">
							<div class="_warn-icon g-flex-cc">
								<vcm-icon type="p-warning" class="g-c-main g-fs-60" />
							</div>
							<div class="g-tc g-m-t-25 g-fs-18 g-c-000">
								<p v-html="status.loginFailMsg" />	
							</div>
						</div>
					</div>
				</div>
			</div>	
		</div>
		<div class="g-pd-t-10 g-c-333 g-tc">
			<p>
				为了获得最好的体验效果，建议使用最新版的谷歌浏览器进行登陆，如果不是最新版，请
				<a 
					class="g-c-main g-pointer" 
					href="https://redirector.gvt1.com/edgedl/release2/chrome/IqS0j-Mgh5ShRl3NTwatsw_80.0.3987.149/80.0.3987.149_chrome_installer.exe"
				>
					点击下载
				</a>
			</p>		
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { Message } from '@wya/vc';
import { Storage, RegEx } from '@utils/utils';
import { commonServices } from '@stores/services/_common';
import { PRE_ROUTER_URL, ACCOUNT_KEY } from '@constants/constants';
import { Global } from '@routers/_global';
import API from '@stores/apis/root';
import md5 from 'js-md5';
import Slider from './slider';

export default {
	name: 'v-login-content',
	components: {
		'tpl-slider': Slider
	},
	mixins: [commonServices.appid({ autoLoad: false })],
	data() {
		const validateAccount = (rule, value, callback) => {
			// 账号：20字以内，存在数字、字母、中文、下划线、减号
			const reg = /^[a-zA-Z0-9_\-\u4e00-\u9fa5]{1,20}$/;
			
			if (value === "") {
				callback(new Error("请输入账号"));
			} else if (!reg.test(value)) {
				callback("请输入英文、数字、下划线、减号");
			} else {
				callback();
			}
		};
		const validatePwd = (rule, value, callback) => {
			// 6-18位，存在数字、字母、及特殊字符（除开 \ ' " ），不包含中文
			const reg = /^[^\u4e00-\u9fa5\\'"]{6,18}$/;
			if (value === "") {
				callback(new Error("请输入密码"));
			} else if (!reg.test(value)) {
				callback(`请输入6到18位数字、字母、及特殊字符（除开 \\ ' "） `);
			} else {
				callback();
			}
		};
		return {
			API,
			verifyApi: '_LOGIN_MAIN_SILDER_GET', // 滑块校验地址
			timer: null, // 二维码计时对象
			status: {
				loginFail: false, // 是否登录失败
				loginFailMsg: '', // 登录失败提示信息
				isCodeLogin: true, // 当前是否二维码登录
				codeLose: false, // 二维码是否失效
				rememberPwd: false, // 记住密码
				showPwd: false, // 显示密码
				disabledBtn: true, // 禁用校验码，必须等待表单验证成功 
			},
			focus: {
				account: false,
				pwd: false
			},
			formValidate: {
				account: '',
				pwd: '',
			},
			ruleValidate: {
				account: [{ validator: validateAccount }],
				pwd: [{ validator: validatePwd }],
			},
			advertisement_image: [], // 背景图数组
			autoplay: false, // 自动轮播
			offset: { // 鼠标的偏移量，防止用户滑动轮播时触发点击事件
				x: 0,
				y: 0,
				isDraging: false
			}
		};
	},
	computed: {
		...mapState(['loginMain']),
		getPwdInputType() {
			return this.status.showPwd ? 'text' : 'password';
		},
		getPwdInpueIcon() {
			return this.status.showPwd ? 'visible' : 'invisible';
		}
	},
	created() {
		this.queryBind(); // 是否绑定微信回调
		this.queryAccountPwd(); // 记住账号密码
		this.getAdvertisement();
	},
	async mounted() {
		await this.loadAppid();
		this.$nextTick(() => {
			this.initCode(); // 初始化二维码
		});
	},
	methods: {
		handleTriggerSilder() { // 在密码框按enter校验后调用silder
			this.$refs.pwdInput.blur();
			this.handleValidate().then(() => {
				this.$refs.loginBtn.$el.click();
			});
		},
		getAdvertisement() {
			this.$request({
				url: "_LOGIN_MAIN_BACKGROUND_URL_GET",
				type: "GET",
				param: {
					type: 2, // 1系统选择页宣传图，2登录图
				},
			}).then(res => {
				this.advertisement_image = res.data.advertisement_image;
				this.autoplay = res.data.show_type === 2; //  显示类型，1固定，2轮播
			}).catch(err => {

			});
		},
		handleMouseDown(e) {
			this.offset = {
				x: e.clientX,
				y: e.clientY,
				isDraging: false
			};
		},
		handleMouseUp(e) {
			const offsetMax = 5; // 若是点击时偏移量超出5px，则阻止触发打开链接的操作
			this.offset.x = e.clientX - this.offset.x;
			this.offset.y = e.clientY - this.offset.y;
			if (Math.abs(this.offset.x) >= offsetMax || Math.abs(this.offset.y) >= offsetMax) {
				this.offset.isDraging = true;
			} else {
				this.offset.isDraging = false;
			}
		},
		handleLink(item) {
			if (item.link && !this.offset.isDraging) {
				window.open(item.link);
			}
		},
		// 校验用户输入完成才能显示校验
		handleValidate(cb) {
			return this.$refs.form.validate().then(() => {
				this.status.disabledBtn = false;
			}).catch(() => {
				this.status.disabledBtn = true;
			});
		},
		handleChangeFocus(name) {
			this.focus[name] = true;
		},
		handleChangeBlur(name) {
			if (this.formValidate[name]) {
				this.focus[name] = true;
			} else {
				this.focus[name] = false;
			}
		},
		// 查询是否微信回调登录
		queryBind() {
			let { code } = this.$route.query;

			if (!code) return;

			this.$request({
				url: "_LOGIN_MAIN_CODE_POST",
				type: "POST",
				param: {
					code
				},
				errorTip: false
			}).then(res => {
				Global.createLoginAuth(res.data);
			}).catch(err => {
				this.status.loginFail = true;
				this.status.loginFailMsg = err.msg;
				this.$router.push('/login');
			});
		},
		// 查询是否之前记住了密码
		queryAccountPwd() {
			const userInfo = Storage.get(ACCOUNT_KEY);
			
			if (userInfo) {
				this.formValidate = {
					...userInfo
				};
				this.status.rememberPwd = true;
				this.focus.account = true;
				this.focus.pwd = true;
			}
		},
		// 初始化二维码
		initCode() {
			let uri = window.location.protocol + '//' + window.location.host + PRE_ROUTER_URL + 'login';
			let redirect_uri = encodeURI(uri);
			// eslint-disable-next-line no-undef
			let obj = new WxLogin({
				id: "code-container", 
				appid: this.appid.app_id,
				scope: "snsapi_login", 
				redirect_uri,
				href: `data:text/css;base64,QGNoYXJzZXQgIlVURi04IjsKaWZyYW1lIHt3aWR0aDog
				MTcycHggIWltcG9ydGFudDsgaGVpZ2h0OiAxNzJweCAhaW1wb3J0YW50O30KYm9keSB7bWFyZ
				2luOiAwICFpbXBvcnRhbnQ7fQouaW1wb3dlckJveCAucXJjb2RlIHt3aWR0aDogMTcwcHg7IGh
				laWdodDogMTcwcHg7IG1hcmdpbjogMDt9Ci5pbXBvd2VyQm94IC50aXRsZSB7ZGlzcGxheTogbm
				9uZTt9Ci5pbXBvd2VyQm94IC5pbmZvIHtkaXNwbGF5OiBub25lO30=` // 格式化二维码css
			});
			this.setCodeTimeout();
		},
		// 二维码失效
		setCodeTimeout() {
			const TIME = 5 * 60; // 5min后二维码失效

			this.timer && clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.status.codeLose = true;
			}, TIME * 1000);
			this.$once('hook:beforeDestory', () => {
				this.timer && clearTimeout(this.timer);
			});
		},
		// 刷新二维码
		handleRefreshCode() {
			this.status.codeLose = false;
			this.initCode();
		},
		handleSwitchLogin() {
			this.status.isCodeLogin = !this.status.isCodeLogin;
			this.status.loginFail = false;
			this.handleRefreshCode();
		},
		handleSwitchPwd() {
			this.status.showPwd = !this.status.showPwd;
		},
		handleLogin() {
			this.$refs.form.validate().then(() => {
				// 记住密码
				if (this.status.rememberPwd) {
					Storage.set(ACCOUNT_KEY, this.formValidate);
				} else {
					Storage.remove(ACCOUNT_KEY);
				}

				const pwd = md5(this.formValidate.pwd);
				this.$request({
					url: '_LOGIN_MAIN_POST',
					type: 'POST',
					param: {
						...this.formValidate,
						pwd
					},
					localData: {
						status: 1,
						data: {
							...this.formValidate
						}
					}
				}).then((res) => {
					Message.success(`登录成功 - userName: ${this.loginMain.user}`);
					Global.createLoginAuth(res.data);
				}).catch((res) => {
				});
			}).catch(err => {
				console.log('err :>> ', err);
			});
		}
	},
};
</script>

<style lang="scss">
.v-login {
	._background {
		position: absolute;
		width: 100%;
		height: 600px;
	}
	width: 100%;
	._header {
		._header-logo {
			min-width: 1000px;
			max-width: 1200px;
			height: 88px;
			padding: 22px 0;
			margin: 0 auto;
			font-weight: bold;
			letter-spacing: 2px;
		}
	}
	._content {
		height:600px;
		padding-top: 8px;
		background-size: cover;
		background-position-x: 20%;
		._login-switch {
			position: absolute;
			cursor: pointer;
			&.code {
				width: 50px;
				height: 50px;
				top: 10px;
				right: 10px;
				background: url('~assets/image/login_code.png') no-repeat;
			}
			&.computer {
				width: 28px;
				height: 27px;
				top: 17px;
				right: 18px;
				background: url('~assets/image/login_computer.png') no-repeat;
			}
		}
		&-tip {
			position: absolute;
			top: 20px;
			right: 58px;
			._poptip {
				box-sizing: content-box;
				height: 16px;
				line-height: 16px;
				color: $main;
				background: $white;
				border: 1px solid $main;
				padding: 4px 8px;
				position: relative;
				&-arrow {
					position: absolute;
					top: 6px;
					right: 0px;
					em {
						position: absolute;
						top: 0;
						left: 1px;
						overflow: hidden;
						border-color: transparent;
						border-left-color: $main;
						border-width: 6px 0 6px 6px;
						border-style: solid;
					}
					span {
						position: absolute;
						top: 0;
						left: -1px;
						overflow: hidden;
						border-color: transparent;
						border-left-color: #e7f0fe;
						border-width: 6px 0 6px 6px;
						border-style: solid;
					}
				}
			}
		}
		&-layout {
			min-width: 1000px;
			max-width: 1080px;
			margin: 0 auto;
			overflow: hidden;
			position: relative;
			height: 600px;
		}
		&-box {
			position: absolute;
			top: 45%;
			transform: translateY(-50%);
			right: 0px;
			width: 350px;
			height: 360px;
			background:rgba(0,0,0,.6);
			box-shadow:0px 0px 9px 1px rgba(29,64,193,0.26);
			z-index: 999;
			._container_box {
				margin: 36px 24px;
			}
			&-code {
				width:174px;
				height:174px;
				margin: 48px auto 0;
				position: relative;
				.opcaticy {
					opacity: .1;
				}
				._content-warn {
					position: absolute;
					top: 65px;
					left: 24px;
				}
				&-img {
					width: 100%;
					height: 100%;
				}
				#code-container {
					iframe {
						width: 172px !important;
						height: 172px !important;
					}
				}
			}
			._warn {
				margin-top: 76px;
			}
		}
		._form {
			._base {
				transition: all .45s cubic-bezier(.23,1,.32,1);
				transform-origin: left top;
				z-index: 9;
			}
			._un-focus {
				font-size: 14px;
			}
			._focus {
				line-height: 12px;
				transform: translate3d(0, -12px, 0) scale(1);
			}
			._invisible-icon {
				right: 0;
				font-size: 20px;
				margin: 6px 12px 0 0;
				z-index: 99;
				&:hover {
					color: $main !important;
				}
			}
			.vc-form-item {
				border-bottom: 1px solid $cd9;
				margin-bottom: 40px;
			}
			.vc-form-item__content {
				display: flex;
				width: 100%;
			}
			.vc-input {
				box-shadow: none;
				input, .vc-input__content {
					color: $cfe !important;
					background-color: transparent;
					-webkit-text-fill-color: $white;
					caret-color: $white;
				}
				input {
					background: transparent content-box;
					height: 0;
					padding: 15px 0;
				}
				&::after {
					border: none;
				}
				&:focus {
					border: none;
					box-shadow: none;
				}
				.vc-input__input, input {
					color: $black;
					letter-spacing: 1px;
					font-size: 14px;
					position: static;
					padding-left: 0;
				}
			}
			.vc-form-item.is-require .vc-form-item__label:before {
				content: '';
			}
			.vc-btn {
				height: 45px;
				font-size: 18px;
			}
		}
	}
}
</style>
