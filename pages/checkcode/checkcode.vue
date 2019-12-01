<template>
	<view class='container'>
		<view class='section'>
			<view class='logo-wrapper'>
				<view class='logo-box'>
					<image src='../../static/logo.png'></image>
				</view>
				<text class='app-name'>青云器</text>
			</view>
			
			<view class="notice-body" v-if="email">验证码已发送<text>{{email}}</text></view>

			<view class="login-box">
				<view class="input-box">
					<input type="text" :value="yzcode" placeholder="请输入验证码" @input="handleInput" />
				</view>
				<button plain class="login-btn" @tap="checkCode">验证邮箱</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				yzcode: '',
				email: ''
			}
		},
		onLoad(options) {
			this.email = options.email
		},
		methods: {
			handleInput(e) {
				this.yzcode = e.detail.value
			},
			checkCode() {
				const vx = this
				if (!this.yzcode) {
					this.$gd.uniToast({
						title: '验证码不能为空',
						icon: 'none'
					})
				} else if (!(this.yzcode.length === 4 || this.yzcode.length === 6)) {
					this.$gd.uniToast({
						title: '验证码无效',
						icon: 'none'
					})
				} else {
					this.$gd.uniRegist()
					.then(res => {
						vx.$gd.uniRequest({
							url: 'mail/check',
							isGet: false,
							notAuth: true,
							data: {
								code: this.yzcode,
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
										url: '/pages/typepass/typepass?email='+ vx.email
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
	.notice-body {
		font-size: 30rpx;
		display: inline-block;
		width: 100%;
		text-align: center;
		margin-top: 50rpx;
	}
	
	.notice-body > text {
		color: var(--base-color);
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
</style>
