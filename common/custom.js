const md5 = require('@/common/md5.js')
let loginCallback = null
export default {
	install(Vue, OPT) {
		Vue.gd = Vue.prototype.$gd = {
			initOptions: function(options) {
				Vue.store.commit('setSystem', uni.getSystemInfoSync())
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
			wxAll: function(objs) { //Promise.all
				const vx = Vue.gd
				const token = Vue.store.state.accessToken || null
				// 如果还未登录，需要登录后再执行
				if (token) {
					return Promise.all(objs.map(item => {
						return vx.wxFetch(item)
					}))
				} else {
					return new Promise((resolve, reject) => {
						loginCallback = function(token) {
							Promise.all(objs.map(item => {
								return vx.wxFetch(item, token)
							})).then((res) => {
								resolve(res)
							}).catch(err => {
								reject(err)
							})
						}
					})
				}

			},
			wxFetch: function(obj, accesstoken) { //封装的请求接口
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
			wxRequest: function(obj) {
				const vx = Vue.gd
				const token = Vue.store.state.accessToken || ''
				// 如果还未登录，需要登录后再执行
				// #ifdef H5
				return new Promise((resolve, reject) => {
					vx.wxFetch(obj)
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
						vx.wxFetch(obj)
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
							vx.wxFetch(obj, token)
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
			wxModal: function({
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
			wxToast: function({
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
			formatTime: date => {
				date = new Date(date)
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				const day = date.getDate()
				const hour = date.getHours()
				const minute = date.getMinutes()
				const second = date.getSeconds()
				return [year, month, day].map(Vue.gd.formatNumber).join('/') + ' ' + [hour, minute, second].map(Vue.gd.formatNumber)
					.join(
						':')
			},
			formatNumber: n => {
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			unionQuery: obj => {
				let str = ''
				const array = Object.keys(obj)
				for (let i = 0; i < array.length; i++) {
					const key = array[i];
					const val = obj[key]
					if (i === 0) {
						str += '?' + key + '=' + val
					} else {
						str += '&' + key + '=' + val
					}
				}
				return str
			},
			queryString: str => {
				let arr = str.split('&')
				let obj = {}
				arr.forEach((item, index) => {
					const ele = item.split('=')
					const key = ele[0]
					const val = ele[1]
					obj[key] = val
				})
				return obj
			},
			formatTimeSlash: time => {
				const date = new Date(time)
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				const day = date.getDate()
				return [month, day, year].map(Vue.gd.formatNumber).join('/')
			},
			checkPlatform: info => {
				const {
					system
				} = info
				if (/ios/i.test(system)) {
					return 'ios'
				} else {
					return 'android'
				}
			},
			sliceLists: (lists, size, key, value) => {
				let _list_index = lists.findIndex(v => v[key] === value) + 1;
				if (_list_index == undefined) return false;

				let list_page = Math.ceil(_list_index / size); //被操作数所在页数
				let rest_page = list_page - 1;
				let rest_page_indexes = rest_page * size;
				let rest_lists = lists.filter((v, i) => i < rest_page_indexes);
				return {
					_page: rest_page,
					_list: rest_lists
				};
			},
			generateCode: (codeword, password) => {
				const STR1 = 'web';
				const STR2 = 'secret';
				const STR3 = 'websecret31302991jkharry';
				const Num = 16
				if (Vue.gd.isValid(password) && Vue.gd.isValid(codeword)) {
					let md5one = md5(password, codeword);
					let md5two = md5(md5one, STR1);
					let md5three = md5(md5one, STR2);
					let rule = md5three.split('')
					let source = md5two.split('')
					// convert to upper case
					for (let i = 0; i < 32; i++) {
						if (Number.isNaN(source[i])) {
							if (STR3.search(rule[i]) > -1) {
								source[i] = source[i].toUpperCase();
							}
						}
					}
					let pwd32 = source.join('');
					let firstChar = pwd32.slice(0, 1);
					let pwd = ''
					// make sure first char is not a number
					if (Number.isNaN(firstChar)) {
						pwd = pwd32.slice(0, Num);
					} else {
						pwd = 'K' + pwd32.slice(1, Num);
					}
					return pwd
				} else {
					return false
				}
			},
			isValid: (item) => {
				return item !== undefined && item !== '';
			},
			checkEmail: (str) => {
				const szReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
				return szReg.test(str)
			},
			smartTime: (date) => {
				const delta = Date.now() - date
				const ceil = Math.ceil
				const hours = ceil(delta / 1000 / 60 / 60)
				const mins = ceil(delta / 1000 / 60)
				if (mins < 60) {
					return mins + '分钟前'
				} else if (hours >= 24) {
					return Vue.gd.formatTime(date)
				} else {
					return hours + '小时前'
				}
			},
			md5: md5
		}
	}
}
