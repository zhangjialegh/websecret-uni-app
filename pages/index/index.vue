<template>
	<view class="index-wrap">
		<view class="cloud-back-box">
			<clouds></clouds>
		</view>
		<view class="index-body-wrap">
			<!-- <view class="header ware">

			</view> -->
			<view class="body ware" v-for="grid in gridsData" :key="grid.title">
				<view class="title">
					{{grid.title}}
				</view>
				<uni-grid :column="3">
					<uni-grid-item v-for="item in grid.lists" :key="item.path">
						<view :data-path="item.path" class="grid-item-box" :style="{backgroundImage: item.backgroundImage}" @tap="navigate">
							<view class="grid-item-image">
								<image :src="item.image" mode="aspectFit"></image>
							</view>
							<view class="text" v-if="item.text">
								{{item.text}}
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import clouds from '@/pages/index/cloud.vue'
	export default {
		components: {
			uniGrid,
			uniGridItem,
			clouds
		},
		data() {
			return {
				gridsData: [{
					title: '实用工具',
					id: 1,
					lists: [{
						path: '/pages/websecret/index/index',
						text: '网密',
						image: '/static/websecret.png',
						backgroundImage: ''
					}, {
						path: '/pages/puzzle/index/index',
						text: '拼图',
						image: '/static/movable.png',
						backgroundImage: ''
					}, {
						path: '/pages/weather/weather',
						text: '天气',
						image: '/static/weather.png',
						backgroundImage: ''
					}]
				}]
			}
		},
		onLoad() {
			this.getAllCategory()
		},
		methods: {
			navigate(e) {
				const {
					path
				} = e.currentTarget.dataset
				if (path) {
					uni.navigateTo({
						url: path
					})
				}
			},
			getAllCategory() {
				const vx = this
				const gridsData = this.gridsData.slice()
				this.$gd.uniRequest({
					url: 'cornucopia/congar',
					isGet: true,
					notAuth: true
				}).then(res => {
					if (res.data.length) {
						res.data.forEach(item => {
							gridsData.forEach(grid => {
								if (grid.id === item.id) {
									grid.lists.push(...item.lists)
								} else {
									gridsData.push(item)
								}
							})
						})
						vx.gridsData = gridsData
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-wrap {
		background-color: #f9f9f9;
		width: 100vw;
		position: relative;
		z-index: 0;
		/* #ifndef H5 */
		min-height: 100vh;
		/* #endif */
		/* #ifdef H5 */
		min-height: calc(100vh - 44px);

		/* #endif */
		.cloud-back-box {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		.index-body-wrap {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;
			padding: 0 10rpx;
			padding-top: 15rpx;
			overflow: scroll;
		}

		.ware {
			margin-bottom: 15rpx;
		}

		.header {
			width: 100%;
			border-radius: 15rpx;
			height: 250rpx;
			background-color: var(--base-color);
			overflow: hidden;
		}

		.body {
			width: 100%;
			border-radius: 15rpx;
			background-color: rgba(255, 255, 255, 0.7);

			.title {
				padding: 30rpx;
				color: #4a4a4a;
				font-size: 32rpx;
			}

			.grid-item-box {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				flex: 1;
				position: relative;
				padding: 30rpx 0;

				.grid-item-image {
					width: 50rpx;
					height: 50rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					font-size: 24rpx;
					margin-top: 15rpx;
					color: #4a4a4a;
				}
			}
		}
	}
</style>
