<template>
	<view class="animation-element-wrapper" :animation="animation" :style="{visibility: show ? 'visible':'hidden'}" @tap="_cancel">
		<view class="animation-element" @tap.stop>
			<text class="left-bt" @tap.stop="_cancel">取消</text>
			<text class="right-bt" @tap.stop="_sure" data-type="sure">确定</text>
			<view class="line"></view>

			<picker-view indicator-style="height: 50rpx;" :value="value" @change="bindChange" @tap.stop>
				<!--省-->
				<picker-view-column>
					<view v-for="item in provinces" :key="item.name">
						{{item.name}}
					</view>
				</picker-view-column>
				<!--地级市-->
				<picker-view-column>
					<view v-for="item in citys" :key="item.name">
						{{item.name}}
					</view>
				</picker-view-column>
				<!--区县-->
				<picker-view-column>
					<view v-for="item in countys" :key="item.name">
						{{item.name}}
					</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'areaPicker',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			animation: {
				type: Object,
				default: function() {
					return {}
				}
			},
			value: {
				type: Array,
				default: function() {
					return [0, 0, 0]
				}
			},

			provinces: {
				type: Array,
				default: function() {
					return []
				}
			},
			citys: {
				type: Array,
				default: function() {
					return []
				}
			},
			countys: {
				type: Array,
				default: function() {
					return []
				}
			},
		},
		methods: {
			//隐藏picker-view
			_cancel(e) {
				this.$emit('hidden', e)
			},
			_sure(e) {
				this.$emit('hidden', e, true)
			},
			//滑动事件
			bindChange: function(e) {
				this.$emit('change', e)
			}
		}
	}
</script>

<style scoped>
	.infoText {
		margin-top: 20rpx;
		text-align: center;
		width: 100%;
		justify-content: center;
	}

	.centerText {
		margin-top: 100rpx;
		width: 100%;
		text-align: center;
	}

	/* --------------分割线------------- */

	picker-view {
		background-color: white;
		padding: 0;
		width: 100%;
		height: 380rpx;
		bottom: 0;
		position: fixed;
	}

	picker-view-column view {
		vertical-align: middle;
		font-size: 28rpx;
		line-height: 28rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.animation-element-wrapper {
		display: flex;
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0);
	}

	.animation-element {
		display: flex;
		position: fixed;
		width: 100%;
		height: 470rpx;
		bottom: 0;
		background-color: rgba(255, 255, 255, 1);
	}

	.animation-button {
		margin-top: 20rpx;
		top: 20rpx;
		width: 400rpx;
		height: 100rpx;
		line-height: 100rpx;
		align-items: center;
	}


	.animation-element text {
		color: #999999;
		display: inline-flex;
		position: fixed;
		margin-top: 20rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		font-size: 34rpx;
		font-family: Arial, Helvetica, sans-serif;
	}

	.left-bt {
		left: 30rpx;
	}

	.right-bt {
		right: 30rpx;
	}

	.line {
		display: block;
		position: fixed;
		height: 1rpx;
		width: 100%;
		margin-top: 89rpx;
		background-color: #eeeeee;
	}
</style>
