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
					<input type="password" :value="password" placeholder="请输入密码" @input="handleInput1" />
				</view>
				<view class="input-box">
					<input type="password" :value="repassword" placeholder="请确认密码" @input="handleInput2" />
				</view>
				<button plain class="login-btn" @tap="checkCode">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password: '',
				repassword: '',
				email: ''
			}
		},
		onLoad(options) {
			this.email = options.email
		},
		methods: {
			handleInput1(e) {
				this.password = e.detail.value
			},
			handleInput2(e) {
				this.repassword = e.detail.value
			},
			checkCode() {
				const vx = this
				if (this.password !== this.repassword) {
					this.$gd.wxToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					})
				} else {
					this.$gd.uniRegist()
					.then(res => {
						vx.$gd.wxRequest({
							url: 'account/regist',
							isGet: false,
							notAuth: true,
							data: {
								code: res.code,
								type: res.type,
								password: vx.$gd.md5(vx.password),
								email: vx.email
							}
						}).then(res => {
							if (res.success) {
								vx.$gd.loginSuccess(res.data)
								vx.$gd.wxToast({
									title: '登录成功'
								})
								uni.reLaunch({
									url: '/pages/index/index'
								})
							}
						})
					})
				}
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
		margin-bottom: 20rpx;;
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
</style>
