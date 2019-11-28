<template>
	<view class="movable-area" @touchmove.prevent.stop>
		<view class="movable-view" :data-id="item.id" :style="{left: item.left+'px',top: item.top+'px', width: 2*(item.x - item.left)+'px', height: 2*(item.y - item.top)+'px', transform:'scale('+item.scale+') rotate('+item.angle+'deg)'}"
		 v-for="item in imgs" :key="item.id" @touchstart="handleImgStart" @touchmove="handleImgMove">
			<image :src="item.url" mode="aspectFit"></image>
			<view class="rotate-tool iconfont icon-drag" :data-id="item.id" :style="{transform:'scale('+ (1/item.scale) +')'}" @touchstart.stop="handleImgTranStart" @touchmove.stop="handleImgTranMove"></view>
			<view class="rotate-tool iconfont icon-close" :data-id="item.id" :style="{transform:'scale('+ (1/item.scale) +')'}" @tap.stop="handleImgClose"></view>
		</view>

		<view class="movable-view" :data-id="item.id" :style="{left: item.left+'px',top: item.top+'px', width: (item.width)+'px', height: (item.height)+'px', lineHeight: item.lineHeight + 'px'}"
		 v-for="item in fonts" :key="item.id" @touchstart="handleFontStart" @touchmove="handleFontMove">
			<text>{{item.text}}</text>
			<view class="rotate-tool iconfont icon-drag" :data-id="item.id" @touchstart.stop="handleFontScaleStart" @touchmove.stop="handleFontScaleMove"></view>
		</view>


		<button type="primary" @tap="handleDraw">提交</button>
	</view>
</template>

<script>
	let index = 0
	export default {
		data() {
			return {
				imgs: [{
					id: 1,
					url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/github.svg',
					top: 0,
					left: 0,
					x: 50,
					y: 50,
					width: 100,
					height: 100,
					scale: 1,
					angle: 0,
					rotate: 0,
					active: false
				}, {
					id: 2,
					url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/doc/github.svg',
					top: 0,
					left: 0,
					x: 50,
					y: 50,
					width: 100,
					height: 100,
					scale: 1,
					angle: 0,
					rotate: 0,
					active: false
				}],
				fonts: [{
					id: 1,
					top: 0,
					left: 0,
					width: 100,
					height: 100,
					lineHeight: 20,
					text: '经常会因为某些端的流量不大，就一直拖延无法让那些用户享受到最新服务。另外登陆支付在客户端部分，已经被uni-app统一成一样的api了',
					active: false
				}]
			};
		},
		methods: {
			handleImgStart(e) {
				let items = this.imgs.slice()
				for (let i = 0; i < items.length; i++) {
					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						index = i
						items[index].active = true
					}
				}
				items[index].lx = e.touches[0].clientX
				items[index].ly = e.touches[0].clientY
				this.imgs = items
			},
			handleImgMove(e) {
				let items = this.imgs.slice()
				//移动时的坐标值也写图片的属性里
				items[index]._lx = e.touches[0].clientX;
				items[index]._ly = e.touches[0].clientY;

				//追加改动值
				items[index].left += items[index]._lx - items[index].lx; // x方向
				items[index].top += items[index]._ly - items[index].ly; // y方向
				items[index].x += items[index]._lx - items[index].lx;
				items[index].y += items[index]._ly - items[index].ly;

				//把新的值赋给老的值
				items[index].lx = e.touches[0].clientX;
				items[index].ly = e.touches[0].clientY;
				this.imgs = items
			},
			handleImgTranStart(e) {
				let items = this.imgs.slice()
				//找到点击的那个图片对象，并记录
				for (let i = 0; i < items.length; i++) {
					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						index = i;
						items[index].active = true;
					}
				}
				//获取作为移动前角度的坐标
				items[index].tx = e.touches[0].clientX;
				items[index].ty = e.touches[0].clientY;
				//移动前的角度
				items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
				//获取图片半径
				items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top)
				this.imgs = items
			},
			handleImgTranMove(e) {
				let items = this.imgs.slice()
				//记录移动后的位置
				items[index]._tx = e.touches[0].clientX;
				items[index]._ty = e.touches[0].clientY;
				//移动的点到圆心的距离  * 因为圆心的坐标是相对与父元素定位的 ，所有要减去父元素的OffsetLeft和OffsetTop来计算移动的点到圆心的距离
				items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx + 2, items[index]._ty + 2)

				items[index].scale = items[index].disPtoO / items[index].r; //手指滑动的点到圆心的距离与半径的比值作为图片的放大比例
				items[index].oScale = 1 / items[index].scale; //图片放大响应的右下角按钮同比缩小

				//移动后位置的角度
				items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
				//角度差
				items[index].new_rotate = items[index].angleNext - items[index].anglePre;

				//叠加的角度差
				items[index].rotate += items[index].new_rotate;
				items[index].angle = items[index].rotate; //赋值

				//用过移动后的坐标赋值为移动前坐标
				items[index].tx = e.touches[0].clientX;
				items[index].ty = e.touches[0].clientY;
				items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
				this.imgs = items
			},
			countDeg(x1, y1, x2, y2) {
				const distY = (y2 - y1); //opposite
				const distX = (x2 - x1); //adjacent
				const dist = Math.sqrt((distY * distY) + (distX * distX)); //hypotenuse, 
				//don't know if there is a built in JS function to do the square of a number
				const val = Math.abs(distX) / dist;
				const aSine = Math.asin(val);
				if (x2 < x1) {
					if (y2 < y1) {
						return 360 - (aSine * 180 / Math.PI)
					} else {
						return (aSine * 180 / Math.PI) + 180
					}
				} else {
					if (y2 < y1) {
						return (aSine * 180 / Math.PI)
					} else {
						return 180 - (aSine * 180 / Math.PI)
					}
				}
			},
			getDistancs(x, y, x1, y1) {
				let dx = Math.abs(x - x1)
				let dy = Math.abs(y - y1)
				return Math.sqrt(dx * dx + dy * dy)
			},
			handleFontStart(e) {
				let items = this.fonts.slice()
				for (let i = 0; i < items.length; i++) {
					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						index = i
						items[index].active = true
					}
				}
				items[index].lx = e.touches[0].clientX
				items[index].ly = e.touches[0].clientY
				this.fonts = items
			},
			handleFontMove(e) {
				let items = this.fonts.slice()
				//移动时的坐标值也写图片的属性里
				items[index]._lx = e.touches[0].clientX;
				items[index]._ly = e.touches[0].clientY;

				//追加改动值
				items[index].left += items[index]._lx - items[index].lx; // x方向
				items[index].top += items[index]._ly - items[index].ly; // y方向
				items[index].x += items[index]._lx - items[index].lx;
				items[index].y += items[index]._ly - items[index].ly;

				//把新的值赋给老的值
				items[index].lx = e.touches[0].clientX;
				items[index].ly = e.touches[0].clientY;
				this.fonts = items
			},
			handleFontScaleStart(e) {
				let items = this.fonts.slice()
				//找到点击的那个图片对象，并记录
				for (let i = 0; i < items.length; i++) {
					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						index = i;
						items[index].active = true;
					}
				}
				//获取作为移动前角度的坐标
				items[index].tx = e.touches[0].clientX;
				items[index].ty = e.touches[0].clientY;
				items[index].dx = 0;
				items[index].dy = 0;
				items[index]._w = items[index].width;
				items[index]._h = items[index].height;
				//移动前的角度
				this.fonts = items
			},
			handleFontScaleMove(e) {
				let items = this.fonts.slice()
				//记录移动后的位置
				items[index]._tx = e.touches[0].clientX;
				items[index]._ty = e.touches[0].clientY;
				items[index].dx = items[index]._tx - items[index].tx
				items[index].dy = items[index]._ty - items[index].ty
				items[index].width = items[index].dx + items[index]._w
				items[index].height = items[index].dy + items[index]._h
				this.fonts = items
			},
			handleImgClose (e) {
				let items = this.imgs.slice()
				for (let i = 0; i < items.length; i++) {
					console.log(e.currentTarget.dataset.id)
					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						items.splice(i, 1)
					}
				}
				this.imgs = items
			},


			handleDraw() {
				const vx = this
				this.$gd.uniRequest({
					url: 'cornucopia/draw',
					isGet: false,
					data: {
						drawData: {
							global: {
								width: vx.$store.state.system.windowWidth,
								height: vx.$store.state.system.windowHeight,
								url: 'https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/00/03/ChMkJlfJVjiIQ2xxAA3GHTKMZEwAAU98gLJBoEADcY1359.jpg'
							},
							imgs: vx.imgs,
							fonts: vx.fonts
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.movable-area {
		width: 100vw;
		height: 100vh;
		background: url(https://sjbz-fd.zol-img.com.cn/t_s320x510c/g5/M00/00/03/ChMkJlfJVjiIQ2xxAA3GHTKMZEwAAU98gLJBoEADcY1359.jpg) no-repeat center center;
		background-size: 100% 100%;

		.movable-view {
			position: absolute;

			>.rotate-tool {
				position: absolute;
				width: 20px;
				height: 20px;
				font-size: 20px;
				&.icon-drag {
					bottom: -10px;
					right: -10px;
				}
				&.icon-close {
					top: -10px;
					left: -10px;
				}
			}

			>image {
				width: 100%;
				height: 100%;
			}

			>text {
				display: inline-block;
				width: 100%;
				height: 100%;
				overflow: hidden;
			}
		}
	}
</style>
