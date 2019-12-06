<template>
	<view class="container">
		<view class="scan-bg-box" >
			<pikachu />
		</view>
		<view class="scan-list-wrap">
			<view class="list-item" :class="{active: item.active}" v-for="item in lists" :key="item.id" @tap="toggleSelect(item)">
				{{item.text}}
			</view>
		</view>
		<!-- 确定修改按钮 -->
		<button class="copy-confirm-btn" plain hover-class="btn-hover-class" @tap="handleSure" v-if="selects.length">
			<text>复制选中</text>
		</button>
		<button class="copy-confirm-btn toggle-all" :style="{background:bgColor}" plain hover-class="btn-hover-class" @tap="handleToggleAll" v-if="lists.length">
			<text :style="{color:textColor}">全{{selects.length == lists.length ? '不' : ''}}选</text>
		</button>
		<uni-fab direction="vertical" :content="content" horizontal="right" :pattern="pattern" @trigger="handle"></uni-fab>
	</view>
</template>

<script>
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import pikachu from '@/components/pikachu/pikachu.vue'
	import Qiniu from '@/common/upload.js'
	export default {
		components: {uniFab,pikachu},
		data() {
			return {
				lists: [],
				bgColor: '#ffffff',
				textColor: '#73b9a2',
				pattern: {
					buttonColor: '#73b9a2'
				},
				content: [
				{
					text: '二维码',
					font: 'icon-qrcode'
				}, {
					text: '条形码',
					font: 'icon-barcode'
				}
				// #ifdef MP-WEIXIN
				,{
					text: '文字识别',
					font: 'icon-ocr'
				}
				// #endif
				]
			};
		},
		computed: {
			selects () {
				return this.lists.filter(item => item.active).sort((a,b)=>(a.id - b.id)).map(item => item.text)
			}
		},
		watch: {
			selects (nv) {
				if (nv.length === this.lists.length) {
					this.bgColor = '#73b9a2'
					this.textColor = '#ffffff'
				} else {
					this.textColor = '#73b9a2'
					this.bgColor = '#ffffff'
				}
			}
		},
		methods: {
			handle(e) {
				const idx = e.index
				if (idx === 0 || idx === 1) {
					this.scanCode()
				} else if(idx === 2) {
					this.ocrWord()
				}
			},
			toggleSelect(item) {
				const items = this.lists.slice()
				items[item.id].active = !items[item.id].active
				this.lists = items
			},
			handleToggleAll() {
				let flag = false
				let items = this.lists.slice()
				items.forEach((item) => {
					if (item.active === false) {
						flag = true
					}
				})
				if(flag) {
					this.lists = items.map(item=> {
						item.active = true
						return item
					})
				} else {
					this.lists = items.map(item=> {
						item.active = false
						return item
					})
				}
			},
			handleSure() {
				const vx = this
				const text = this.selects.join('')
				uni.setClipboardData({
					data: text,
					success() {
						vx.$gd.uniToast({
							title: '复制成功',
							icon: 'success'
						})
					},
					fail() {
						vx.$gd.uniToast({
							title: '平台不支持复制到剪贴板'
						})
					}
				})
			},
			ocrWord() {
				const vx = this
				uni.chooseImage({
					count:1,
					sizeType: ['compressed'],
					success(res) {
						uni.showLoading({
							title: '识别中...'
						})
						Qiniu.upload(res.tempFilePaths[0], (res) => {
							vx.$gd.uniRequest({
								url: 'cornucopia/ocr/photo',
								isGet: false,
								notAuth: true,
								data: {
									imgUrl: res.imageURL,
									type: 'comm'
								}
							}).then(res => {
								uni.hideLoading()
								if (res.data.errmsg === 'ok') {
									const items = res.data.items
									if (items.length) {
										vx.lists = items.map((item,i)=> {
											return {
												text: item.text,
												id: i,
												active: false
											}
										})
									} else {
										vx.$gd.uniToast({
											title: '未识别到有效内容'
										})
									}
								} else {
									vx.$gd.uniToast({
										title: res.data.errmsg || '未识别到有效内容'
									})
								}
							}).catch(()=>uni.hideLoading())
						}, (err) => {
							uni.hideLoading()
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
			scanCode() {
				const vx = this
				uni.scanCode({
					success(res) {
						if (res.result) {
							vx.$gd.uniModal({
								title: '扫码结果',
								content: res.result,
								showCancel: true,
								confirmText: '复制',
								confirm: () => {
									uni.setClipboardData({
										data: res.result,
										success() {
											vx.$gd.uniToast({
												title: '复制成功',
												icon: 'success'
											})
										},
										fail() {
											vx.$gd.uniToast({
												title: '平台不支持复制到剪贴板'
											})
										}
									})
								}
							})
						} else if (res.path) {
							vx.$gd.uniModal({
								title: '小程序码路径',
								content: res.path
							})
						}
					},
					fail(err) {
						vx.$gd.uniToast({
							title: err.errMsg || '扫描失败'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.scan-bg-box {
	opacity: 0.1;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
.copy-confirm-btn {
		position: fixed;
		bottom: 50rpx;
		left: 240rpx;
		height: 80rpx;
		border-radius: 40rpx;
		box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
		&.toggle-all {
			left: 50rpx;
			&.active {
				background-color: var(--base-color);
				color: #fff;
			}
		}
		>text {
			color: var(--base-color);
			font-size: 32rpx;
		}
	}
.scan-list-wrap {
	position: relative;
	z-index: 2;
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-wrap: wrap;
	padding: 30rpx;
	> .list-item {
		height: 60rpx;
		padding: 0 15rpx;
		border-radius: 4rpx;
		margin: 10rpx 6rpx;
		line-height: 60rpx;
		background-color: #fff;
		font-size: 26rpx;
		color: #4a4a4a;
		&.active {
			background-color: var(--base-color);
			color: #fff;
		}
	}
}
</style>
