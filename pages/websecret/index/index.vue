<template>
	<view class="container">
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
			<sideslip v-for="(item) in cardLists" :key="item.id" @remove="deleteCard(item.id)" :options="options">
				<button @tap.stop='goCardDetail(item)' plain class='record-item' hover-class='button-hover-class'>
					<view class='logo-box'>
						<text>{{item.logo}}</text>
					</view>
					<view class='record'>
						<text class='title'>{{item.webname}}</text>
						<text class='desc'>更新时间：{{item.updatedAt}}</text>
					</view>
				</button>
			</sideslip>
		</mescroll-uni>

		<!-- about -->
		<moview />
		
		<!-- 添加卡片按钮 -->
		<button plain class='add-btn' @tap='goAddCard'>
			<text class='iconfont icon-plus'></text>
		</button>
	</view>
</template>

<script>
	import moview from '@/components/moview/moview.vue'
	import sideslip from '@/components/sideslip/sideslip.vue'
	import MescrollUni from 'mescroll-uni'
	import Vue from 'vue'
	export default {
		components: {
			moview,
			sideslip,
			MescrollUni
		},
		data() {
			return {
				cardLists: [],
				mescroll: {},
				options: [
					// {
					// 	text: '复制',
					// 	event: 'copy',
					// 	width: 'max'
					// },
					{
						text: '删除',
						event: 'remove',
						type: 'warn'
					}
				],
				upOption: {
					use: true,
					auto: true,
					page: {
						num: 0,
						size: 8
					},
					noMoreSize: 10,
					empty: {
						tip: '暂无数据'
					}
				},
				downOption: {
					use: true,
					auto: false
				},
			};
		},
		// #ifndef H5
		onShareAppMessage() {
			return {
				title: '网密--网站密码生成小工具',
				desc: '网络账号存储，密码前端生成，无后台存储，更加安全',
				path: '/pages/websecret/index/index'
			}
		},
		// #endif

		methods: {
			downCallback(mescroll) {
				mescroll.resetUpScroll()
			},
			upCallback(mescroll) {
				const token = Vue.store.state.accessToken || uni.getStorageSync(Vue.cg.STORAGE_KEY)
				if (!token) {
					mescroll.endDownScroll()
					mescroll.hideUpScroll()
					mescroll.showEmpty()
				}
				const vx = this
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				if (mescroll.num == 1) {
					this.mescroll = mescroll
				}
				Vue.gd.uniRequest({
					url: 'card/list',
					isGet: true,
					data: {
						page: pageNum,
						limit: pageSize
					}
				}).then(res => {
					let curPageData = res.data.map(item => {
						item['updatedAt'] = Vue.gd.smartTime(item['updatedAt'])
						return item
					})
					let hasNext = res.data.length >= 8
					
					//设置列表数据
					if(mescroll.num == 1) vx.cardLists = []; //如果是第一页需手动置空列表
					vx.cardLists = vx.cardLists.concat(curPageData); //追加新数据
					mescroll.endSuccess(curPageData.length, hasNext); 
				}).catch(err => {
					mescroll.endDownScroll()
					mescroll.hideUpScroll()
					mescroll.showEmpty()
					mescroll.endErr()
				})
				
			},
			getAllCards() {
				this.downCallback(this.mescroll)
			},
			goAddCard() {
				let isLogin = this.$store.state.accessToken ? true : false
				// #ifdef H5
				isLogin = true
				// #endif
				if (isLogin) {
					uni.navigateTo({
						url: '/pages/websecret/addinfo/addinfo'
					})
				} else {
					uni.navigateTo({
						url: '/pages/sendcode/sendcode'
					})
				}
				
			},

			// 点击卡片去详情页
			goCardDetail(e) {
				const id = e.id
				uni.navigateTo({
					url: '/pages/websecret/detail/detail?oid=' + id
				})
			},

			// 删除卡片
			deleteCard(id) {
				const vx = this
				this.$gd.uniRequest({
					url: 'card/delete',
					isGet: true,
					data: {
						id
					}
				}).then(res => {
					if (res.success) {
						vx.cardLists = vx.cardLists.filter(item => item.id != id)
					}
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
		border-radius: 50% !important;
		overflow: hidden;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
		border: none;
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
		height: auto;
		line-height: 1.5;
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
		display: inline-block;
		width: 500rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: left;
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
