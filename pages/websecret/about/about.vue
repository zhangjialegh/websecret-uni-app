<template>
	<view class='container'>
		<view class='section'>
			<view class='logo-wrapper'>
				<view class='logo-box'>
					<image src='/static/websecret.png'></image>
				</view>
				<text class='app-name'>网密</text>
			</view>

			<view class='title-1'>简介</view>
			<view class='content'>
				<text class='paragraph'>网密是一款帮助用户储存网络账号的小软件，同时可以通过<text class="heavy">前端实时计算密码，无需后台存储，更加安全</text>，用户只要记住一个密码，就可以为不同的网络账号生成密码。</text>
				<text class='paragraph'>Web平台请访问 <text class="heavy" :selectable="true">{{web}}</text></text>
			</view>
			<view class='title-1'>说明</view>
			<view class='content'>
				<text class='paragraph'>1. <text class="heavy">记忆密码</text>就是需要你真实记忆的密码序列。</text>
				<text class='paragraph'>2. <text class="heavy">区分代号</text>建议用账号联想记忆，降低记忆成本，例如淘宝网的区分代码就可以设置为taobao123，QQ账号就设置为QQ123。</text>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				web: this.$cg.BASE_URL
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
		width: 60%;
		height: 60%;
	}
	.title-1 {
		border-left: 8rpx solid var(--base-color);
		color: var(--text-base-color);
		font-size: 36rpx;
		padding: 4rpx 15rpx;
		margin: 15rpx 0;
		margin-top: 50rpx;
	}
	.content {
		font-size: 32rpx;
		color: var(--text-grey-color);
	}
	.paragraph {
		display: block;
		line-height: 60rpx;
		margin: 15rpx 0;
	}
	.heavy {
		color: var(--text-base-color);
		font-weight: 500;
	}
	.uni-code {
		font-size: 32rpx;
		color: var(--base-color);
	}
</style>
