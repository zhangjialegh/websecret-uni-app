<template>
	<view class="index-wrap">
		<view class="cloud-back-box">
			<clouds></clouds>
		</view>
		<view class="index-body-wrap">
			<!-- <view class="header ware">

			</view> -->
			<uni-grid :gridList="gridsData" column="3"></uni-grid>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import clouds from '@/pages/index/cloud.vue'
	import Qiniu from '@/common/upload.js'
	export default {
		components: {
			clouds,
			uniGrid
		},
		data() {
			return {
				gridsData: [{
					title: '实用工具',
					id: 1,
					lists: [{
						path: '/pages/websecret/index/index',
						text: '网密',
						image: '/static/websecret.png',
						backgroundImage: ''
					}, {
						path: '/pages/puzzle/index/index',
						text: '拼图',
						image: '/static/movable.png',
						backgroundImage: ''
					}, {
						path: '/pages/weather/weather',
						text: '天气',
						image: '/static/weather.png',
						backgroundImage: ''
					}]
				}, {
				  title: '生活趣味',
				  id: 2,
				  lists: [{
				  	path: '/pages/turntable/turntable',
				  	text: '决与择',
				  	image: '/static/turntable.png',
				  	backgroundImage: ''
				  }]
				}]
			}
		},
		onLoad() {
			this.getAllCategory()
		},
		methods: {
			navigate(e) {
				const {
					path
				} = e.currentTarget.dataset
				if (path) {
					uni.navigateTo({
						url: path
					})
				}
			},
			testQiniuUpload() {
				const vx = this
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					success(res) {
						Qiniu.upload(res.tempFilePaths[0], (res) => {
							vx.$gd.uniRequest({
								url: 'cornucopia/ocr/photo',
								isGet: false,
								notAuth: true,
								data: {
									imgUrl: res.imageURL,
									type: 'idcard'
								}
							}).then(res => {
								if (res.data.errmsg === 'ok') {
									
								} else {
									vx.$gd.uniToast({
										title: res.data.errmsg
									})
								}
							})
						}, (err) => {
							vx.$gd.uniToast({
								title: err.errmsg || '上传失败，请稍后再试'
							})
						}, {
							region: 'NCN',
							domain: 'https://ifile.zhangjiale.club',
							uptokenURL: 'cornucopia/uploadToken'
						}, () => {
							// 取消上传
						}, () => {
							// `before` 上传前执行的操作
						}, (err) => {
							// `complete` 上传接受后执行的操作(无论成功还是失败都执行)
						})
					}
				})
			},
			testOcr() {
				const vx = this
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					success(res) {
						const File = uni.getFileSystemManager()
						File.readFile({
							filePath: res.tempFilePaths[0],
							encoding: 'base64',
							success(res) {
								let base64 = res.data
								let stmp = parseInt(new Date().getTime() / 1000)
								let str = `app_id=2125164668&card_type=0&image=${encodeURIComponent(base64)}&nonce_str=${encodeURIComponent('fa577cg340859f9fg')}&time_stamp=${stmp}&app_key=6ywDMBrBQi1EF0CH`
								let sign =vx.$gd.md5(str).toUpperCase()
								uni.request({
									url: 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_idcardocr',
									method: 'POST',
									header: {
										'content-type': 'application/x-www-form-urlencoded'
									},
									data: {
										app_id: 2125164668,
										card_type: 0,
										image: base64,
										nonce_str: 'fa577cg340859f9fg',
										time_stamp: stmp,
										sign: sign
									},
									success(res) {
										const info = res.data
										if (info.msg === 'ok') {
											
										}
									}
								})
							}
						})
					}
				})
			},
			getAllCategory() {
				const vx = this
				const gridsData = this.gridsData.slice()
				let platform = ''
				// #ifdef H5
				platform = 'H5'
				// #endif
				
				this.$gd.uniRequest({
					url: 'cornucopia/congar',
					isGet: true,
					data: {
						platform
					},
					notAuth: true
				}).then(res => {
					if (res.data.length) {
						gridsData.forEach(grid => {
							res.data.forEach(item => {
								if (grid.id === item.id) {
									grid.lists.push(...item.lists)
								} else {
									gridsData.push(item)
								}
							})
						})
						vx.gridsData = gridsData
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-wrap {
		background-color: #f9f9f9;
		width: 100vw;
		position: relative;
		z-index: 0;
		/* #ifndef H5 */
		min-height: 100vh;
		/* #endif */
		/* #ifdef H5 */
		min-height: calc(100vh - 44px);

		/* #endif */
		.cloud-back-box {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		.index-body-wrap {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;
			padding: 0 10rpx;
			padding-top: 15rpx;
			overflow: scroll;
		}

		.ware {
			margin-bottom: 15rpx;
		}

		.header {
			width: 100%;
			border-radius: 15rpx;
			height: 250rpx;
			background-color: var(--base-color);
			overflow: hidden;
		}

		.body {
			width: 100%;
			border-radius: 15rpx;
			background-color: rgba(255, 255, 255, 0.7);

			.title {
				padding: 30rpx;
				color: #4a4a4a;
				font-size: 32rpx;
			}

			.grid-item-box {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				flex: 1;
				position: relative;
				padding: 30rpx 0;

				.grid-item-image {
					width: 50rpx;
					height: 50rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					font-size: 24rpx;
					margin-top: 15rpx;
					color: #4a4a4a;
				}
			}
		}
	}
</style>
