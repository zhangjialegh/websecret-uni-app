<template>
	<view class="turn-table-wrap">
		<view class="gb-turntable">
			<view class="gb-turntable-container">
				<canvas style="width: 300px;height: 300px;" canvas-id="turntable"></canvas>
				<view class="gb-turntalbe-list" :animation="animation">
					<image :src="canvasImage" class="canvas-image"></image>
					<view class="gb-turntable-item" v-for="item in tables" :key="item.text">
						<view class="span" :style="{transform: 'rotate('+item.rotate +'deg)'}">
							<view v-if="!item.img">{{item.text}}</view>
							<image v-if="item.img" class="img" :src="item.img"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="gb-turntable-btn" :class="{disabled: touchactive}" @touchstart="touchstart" @touchend="getResult">
				开始
			</view>
			<view class="gb-turntable-btn-after" :class="{disabled: touchactive}"></view>
		</view>
		<view class="record-list-wrap">
			<scroll-view :scroll-into-view="rid" class="record-list" scroll-y :scroll-with-animation="true">
				<view class="record-item" :id="'r'+item.id" :class="{active: ('r'+item.id) === rid}" v-for="item in recordList"
				 :key="item.id">
					<view class="left">
						<text class="num">{{item.id}}</text>
						<text class="name">{{item.name}}</text>
					</view>
					<text class="right">{{item.time}}</text>
				</view>
			</scroll-view>
		</view>

		<button class="to-change-btn" plain hover-class="deep-hover-class" @tap="handleDrawer">
			<text class="iconfont icon-xiugai"></text>
		</button>

		<button v-if="recordList.length" class="clear-records" plain hover-class="deep-hover-class" @tap="clearRecords">
			<text>清空记录</text>
		</button>

		<popup :animation="true" ref="drawer" type="bottom" :maskClick="true">
			<view class="drawer-container">
				<sideslip v-for="(item, index) in cardLists" :key="item.id" @edit="editCard(item)" @remove="deleteCard(item.id)" :options="options">
					<view class="turn-table-card">
						<view class="sort">{{index+1}}</view>
						<text>{{item.text}}</text>
					</view>
				</sideslip>

				<!-- 文本弹框 -->
				<popup :animation="true" ref="popup" type="center" :maskClick="true">
					<view class="turn-table-popup">
						<view class="header" @tap.stop>
							<input type="text" placeholder="请输入内容" :focus="true" :value="value" @input="handleInput" />
						</view>
						<view class="bottom">
							<button plain class="cancel" hover-class="btn-hover-class" @tap.stop="closePop">取消</button>
							<button plain class="confirm" hover-class="btn-hover-class" @tap.stop="confirm">确定</button>
						</view>
					</view>
				</popup>

				<!-- 添加卡片按钮 -->
				<button plain class='add-btn' hover-class="btn-hover-class" @tap='addCard'>
					<text class='iconfont icon-plus'></text>
				</button>
				<!-- 确定修改按钮 -->
				<button class="confirm-btn" plain hover-class="btn-hover-class" @tap="handleSure">
					<text>确定修改</text>
				</button>
			</view>
		</popup>
	</view>
</template>

<script>
	let deg = 0
	let recordId = 1
	const datas = [{
		text: '包子',
		id: 1
	}, {
		text: '面条',
		id: 2
	}, {
		text: '米饭',
		id: 3
	}, {
		text: '火锅',
		id: 4
	}, {
		text: '米线',
		id: 5
	}, {
		text: '汉堡',
		id: 6
	}]
	let Ani = {}
	import popup from '@/components/popup/popup.vue'
	import sideslip from '@/components/sideslip/sideslip.vue'
	export default {
		components: {
			popup,
			sideslip
		},
		data() {
			return {
				animation: {},
				tables: [],
				duration: 2000, //ms
				recordList: [],
				touchactive: false,
				isLock: false,
				rid: '',
				canvasImage: '',
				value: '',
				nid: '',
				edit: false,
				options: [{
						text: '修改',
						event: 'edit'
					},
					{
						text: '删除',
						event: 'remove',
						type: 'warn'
					}
				],
				cardLists: []
			};
		},
		onReady() {
			// this.tables = items
			Ani = uni.createAnimation({
				duration: this.duration,
				timingFunction: 'ease',
				transformOrigin: "50% 50%",
				delay: 0
			})
			
			const items = uni.getStorageSync('turn-tables') || datas
			this.draw(items, this)
		},
		methods: {
			handleDrawer() {
				this.$refs.drawer.open()
				this.cardLists = this.tables.slice()
			},
			addRecord(name) {
				const items = this.recordList.slice()
				items.unshift({
					id: this.$gd.formatNumber(recordId++),
					name: name,
					time: this.$gd.formatTime(Date.now()).split(' ')[1]
				})
				this.recordList = items
				this.rid = 'r' + this.$gd.formatNumber(recordId - 1)
			},
			clearRecords() {
				this.recordList = []
				recordId = 1
			},
			touchstart() {
				this.touchactive = true
			},
			handleCanvas() {
				const vx = this
				uni.canvasToTempFilePath({
					width: 300,
					height: 300,
					canvasId: 'turntable',
					success: function(res) {
						vx.canvasImage = res.tempFilePath
					},
					fail: function(err) {
						console.log(err)
					}
				}, this)
			},
			getResult() {
				this.touchactive = false
				if (this.isLock) return
				this.isLock = true
				const vx = this
				const len = this.tables.length
				const num = Math.random() * len >>> 0
				deg = deg + (360 - deg % 360) + (360 * 10 - num * (360 / len))
				Ani.rotate(deg).step()
				this.animation = Ani.export()
				setTimeout(function() {
					vx.isLock = false
					vx.addRecord(vx.tables[num].text)
				}, this.duration);
			},
			draw(datas, vm) {
				const vx = this
				const num = datas.length
				const rotateDeg = 360 / num / 2 + 90
				const turnNum = 1 / num * 360
				const ctx = uni.createCanvasContext('turntable', vm)
				for (let i = 0; i < num; i++) {
					// 保存当前状态
					ctx.save();
					// 开始一条新路径
					ctx.beginPath();
					// 位移到圆心，下面需要围绕圆心旋转
					ctx.translate(150, 150);
					// 从(0, 0)坐标开始定义一条新的子路径
					ctx.moveTo(0, 0);
					// 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
					ctx.rotate((360 / num * i - rotateDeg) * Math.PI / 180);
					// 绘制圆弧
					ctx.arc(0, 0, 150, 0, 2 * Math.PI / num, false);

					// 颜色间隔
					if (num % 2 === 0) {
						if (i % 2 == 0) {
							ctx.setFillStyle('#ffb820');
						} else {
							ctx.setFillStyle('#ffcb3f');
						}
					} else {
						if (i % 3 == 1) {
							ctx.setFillStyle('#ffb820');
						} else if (i % 3 == 2) {
							ctx.setFillStyle('#ffcb3f');
						} else {
							ctx.setFillStyle('#fac126')
						}
					}
					

					// 填充扇形
					ctx.fill();
					// 绘制边框
					ctx.lineWidth = 0.5;
					ctx.setStrokeStyle('#e4370e');
					ctx.stroke();

					// 恢复前一个状态
					ctx.restore();
					datas[i].rotate = i * turnNum
				}
				ctx.draw(false, function () {
					vx.tables = datas
					vx.handleCanvas()
				})
			},
			handleInput(e) {
				this.value = e.detail.value
			},
			closePop() {
				this.$refs.popup.close()
			},
			confirm() {
				if (this.edit) {
					const items = this.cardLists.slice()
					for (let i = 0; i < items.length; i++) {
						if (items[i].id === this.nid) {
							items[i].text = this.value
						}
					}
					this.cardLists = items
				} else {
					const item = {
						id: Date.now(),
						text: this.value
					}
					this.cardLists.push(item)
				}
				this.closePop()
			},
			// 添加卡片
			addCard() {
				this.edit = false
				this.value = ''
				this.$refs.popup.open()
			},
			// 修改卡片
			editCard(item) {
				this.edit = true
				this.nid = item.id
				this.value = item.text
				this.$refs.popup.open()
			},
			// 删除卡片
			deleteCard(id) {
				this.cardLists = this.cardLists.filter(item => item.id != id)
			},
			handleSure() {
				const vx = this
				uni.setStorage({
					key: 'turn-tables',
					data: this.cardLists,
					success() {
						vx.draw(vx.cardLists, vx)
						vx.$refs.drawer.close()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@charset "UTF-8";
	$base: #E44025;

	.turn-table-wrap {
		padding: 30rpx 0;
		position: relative;
	}

	.gb-turntable {
		position: relative;
		width: 300px;
		height: 300px;
		margin: 0 auto;
		border-radius: 50%;
		border: 10px solid $base;
		box-sizing: content-box;
		overflow: hidden;
		box-shadow: 0 2px 3px #333,
			0 0 2px #000;
	}

	.gb-turntable-container {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		width: inherit;
		height: inherit;
		border-radius: inherit;
		background-clip: padding-box;
		background-color: #ffcb3f;
		-webkit-transition: transform 6s ease;
		transition: transform 6s ease;
	}

	.gb-turntable-container canvas {
		position: absolute;
		top: -400px;
		left: -400px;
	}

	.gb-turntalbe-list {
		position: absolute;
		left: 0;
		top: 0;
		width: inherit;
		height: inherit;
		z-index: 2;

		.canvas-image {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 2;
		}
	}

	.gb-turntable-item {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		color: #e4370e;
		font-weight: bold;
		text-shadow: 0 1px 1px rgba(255, 255, 255, .6);
		z-index: 3;
	}

	.gb-turntable-item .span {
		position: relative;
		display: block;
		padding-top: 20px;
		margin: 0 auto;
		text-align: center;
		transform-origin: 50% 150px;
	}

	.gb-turntable-item .img {
		display: inline-block;
		width: 40px;
		height: 40px;
	}

	.gb-turntable-btn {
		position: absolute;
		left: 110px;
		top: 110px;
		z-index: 3;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		color: #F4E9CC;
		background-color: $base;
		line-height: 80px;
		text-align: center;
		font-size: 20px;
		text-shadow: 0 -1px 1px rgba(0, 0, 0, .6);
		box-shadow: 0 3px 5px rgba(0, 0, 0, .6);
		text-decoration: none;
	}

	.gb-turntable-btn-after {
		position: absolute;
		left: 120px;
		top: 64px;
		width: 0;
		height: 0;
		overflow: hidden;
		border-width: 30px;
		border-style: solid;
		border-color: transparent;
		border-bottom-color: $base;
		z-index: 3;
	}

	.gb-turntable-btn-after.disabled {
		border-bottom-color: #B07A7B;
	}

	.gb-turntable-btn.disabled {
		pointer-events: none;
		background: #B07A7B;
		color: #ccc;
	}

	.record-list-wrap {
		width: 100;
		padding: 30rpx;

		.record-list {
			width: 100%;
			height: 200px;

			.record-item {
				padding: 18rpx 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 33rpx;
				color: #555555;

				&.active {
					color: $base;
				}

				.left {
					display: inline-flex;
					justify-content: flex-start;
					align-items: center;

					.num {
						margin-right: 30rpx;
						font-weight: 600;
					}
				}
			}
		}
	}

	.to-change-btn {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		overflow: hidden;
		background-color: rgba(255, 255, 255, 1);
		box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;

		.iconfont {
			color: $base;
			font-size: 40rpx;
		}
	}

	.clear-records {
		position: fixed;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		height: 80rpx;
		border-radius: 40rpx;
		box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;

		>text {
			color: $base;
			font-size: 32rpx;
		}
	}
	
	.drawer-container {
		background-color: #fff;
		height: calc(100vh - 44px);
		/* #ifdef H5 */
		height: calc(100vh - 84px);
		/* #endif */
		overflow-y: scroll;
	}

	.turn-table-card {
		padding: 15rpx 30rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		&::after {
			position: absolute;
			content: '';
			display: block;
			width: 100%;
			bottom: 0;
			right: 0;
			height: 1rpx;
			background-color: #EFEFEF;
		}
		> .sort {
			font-weight: 500;
			width: 100rpx;
			height: 100rpx;
			text-align: center;
			line-height: 100rpx;
			border-radius: 10rpx;
			overflow: hidden;
			margin-right: 35rpx;
			border: 1rpx solid #EFEFEF;
		}
	}

	.turn-table-popup {
		width: 600rpx;
		border-radius: 10rpx;
		overflow: hidden;
		background-color: #fff;

		.header {
			height: 200rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			input {
				width: 90%;
				border: 0.5rpx solid #eaeaea;
				padding: 15rpx 10rpx;
				border-radius: 5rpx;
				overflow: hidden;
			}
		}

		.bottom {
			height: 100rpx;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-top: 1rpx solid #eaeaea;

			>button {
				flex: 1;
				height: 100%;
				color: #fff;
				font-size: 33rpx;
				border: none;
				border-radius: 0;
				line-height: 100rpx;

				&.cancel {
					color: #444444;
					border-right: 1rpx solid #eaeaea;
				}

				&.confirm {
					background-color: #E44025;
				}
			}
		}
	}

	.add-btn {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 50rpx;
		right: 50rpx;
		background: #E44025 !important;
		border-radius: 50% !important;
		overflow: hidden;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
		border: none;

		&>.iconfont {
			font-size: 26rpx;
			color: #fff;
		}
	}

	.confirm-btn {
		position: fixed;
		bottom: 50rpx;
		left: 50rpx;
		height: 80rpx;
		border-radius: 40rpx;
		box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;

		>text {
			color: #E44025;
			font-size: 32rpx;
		}
	}
</style>
