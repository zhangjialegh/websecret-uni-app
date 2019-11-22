<template>
	<view class='container'>
		<view class='section'>
			<view class='logo-wrapper'>
				<view class='logo-box'>
					<image src='../../static/logo.jpeg'></image>
				</view>
				<text class='app-name'>网密</text>
			</view>

			<view class="login-box">
				<view class="input-box">
					<input type="text" :value="unicode" placeholder="请输入登录码" @input="handleInput" />
				</view>
				<button plain class="login-btn" @tap="h5Login">登录</button>
			</view>

			<view class='qrcode-box'>
				<text>扫描小程序，获取登录码</text>
				<image @tap="previewImage" mode="aspectFit" src='../../static/websecret.png'></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				unicode: ''
			}
		},
		onLoad() {
		},
		methods: {
			handleInput(e) {
				this.unicode = e.detail.value
			},
			handlePress() {
				const vx = this
				uni.setClipboardData({
					data: this.code,
					success(res) {
						vx.$gd.wxToast({
							title: '登录码复制成功',
							icon: 'success'
						})
					}
				})
			},
			h5Login() {
				const vx = this
				if (!this.unicode) {
					this.$gd.wxToast({
						title: '登录码不能为空',
						icon: 'none'
					})
					return
				}
				this.$gd.wxRequest({
					url: 'h5/login',
					isGet: false,
					data: {
						unicode: this.unicode
					}
				}).then(res => {
					vx.$gd.loginSuccess(res)
					uni.reLaunch({
						url: '/pages/index/index'
					})
				})
			},
			previewImage() {
				uni.previewImage({
					urls: ['/static/websecret.png'],
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.section {
		padding-bottom: 40rpx;
	}

	.logo-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 50rpx;
		flex-direction: column;
	}

	.app-name {
		font-size: 32rpx;
		color: var(--text-grey-color);
	}

	.logo-box {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 2rpx solid var(--base-color);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.logo-box>image {
		width: 90%;
		height: 90%;
	}

	.login-box {
		padding-top: 60rpx;
	}

	.input-box {
		width: 100%;
		border: 1rpx solid #e8e8e8;
	}

	.input-box input {
		padding: 20rpx;
	}

	.login-btn {
		background-color: var(--base-color);
		color: #FFFFFF;
		padding: 20rpx;
		font-size: 32rpx;
		margin-top: 40rpx;
	}

	.qrcode-box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding-top: 80rpx;
	}

	.qrcode-box>text {
		font-size: 32rpx;
	}

	.qrcode-box>image {
		width: 300rpx;
		height: 350rpx;
		margin-top: 10rpx;
	}
</style>
