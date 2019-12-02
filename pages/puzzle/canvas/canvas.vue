<template>
	<view class="canvas-box">
		<canvas canvas-id="canvas" :style="{width: ctxWidth+'px',height: ctxHeight+'px'}"></canvas>
		<cover-view class="preview_btn left" @tap="handleBack">继续编辑</cover-view>
		<cover-view class="preview_btn right" @tap="handleFinish">保存图片</cover-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ctxWidth: 300,
				ctxHeight: 225,
				image: ''
			};
		},
		onLoad() {
			const previewInfo = this.$store.state.previewInfo
			this.ctxWidth = previewInfo.global.width
			this.ctxHeight = previewInfo.global.height
		},
		onReady() {
			this.canvasDrawData(this.$store.state.previewInfo)
		},
		methods: {
			pathToDataUrl(url) {
				return new Promise((resolve, reject) => {
					const path = url
					// #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO
					uni.compressImage({
						src: path,
						quality: 100,
						success: function(res) {
							const FileMg = uni.getFileSystemManager()
							FileMg.readFile({
								filePath: res.tempFilePath,
								encoding: 'base64',
								success: (res) => {
									resolve('data:image/jpeg;base64,' + res.data)
								},
								fail: function(err) {
									reject(err)
								}
							})
						},
						fail: function(err) {
							reject(err)
						}
					})
					// #endif
				})
			},
			canvasDrawData(data) {
				const vx = this
				const ctx = uni.createCanvasContext('canvas')
				this.$gd.drawjs(ctx, data)
					.then(ctx => {
						ctx.draw()
					})
			},
			handleBack() {
				uni.navigateBack()
			},
			handleFinish() {
				const vx = this
				const previewInfo = this.$store.state.previewInfo
				uni.canvasToTempFilePath({
					width: previewInfo.global.width,
					height: previewInfo.global.height,
					canvasId: 'canvas',
					success: function(res) {
						vx.saveImage(res.tempFilePath)
					},
					fail: function(err) {
						console.log(err)
					}
				})

			},
			saveImage (url) {
				const vx = this
				uni.saveImageToPhotosAlbum({
					filePath: url,
					success() {
						vx.$gd.uniToast({
							title: '保存成功',
							icon: 'success'
						})
					},
					fail(err) {
						if (err.errMsg === "saveImageToPhotosAlbum:fail cancel") {
							vx.$gd.uniToast({
								title: '取消保存'
							})
						} else {
							vx.$gd.uniModal({
								content: '存储出现异常'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.canvas-box {
		width: 100vw;
		height: 100vh;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.preview_btn {
		width: 180rpx;
		height: 70rpx;
		position: absolute;
		bottom: 30rpx;
		padding: 0;
		border-radius: 35rpx;
		border: none;
		overflow: hidden;
		text-align: center;
		background-color: rgba(255, 255, 255, 0.6);
		line-height: 70rpx;
		color: #009480;
		font-size: 30rpx;
		box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);

		&.right {
			right: 30rpx;
		}

		&.left {
			left: 30rpx;
			color: #6f6f6f;
		}
	}
</style>
