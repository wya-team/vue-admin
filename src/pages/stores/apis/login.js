const api = {
	_LOGIN_MAIN_IMG_GET: '/account/login/captcha.json', // 获取验证码图片
	_LOGIN_MAIN_SILDER_GET: '/account/login/validate-captcha.json', // 验证码验证
	_LOGIN_MAIN_BACKGROUND_URL_GET: '/help/pic/get.json', // 背景图
	_LOGIN_MAIN_POST: '/human/login/login.json', // 密码登录
	_LOGIN_MAIN_CODE_POST: '/account/login/auth-login.json', // 授权登录
	LOGIN_MAIN_OUT_POST: '/account/login/logout.json', // 退出登录

};
export default api;
