const utils = require('@/common/utils.js')
let loginCallback = null

export default {
	install(Vue, OPT) {
		Vue.gd = Vue.prototype.$gd = {
			initOptions: function(options) {
				uni.getSystemInfo({
					success: function(res) {
						Vue.store.commit('setSystem', res)
					}
				})
				Vue.store.commit('setPath', options.path)
				Vue.store.commit('setQuery', options.query)
				Vue.store.commit('setScene', options.scene)
			},
			uniRegist: function() {
				return new Promise((resolve, reject) => {
					uni.login({
						success: res => {
							let code = ''
							let type = ''
							// #ifdef MP-WEIXIN
							type = 'weixin'
							code = res.code
							// #endif

							// #ifdef MP-ALIPAY
							type = 'alipay'
							code = res.authCode
							// #endif
							resolve({
								code,
								type
							})
						},
						fail: (err) => {
							Vue.gd.reqOperation(err)
							reject(err)
						}
					})
				})
			},
			uniLogin: function(options) { //登录逻辑
				const vx = Vue.gd;
				const scene = options.scene
				return new Promise((resolve, reject) => {
					uni.login({
						success: res => {
							let code = ''
							let type = ''
							// #ifdef MP-WEIXIN
							type = 'weixin'
							code = res.code
							// #endif

							// #ifdef MP-ALIPAY
							type = 'alipay'
							code = res.authCode
							// #endif
							uni.request({
								url: OPT.api + '/v2api/' + 'account/login',
								method: 'post',
								header: {
									'content-type': 'application/json'
								},
								data: {
									code,
									scene,
									type
								},
								success: function(res) {
									if (res.data.success) {
										Vue.gd.loginSuccess(res.data.data)
										if (loginCallback) {
											Promise.resolve(loginCallback(res.data.data.third_session))
										}
										resolve(res.data.data.third_session);
									} else {
										// Vue.gd.reqOperation(res.data)
										resolve(res.data)
									}
								}
							})
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			uniAll: function(objs) { //Promise.all
				const vx = Vue.gd
				const token = Vue.store.state.accessToken || uni.getStorageSync(OPT.key) || ''
				// 如果还未登录，需要登录后再执行
				if (token) {
					return Promise.all(objs.map(item => {
						return vx.uniFetch(item)
					}))
				} else {
					return new Promise((resolve, reject) => {
						loginCallback = function(token) {
							Promise.all(objs.map(item => {
								return vx.uniFetch(item, token)
							})).then((res) => {
								resolve(res)
							}).catch(err => {
								reject(err)
							})
						}
					})
				}

			},
			uniFetch: function(obj, accesstoken) { //封装的请求接口
				const vx = Vue.gd
				const token = Vue.store.state.accessToken || accesstoken || uni.getStorageSync(OPT.key) || '';
				return new Promise((resolve, reject) => {
					let check = ''
					// #ifdef H5
					check = '1'
					// #endif
					uni.request({
						url: OPT.api + '/v2api/' + obj.url,
						method: obj.isGet ? 'get' : 'post',
						header: {
							'content-type': 'application/json',
							'check': check,
							'Authorization': obj.token ?
								obj.token : token ?
								token : ''
						},
						data: obj.data,
						success: function(result) {
							if (result.statusCode == 200) {
								if (result.data.success) {
									resolve(result.data)
								} else {
									vx.reqOperation(result)
									resolve(result.data)
								}
							} else {
								vx.reqOperation(result)
								reject(result)
							};
						},
						fail: function(err) {
							vx.reqOperation(err)
							reject(err)
						},
						complete: function() {
							vx.stopPullDown()
						}
					})
				})
			},
			uniRequest: function(obj) {
				const vx = Vue.gd
				const token = Vue.store.state.accessToken || ''
				// 如果还未登录，需要登录后再执行
				// #ifdef H5
				return new Promise((resolve, reject) => {
					vx.uniFetch(obj)
						.then((res) => {
							resolve(res)
						})
						.catch(err => {
							reject(err)
						})
				})
				// #endif

				if (token || obj.notAuth) {
					
					return new Promise((resolve, reject) => {
						
						vx.uniFetch(obj)
							.then((res) => {
								resolve(res)
							})
							.catch(err => {
								reject(err)
							})
					})
				} else {
					return new Promise((resolve, reject) => {
						loginCallback = function(token) {
							vx.uniFetch(obj, token)
								.then((res) => {
									resolve(res)
								}).catch(err => {
									reject(err)
								})
						}
					})
				}
			},
			reqOperation: function(data) {
				// #ifdef H5
				if (data.statusCode === 401) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				// #endif
				uni.showModal({
					content: data.message || (data.data && data.data.message) || '网络不给力，点击确定重试',
					showCancel: false,
					confirmText: '知道了',
					confirmColor: '#28D4A1'
				})
			},
			loginSuccess: function(data) {
				Vue.store.commit('setUserInfo', data)
				Vue.store.commit('setAccessToken', data.third_session)
				uni.setStorageSync(OPT.key, data.third_session)
			},
			uniModal: function({
				title = '',
				content,
				showCancel = false,
				confirmText = '知道了',
				confirm,
				cancel,
				complete
			}) {
				uni.showModal({
					title: title,
					content: content,
					confirmText,
					showCancel,
					confirmColor: '#28D4A1',
					success(res) {
						if (res.confirm) {
							confirm && confirm()
						} else if (res.cancel) {
							cancel && cancel()
						}
					},
					complete() {
						complete && complete()
					}
				})
			},
			uniToast: function({
				title = '',
				icon = 'success',
				image = '',
				duration = 1000,
				mask = false,
				success,
				fail,
				complete
			}) {
				uni.showToast({
					title,
					icon,
					image,
					duration,
					mask,
					success() {
						success && success()
					},
					fail() {
						fail && fail()
					},
					complete() {
						complete && complete()
					}
				})
			},
			// showBarLoading: function() {
			//   getApp().showNavigationBarLoading && getApp().showNavigationBarLoading()
			// },
			// hideBarLoading: function() {
			//   getApp().hideNavigationBarLoading && getApp().hideNavigationBarLoading()
			// },
			onPullDownRefresh: function() {
				// Vue.gd.showBarLoading()
				uni.showNavigationBarLoading()
			},
			stopPullDown: function() {
				// Vue.gd.hideBarLoading()
				uni.hideNavigationBarLoading()
				uni.stopPullDownRefresh()
			},
			...utils
		}
	}
}
