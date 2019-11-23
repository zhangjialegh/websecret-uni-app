<template>
	<view class="container">
		<!-- 添加卡片按钮 -->
		<button plain class='add-btn' @tap='goAddCard'>
			<text class='iconfont icon-plus'></text>
		</button>

		<button :data-id="item.id" v-for="(item) in cardLists" :key="item.name" @tap='goCardDetail' plain class='record-item'
		 @longtap='handleMoreOpt' hover-class='button-hover-class'>
			<view class='logo-box'>
				<text>{{item.logo}}</text>
			</view>

			<view class='record'>
				<text class='title'>{{item.webname}}</text>
				<text class='desc'>更新时间：{{item.updatedAt}}</text>
			</view>

		</button>

		<!-- loading-page -->
		<loadingpage :show="isLoading" />

		<!-- about -->
		<moview />
	</view>
</template>

<script>
	import loadingpage from '@/components/loadingpage/loadingpage.vue'
	import moview from '@/components/moview/moview.vue'
	import Vue from 'vue'
	export default {
		components: {
			loadingpage,
			moview
		},
		data() {
			return {
				cardLists: [],
				isLoading: true,
				taplock: false
			};
		},
		onLoad() {
			this.getAllCards()
		},
		// #ifndef H5
		onShareAppMessage() {

		},
		// #endif

		methods: {
			getAllCards() {
				const vx = this
				this.isLoading = true
				Vue.gd.wxRequest({
					url: 'cards/list',
					isGet: true
				}).then(res => {
					vx.isLoading = false
					vx.cardLists = res.data.map(item => {
						item['updatedAt'] = Vue.gd.smartTime(item['updatedAt'])
						return item
					})
				})
			},
			goAddCard(id) {
				uni.navigateTo({
					url: '/pages/addinfo/addinfo'
				})
			},

			// 点击卡片去详情页
			goCardDetail(e) {
				if (this.taplock) {
					this.taplock = false
					return
				}
				const id = e.target.dataset.id
				uni.navigateTo({
					url: '/pages/detail/detail?oid=' + id
				})
			},

			// 长按卡片操作
			handleMoreOpt(e) {
				this.taplock = true
				const id = e.target.dataset.id
				const vx = this
				uni.showActionSheet({
					itemList: ['删除'],
					success(res) {
						if (res.tapIndex == 0) {
							vx.deleteCard(id)
						}
					}
				})
			},

			// 删除卡片
			deleteCard(id) {
				const vx = this
				this.$gd.wxRequest({
					url: 'card/delete',
					isGet: true,
					data: {
						id
					}
				}).then(res => {
					vx.cardLists = res.data.map(item => {
						item['updatedAt'] = vx.$gd.smartTime(item['updatedAt'])
						return item
					})
				})
			}
		}
	}
</script>

<style>
	.add-btn {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 50rpx;
		right: 50rpx;
		background: var(--base-color) !important;
		border-radius: 50%;
		overflow: hidden;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
	}

	.add-btn>.iconfont {
		font-size: 26rpx;
		color: #fff;
	}

	.record-item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 30rpx;
		position: relative;
		text-align: left;
	}

	.record-item>.logo-box {
		height: 100rpx;
		width: 100rpx;
		border: 1rpx solid var(--border-light-color);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 70rpx;
		margin-right: 30rpx;
	}

	.record-item>.record {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		flex-direction: column;
	}

	.record-item>.record>text {
		display: block;
		width: 500rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.record-item>.record>.title {
		font-size: 32rpx;
		color: var(--text-base-color);
	}

	.record-item>.record>.desc {
		font-size: 26rpx;
		color: var(--text-grey-color);
	}

	.record-item>.operation {
		position: absolute;
		width: 80rpx;
		height: 80rpx;
		top: 50%;
		right: 30rpx;
		transform: translateY(-50%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.record-item>.operation>.iconfont {
		font-size: 50rpx;
		color: var(--base-color);
	}

	button {
		border-radius: 0;
		text-align: left;
	}
</style>
