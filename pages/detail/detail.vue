<template>
	<!--pages/detail.wxml-->
	<view class='container'>
		<view class='header' :style="{background:color}">
			<view class='logo-wrapper'>
				<view class='logo-box'>
					<text>{{cardInfo.logo}}</text>
				</view>
				<text class='web-name'>{{cardInfo.webname}}</text>
			</view>
			<view class='operation'>
				<button plain class="iconfont" :class="{'icon-sure': editing, 'icon-edit': !editing}" hover-class='icon-hover-class'
				 @tap='toggleEdit'></button>
			</view>
		</view>

		<view class='section'>
			<scroll-view scroll-y style="height: 100%;">
				<view class='input-wrapper'>
					<text class='input-label'>登录名</text>
					<input data-value="name" class="input" :class="{'active-border': editing && activename == 'name', 'normal-border': editing && activename != 'name'}"
					 type='text' :value="name" :disabled="editing ? false : true" @input='handleInput' @focus='handleFocus' @blur='handleBlur'></input>
					<view class='operation' v-if="!editing">
						<view class='iconfont'></view>
						<button plain class='copy-btn' @tap='handleNameCopy'>复制</button>
					</view>
				</view>

				<block v-if='!editing'>
					<view class='input-wrapper'>
						<text class='input-label'>记忆密码</text>
						<input data-value="recordPwd" class="input" :class="{'active-border': activerecordPwd == 'recordPwd', 'normal-border': activerecordPwd != 'recordPwd'}"
						 type='text' :password='true' :value="recordPwd" @input='handleInput' @focus='handleFocus' @blur='handleBlur'></input>
					</view>
					<view class='input-wrapper'>
						<text class='input-label'>区分代号</text>
						<input data-value="diffCode" class="input" :class="{'active-border': activediffCode == 'diffCode', 'normal-border': activediffCode != 'diffCode'}"
						 type='text' :value="diffCode" @input='handleInput' @focus='handleFocus' @blur='handleBlur'></input>
						<view class='operation'>
							<view class='iconfont'></view>
							<button plain class='copy-btn' @tap='generate'>生成</button>
						</view>
					</view>
					<view class='input-wrapper'>
						<text class='input-label'>密码</text>
						<input class='input generate' type='text' :password='pwdShow ? false : true' :value="genePwd" :disabled="true"></input>
						<view class='operation more' v-if="genePwd">
							<view class="iconfont" :class="{'icon-show': pwdShow, 'icon-hidden': !pwdShow}" @tap='togglePwdShow'></view>
							<button plain class='copy-btn' @tap='handlePwdCopy'>复制</button>
						</view>
					</view>
				</block>

				<view class='input-wrapper'>
					<text class='input-label'>备注</text>
					<textarea v-if="!isLoading" class='textarea' placeholder='请输入内容...' placeholder-class="placeholder-class" type='text'
					 :value="remark" :focus="true" @input='handleRemarkInput' :disabled="editing ? false : true"></textarea>
				</view>
			</scroll-view>
		</view>

		<!-- loading-page -->
		<loadingpage :show="isLoading" />
	</view>
</template>

<script>
	import loadingpage  from '@/components/loadingpage/loadingpage.vue'
	export default {
		components: {loadingpage},
		data() {
			return {
				editing: false,
				name: '',
				recordPwd: '',
				diffCode: '',
				genePwd: '',
				remark: '',
				pwdShow: false,
				id: null,
				cardInfo: {},
				color: '',
				isLoading: true,
				activediffCode: '',
				activerecordPwd: ''
			}
		},
		onLoad(options) {
			this.daynamicBgs()
			this.getCardDetail(options.oid)
			this.id = options.oid
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
			handleRemarkInput(e) {
				this.remark = e.detail.value
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
			togglePwdShow() {
				this.pwdShow = !this.pwdShow
			},
			toggleEdit() {
				const {
					editing,
					name,
					remark,
					id
				} = this
				const vx = this
				if (!editing) {
					this.editing = true
				} else {
					if (!this.isValid(name)) {
						vx.$gd.wxToast({
							title: '登录名不能为空',
							duration: 1500
						})
					} else {
						// TODO: 提交更新
						vx.$gd.wxRequest({
							url: 'card/update',
							isGet: false,
							data: {
								id,
								account: name,
								remark
							}
						}).then(res => {
							if (res.success) {
								vx.$gd.wxToast({
									title: '信息更新成功'
								})
								vx.editing = false
							}
						})
					}
				}
			},

			handleNameCopy() {
				const vx = this
				uni.setClipboardData({
					data: this.name,
					success(res) {
						vx.$gd.wxToast({
							title: '登录名复制成功',
							icon: 'success'
						})
					}
				})
			},
			handlePwdCopy() {
				const vx = this
				uni.setClipboardData({
					data: this.genePwd,
					success(res) {
						vx.$gd.wxToast({
							title: '密码复制成功',
							icon: 'success'
						})
					}
				})
			},
			// 生成密码
			generate() {
				const {
					recordPwd,
					diffCode
				} = this
				if (!this.isValid(recordPwd)) {
					this.$gd.wxToast({
						title: '记忆密码不能为空',
						icon: 'none'
					})
				} else if (!this.isValid(diffCode)) {
					this.$gd.wxToast({
						title: '区分代号不能为空',
						icon: 'none'
					})
				} else {
					const pwd = this.$gd.generateCode(diffCode, recordPwd)
					this.genePwd = pwd
				}
			},

			// 动态设置背景色
			daynamicBgs() {
				const colors = this.$cg.COLORS_PICK
				const color = colors[Math.round(Math.random() * 9)]
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: color
				})
				this.color = color
			},

			// 获取卡片详情
			getCardDetail(id) {
				const vx = this
				this.isLoading = true
				this.$gd.wxRequest({
					url: 'card/detail',
					isGet: true,
					data: {
						id
					}
				}).then(res => {
					vx.isLoading = false,
						vx.cardInfo = res.data,
						vx.name = res.data.account,
						vx.remark = res.data.remark
				})
			}
		}
	}
</script>

<style scoped>
	/* pages/detail.wxss */
	.container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 250rpx;
	}

	.header>.logo-wrapper {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 20rpx 0;
	}

	.header>.logo-wrapper>.logo-box {
		width: 120rpx;
		height: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 80rpx;
		color: #fff;
		border: 1rpx solid var(--border-light-color);
		border-radius: 3rpx;
		margin-bottom: 20rpx;
	}

	.header>.logo-wrapper>.web-name {
		font-size: 32rpx;
		color: #fff;
	}

	.header>.operation {
		position: absolute;
		right: 30rpx;
		top: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.header>.operation>.iconfont {
		display: block;
		font-size: 34rpx;
		color: #fff;
		padding: 10rpx;
		border-radius: 50%;
	}

	.header>.operation>.iconfont.icon-sure {
		font-size: 38rpx;
	}

	.icon-hover-class {
		background: rgba(233, 233, 233, 0.4) !important;
	}

	.section {
		height: calc(100% - 250rpx);
	}

	.input-wrapper {
		padding: 40rpx 0;
		position: relative;
	}

	.input-wrapper>.input {
		width: 500rpx;
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
		margin-bottom: 20rpx;
	}

	.input-wrapper>.operation {
		position: absolute;
		right: -20rpx;
		bottom: 30rpx;
		height: 60rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.input-wrapper>.operation.more {
		bottom: 35rpx;
	}

	.input-wrapper>.operation>.iconfont {
		display: block;
		font-size: 40rpx;
		width: 80rpx;
		height: 100%;
		line-height: 60rpx;
		text-align: center;
	}

	.input-wrapper>.operation>.copy-btn {
		font-size: 32rpx;
		color: var(--base-color);
		width: 120rpx;
		height: 100%;
		line-height: 60rpx;
		padding: 0;
	}

	.input-wrapper>.operation>.copy-btn.large {
		width: 180rpx;
	}

	.input-wrapper>.textarea {
		box-sizing: border-box;
		padding: 10rpx;
	}

	.placeholder-class {
		font-size: 30rpx;
		z-index: -1;
	}
</style>
