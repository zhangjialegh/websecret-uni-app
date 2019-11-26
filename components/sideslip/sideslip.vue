<template>
	<movable-area class="side">
		<movable-view ref="movableview" class="side__view" :style="{width: viewWidth + 'px'}" @change="change" @touchend="touchend" direction="horizontal" :x="move">
			<view class="side__con"><slot></slot></view>
			<view class="side__opt" :class="[item.type]" :data-event="item.event" @tap.stop="operate" :style="{width: (item.width === 'max' ? 100 : 80) + 'px'}" v-for="(item, index) in options" :key="item.text+index"><text>{{item.text}}</text></view>
		</movable-view>
	</movable-area>
</template>

<script>
export default {
	props: {
		options: {
			type: Array,
			default: function () {
				return []
			}
		}
	},
	data() {
		return {
			x: 0,
			move: 0,
			open: false,
			viewWidth: 0
		}
	},
	watch: {},
	created() {
		
	},
	mounted() {
		let { windowWidth } = uni.getSystemInfoSync()
		let viewWidth = windowWidth || 375
		this.options.forEach(item => {
			viewWidth += (item.width === 'max' ? 100 : 80)
		})
		this.viewWidth = viewWidth
		this.deleteBtnWidth = ((windowWidth || 375) / 375) * (viewWidth - (windowWidth || 375))
	},
	methods: {
		/**
		 * 事件
		 */
		operate(e) {
			this.move = 0
			this.open = false
			const {event} = e.currentTarget.dataset
			this.$emit(event)
		},
		/**
		 * movable-view 滚动监听
		 */
		change(e) {
			this.x = e.detail.x
		},
		/**
		 * movable-view 触摸结束事件
		 */
		touchend() {
			let diff = this.x

			if (!this.open) {
				if (diff < -20) {
					this.move = -this.deleteBtnWidth
					this.open = true
				} else {
					this.move = 0
					this.open = false
				}
			} else {
				if (diff > -this.deleteBtnWidth + 20) {
					this.move = 0
					this.open = false
				} else {
					this.move = -this.deleteBtnWidth
					this.open = true
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.side {
	width: 100vw;
	height: initial;
	position: relative;
	overflow: hidden;

	&__view {
		height: initial;
		display: flex;
		position: relative;
	}

	&__con {
		flex: 1;
	}

	&__opt {
		position: relative;
		width: 80px;
		background: #cfcfcf;
		font-size: 34rpx;
		color: #ffffff;
		&.warn {
			background: red;
		}
		text {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>
