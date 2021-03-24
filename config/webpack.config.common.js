console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
const APP_ROOT = process.cwd();
const ENV_IS_DEV = process.env.NODE_ENV === 'development';

const TIMESTAMP = new Date().getTime();
// 运维会动态操作以下地址，请勿随意操作
const DIR_PATH = ENV_IS_DEV ? '' : `static.${TIMESTAMP}/`;
const DIR_URL_PATH = ENV_IS_DEV ? '' : `static.${TIMESTAMP}/`;

const path = require('path');
const fs = require('fs-extra');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const userConfig = fs.existsSync(path.resolve(__dirname, './user.config.js'))
	? require('./user.config.js')
	: {};

const localPort = (() => {
	if (ENV_IS_DEV) {
		return userConfig.port || 8088;
	}
	return 9098;
})();
const localIp = (() => {
	const ips = [];
	const os = require('os');
	const ntwk = os.networkInterfaces();
	for (const k in ntwk) {
		for (let i = 0; i < ntwk[k].length; i++) {
			const _add = ntwk[k][i].address;
			if (_add && _add.split('.').length == 4 && !ntwk[k][i].internal && ntwk[k][i].family == 'IPv4') {
				ips.push(ntwk[k][i].address);
			}
		}
	}
	const ip = ips.find(i => i.startsWith('192.168'));
	return ip || ips[0] || 'localhost';
})();
const postcssLoader = {
	loader: 'postcss-loader',
	options: {
		config: {
			path: path.resolve(APP_ROOT, 'config/postcss.config.js')
		}
	}
};
const loaderPath = [
	path.resolve(APP_ROOT, "src")
];
const webpackConfig = {
	target: "web", // <=== 默认是 'web'，可省略
	resolve: { // 重定向路径
		mainFiles: ['index'],
		modules: [path.resolve(APP_ROOT, 'src'), 'node_modules'],
		extensions: ['.js', '.vue', '.json', '.scss', '.css'],
		// 依赖-正则
		alias: {
			/**
			 * 一个是 runtime only 的文件 vue.common.js，
			 * 一个是 compiler only 的文件 compiler.js，
			 * 一个是 runtime + compiler 的文件 vue.js。
			 * 也就是说，vue.js = vue.common.js + compiler.js
			 * 而如果要使用 template 这个属性的话就一定要用 compiler.js，那么，引入 vue.js 是最恰当的
			 */
			'vue$': 'vue/dist/vue.esm.js',
			'@assets': path.resolve(APP_ROOT, './src/assets'),
			'@components': path.resolve(APP_ROOT, './src/pages/components'),
			'@constants': path.resolve(APP_ROOT, './src/pages/constants'),
			'@extends': path.resolve(APP_ROOT, './src/pages/extends'),
			'@containers': path.resolve(APP_ROOT, './src/pages/containers'),
			'@routers': path.resolve(APP_ROOT, './src/pages/routers'),
			'@utils': path.resolve(APP_ROOT, './src/pages/utils'),
			'@stores': path.resolve(APP_ROOT, './src/pages/stores'),
			'@mutations': path.resolve(APP_ROOT, './src/pages/stores/mutations'),
			'@common': path.resolve(APP_ROOT, './src/pages/components/_common'),
			'node_modules/echarts': path.resolve(APP_ROOT, './node_modules/echarts'),
			'node_modules/quill': path.resolve(APP_ROOT, './node_modules/quill'),
			// 强制使用babel7
			'babel-runtime': '@babel/runtime',
			'babel-core': '@babel/core'

		}
	},
	entry: {
		main: path.resolve(APP_ROOT, 'src/pages/main.js')
	},
	output: {
		path: path.resolve(APP_ROOT, 'dist'),
		filename: `${DIR_PATH}js/[name].bundle.js`, // 每个页面对应的主js的生成配置
		chunkFilename: `${DIR_PATH}js/[name].chunk.js`, // chunk生成的配置
		sourceMapFilename: `${DIR_PATH}js/[name].bundle.map`,
		/**
		 * html引用路径
		 * publicPath: ENV_IS_DEV ? './' : 'https://cdn.example.com/'
		 */
		publicPath: ENV_IS_DEV ? '/' : '/chyy/'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				include: loaderPath,
				use: [
					{
						loader: 'babel-loader',
						// node_modules/.cache/babel-loader 编译缓存，独立于babel.config.js
						options: {
							cacheDirectory: true
						}
					}
				]
			},
			{
				test: /\.vue/,
				include: loaderPath,
				use: [
					{
						loader: 'vue-loader',
					},
					{
						loader: '@wya/vc-loader',
					}
				]
			},
			{
				test: /\.(css|scss)$/,
				use: [
					'vue-style-loader',
					'css-loader',
					postcssLoader,
					'sass-loader',
					{
						loader: 'sass-resources-loader',
						options: {
							resources: [
								path.resolve(APP_ROOT, "src/css/themes/index.scss")
							]
						}
					}
				],
				// 组件内的样式
				include: [
					path.resolve(APP_ROOT, "src/pages"),
					path.resolve(APP_ROOT, "node_modules")
				]
			},
			{
				test: /\.(css|scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					postcssLoader,
					'sass-loader'
				],
				// 全局的样式
				include: [
					path.resolve(APP_ROOT, "src/css")
				]
			},
			{
				test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: `${DIR_URL_PATH}assets/[name].[ext]`
				}
			}
		]
	},
	optimization: {
		// 默认关闭压缩
		minimize: ENV_IS_DEV ? false : JSON.parse(process.env.UGLIFY_JS || 'false'),
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: {
						safari10: true
					}
				},
			})
		],
		// 原：NamedModulesPlugin()
		namedModules: true,
		// 原：NoEmitOnErrorsPlugin() - 异常继续执行
		noEmitOnErrors: true,
		// 原：ModuleConcatenationPlugin() - 模块串联 - dev模式下回影响antd（比如：Pagination, 和语言有关）
		concatenateModules: !ENV_IS_DEV,
		// 原：CommonsChunkPlugin()
		splitChunks: {
			name: true,
			cacheGroups: {
				commons: {
					test: (chunk) => {
						const modules = [
							'@babel/polyfill',
							'vue',
							'vue-router',
							'vuex',
							'core-js',
							'lodash' // 这个用的地方偏多
						];
						// new RegExp(`([\\\\/]+)node_modules([\\\\/]+)`) -> /([\\\/]+)node_modules([\\\/]+)/
						const isInModules = modules.some(i => (new RegExp(`([\\\\/]+)node_modules([\\\\/_]+)${i}`)).test(chunk.resource));
						return chunk.resource
							&& /\.js$/.test(chunk.resource)
							&& isInModules;
					},
					name: 'common',
					chunks: 'all',
				}
			}
		},
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `${DIR_PATH}css/initial.[name].css`
		}),
		new VueLoaderPlugin()
	]
};
const defaultConfig = {
	// cheap-module-eval-source-map 原始源码（仅限行）
	// cheap-eval-source-map 转换过的代码（仅限行）// 重构建比较好
	devtool: ENV_IS_DEV ? 'cheap-module-eval-source-map' : undefined,
	resolve: {
		extensions: ['.jsx', '.js']
	},
	devServer: {
		host: localIp,
		contentBase: "/",
		port: localPort,
		inline: true,
		// compress: true, // gzip
		stats: 'errors-only',
		historyApiFallback: true,
		watchOptions: {
			aggregateTimeout: 100,
			poll: 500,
			ignored: /node_modules/
		},
		proxy: {
			// "/agent": {
			// 	target: "http://127.0.0.1:3003",
			// 	// pathRewrite: {"^/api" : ""}
			// }
		},
		hot: true, // 同--hot
	},
	node: {
		global: true,
		crypto: 'empty',
		__dirname: true,
		__filename: true,
		Buffer: true,
		clearImmediate: false,
		setImmediate: false
	},
	// 启用编译缓存
	cache: true,
};

module.exports = {
	APP_ROOT,
	DIR_PATH,
	localIp,
	localPort,
	commonConfig: merge(
		webpackConfig,
		defaultConfig
	)
};
