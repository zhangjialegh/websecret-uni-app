<template>
	<view class='container'>
		<view class='section'>
			<view class='logo-wrapper'>
				<view class='logo-box'>
					<image src='../../static/logo.png'></image>
				</view>
				<text class='app-name'>青云器</text>
			</view>

			<view class="login-box">
				<view class="input-box">
					<input type="text" :value="email" placeholder="请输入邮箱地址" @input="handleInput" />
				</view>
				<button plain class="login-btn" @tap="sendCode">登录</button>
			</view>
			
			<view class="notice-box">
				<view class="iconfont icon-about"></view>
				<text class="text">为了保证账号数据同步，首次登录需要绑定邮箱地址，该邮箱可用来在web页面登录使用。</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				email: ''
			}
		},
		onLoad() {
		},
		methods: {
			handleInput(e) {
				this.email = e.detail.value
			},
			sendCode() {
				const vx = this
				if (!this.email) {
					this.$gd.uniToast({
						title: '邮箱不能为空',
						icon: 'none'
					})
				} else if (!this.$gd.checkEmail(this.email)) {
					this.$gd.uniToast({
						title: '请输入邮箱的邮箱地址',
						icon: 'none'
					})
				} else {
					this.$gd.uniRegist()
					.then(res => {
						this.$gd.uniRequest({
							url: 'mail/send',
							isGet: false,
							notAuth: true,
							data: {
								email: this.email,
								ucode: res.code,
								type: res.type
							}
						}).then(res => {
							if (res.success) {
								if (res.data && res.data.id) {
									vx.$gd.loginSuccess(res.data)
									vx.$gd.uniToast({
										title: '登录成功'
									})
									uni.reLaunch({
										url: '/pages/index/index'
									})
								} else {
									uni.navigateTo({
										url: '/pages/checkcode/checkcode?email='+ vx.email
									})
								}
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
	.notice-box {
		padding: 30rpx 0;
		color: #999999;
		font-size: 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}
	.notice-box > .iconfont {
		color: #fff;
		background-color: var(--base-color);
		border-radius: 50%;
		width: 32rpx;
		height: 32rpx;
		text-align: center;
		line-height: 32rpx;
		margin-top: 5rpx;
		margin-right: 5rpx;
		opacity: 0.7;
	}
	.notice-box > .text {
		width: calc(100% - 37rpx);
	}
	.notice-box > .iconfont::before {
		font-size: 28rpx;
	}
</style>
