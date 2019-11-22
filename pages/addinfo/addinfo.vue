<template>
	<view class='container'>
		<!-- 保存按钮 -->
		<button plain class='save-btn' @tap='saveData'>
			<text class='text'>保存</text>
		</button>
		<view class='section'>
			<view class='input-wrapper'>
				<text class='input-label'>网站名</text>
				<input data-value="webname" class="input" :class="{'active-border': activewebname == 'webname', 'normal-border': activewebname != 'webname'}"
				 type='text' :value="webname" :focus="true" @input='handleInput' @focus='handleFocus' @blur='handleBlur'></input>
			</view>
			<view class='input-wrapper'>
				<text class='input-label'>登录名</text>
				<input data-value="name" class="input" :class="{'active-border': activename == 'name', 'normal-border': activename != 'name'}"
				 type='text' :value="name" @input='handleInput' @focus='handleFocus' @blur='handleBlur'></input>
			</view>
			<view class='input-wrapper'>
				<text class='input-label'>备注</text>
				<textarea class='textarea' placeholder='请输入内容...' placeholder-class="placeholder-class" type='text' :value="remark"
				 @input='handleRemarkInput'></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webname: '',
				name: '',
				remark: '',
				activewebname: '',
				activename: ''
			}
		},
		methods: {
			isValid(val) {
				return val && val.trim()
			},
			handleInput(e) {
				const {
					value
				} = e.target.dataset
				this[value] = e.detail.value
			},
			handleFocus(e) {
				const {
					value
				} = e.target.dataset
				this['active' + value] = value
			},
			handleBlur(e) {
				const {
					value
				} = e.target.dataset
				this['active' + value] = ''
			},
			handleRemarkInput(e) {
				this.remark = e.detail.value
			},
			saveData() {
				const {
					name,
					remark,
					webname
				} = this
				if (!this.isValid(webname)) {
					this.$gd.wxToast({
						icon: 'none',
						title: '网站名不能为空',
						duration: 1500
					})
				} else if (!this.isValid(name)) {
					this.$gd.wxToast({
						icon: 'none',
						title: '登录名不能为空',
						duration: 1500
					})
				} else {
					// TODO: 提交更新
					this.$gd.wxRequest({
						url: 'cards/insert',
						isGet: false,
						data: {
							webname,
							account: name,
							remark
						}
					}).then(res => {
						if (res.success) {
							const pages = getCurrentPages()
							const PrePage = pages[pages.length - 2]
							console.log(pages, PrePage, 'papge')
							PrePage.getAllCards()
							uni.navigateBack()
						}
					})
				}
			},
		}
	}
</script>

<style scoped>
	/* pages/addinfo/addinfo.wxss */
	.save-btn {
		height: 80rpx;
		width: 150rpx;
		position: fixed;
		bottom: 50rpx;
		right: 50rpx;
		background: var(--base-color) !important;
		border-radius: 40rpx;
		overflow: hidden;
		padding: 0 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.save-btn>.text {
		font-size: 30rpx;
		color: #fff;
	}

	.section {
		padding-top: 40rpx;
	}

	.input-wrapper {
		padding: 20rpx 0;
		position: relative;
	}

	.input-wrapper>.input {
		width: 100%;
	}

	.input-wrapper>.input.generate {
		background: #efefef;
	}

	.input-wrapper>.input.normal-border {
		border-bottom: 1rpx solid var(--border-light-color);
	}

	.input-wrapper>.input.active-border {
		border-bottom: 1rpx solid var(--base-color);
	}

	.input-wrapper>.input-label {
		display: block;
		font-size: 32rpx;
		color: var(--text-grey-color);
		margin-bottom: 30rpx;
	}

	.input-wrapper>.textarea {
		box-sizing: border-box;
		padding: 10rpx;
	}

	.placeholder-class {
		font-size: 30rpx;
	}
</style>
