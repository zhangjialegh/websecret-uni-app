<template>
	<view class="movable-area" @touchmove.stop.prevent @touchstart="handleAreaStart">

		<!-- 图片组合区域 -->
		<view class="movable-view-box" :style="{width: bgWidth + 'px',height:bgHeight+'px'}">
			<view class="bg-notice-text">
				<view>点击添加背景图片</view>
			</view>
			<image :src="bg" mode="scaleToFill" class="fit-bg" v-if="bg"></image>
			<image mode="scaleToFill" class="fit-bg" v-if="!bg" @tap="getBackgroundImage"></image>
			<view class="movable-view" :class="{active: item.active}" :data-id="item.id" :style="{left: item.left+'px',top: item.top+'px', width: 2*(item.x - item.left)+'px', height: 2*(item.y - item.top)+'px', transform:'scale('+item.scale+') rotate('+item.angle+'deg)'}"
			 v-for="item in imgs" :key="item.id" @touchstart.stop="handleImgStart" @touchmove.stop="handleImgMove">
				<image :src="item.url" mode="aspectFit"></image>
				<view class="rotate-tool iconfont icon-drag" v-show="item.active" :data-id="item.id" :style="{transform:'scale('+ (1/item.scale) +')'}" @touchstart.stop="handleImgTranStart" @touchmove.stop="handleImgTranMove"></view>
				<view class="rotate-tool iconfont icon-close" v-show="item.active" :data-id="item.id" :style="{transform:'scale('+ (1/item.scale) +')'}" @touchend.stop="handleImgClose"></view>
			</view>
			
			<view class="movable-view" :class="{active: item.active}" :data-id="item.id" :style="{left: item.left+'px',top: item.top+'px', width: (item.width)+'px', height: (item.height)+'px'}"
			 v-for="item in fonts" :key="item.id" @touchstart.stop="handleFontStart" @touchmove.stop="handleFontMove">
				<text :style="{fontSize: item.fontSize+'px',lineHeight:item.lineHeight+'px',color:item.color}">{{item.text}}</text>
				<view class="rotate-tool iconfont icon-drag" v-show="item.active" :data-id="item.id" @touchstart.stop="handleFontScaleStart" @touchmove.stop="handleFontScaleMove"></view>
				<view class="rotate-tool iconfont icon-editor" v-show="item.active" :data-id="item.id"  @touchend.stop="editFonts"></view>
				<view class="rotate-tool iconfont icon-close" v-show="item.active" :data-id="item.id" @touchend.stop="handleFontClose"></view>
			</view>
		</view>


         <!-- 底部按钮 -->
		<button plain class="btn right" @tap="handleDraw">预览图片</button>
		<view class="picachu-box" @tap="getImgs">
			<view class="tietu-wrap">
				<view class="label">
					插图
				</view>
				<image src="/static/pikachu.png" mode="aspectFill"></image>
			</view>
		</view>
		<button plain class="btn left" @tap="getFonts">加文字</button>
		<view class="replace-pic-box" @tap="getBackgroundImage" v-if="bg">
			<view class="tupian-box">
				<view class="iconfont icon-pic"></view>
			</view>
			<view class="iconfont icon-turn"></view>
		</view>
		
		<!-- 文本编辑弹框 -->
		<popup :animation="true" ref="popup" type="bottom" :maskClick="true">
			<view class="popup-wrap">
				<view class="popup-top">
					<view class="iconfont icon-close" @tap="handleCloseMask"></view>
				</view>
				<view class="popup-textarea">
					<textarea v-show="!showColorPicker" :value="text" :style="{'fontSize': size + 'px', color: color}" placeholder="请输入内容" :fixed="true" @input="handleInput"/>
				</view>
				<view class="popup-bottom">
					<view class="color-box" @tap="handleShowColorPicker">
						<view class="color" :style="{background: color}"></view>
					</view>
					<view class="size-box">
						<slider :max="40" :min="12" :step="1" :value="size" :block-size="16" :show-value="true" @change="handleSlider"/>
					</view>
					<view class="btn-box">
						<button plain class="popup-btn" @tap="handleTextSure">确定</button>
					</view>
				</view>
			</view>
		</popup>
		
		<!-- 颜色选取弹框 -->
		<colorpicker :defaultColor="color" :isShow="showColorPicker" :bottom="0" @callback="handleColorPicker"></colorpicker>
		
	</view>
</template>

<script>
	import popup from '@/components/popup/popup.vue'
	import colorpicker from '@/components/colorpicker/colorpicker.vue'
	let index = 0
	let targetId = 1
	const defaultColor = '#333333'
	const defaultSize = 14
	export default {
		components: {popup,colorpicker},
		data() {
			return {
				windowHeight: 0,
				windowWidth: 0,
				imgs: [],
				fonts: [],
				bg: '',
				bgWidth: 375,
				bgHeight: 667,
				text: '',
				color: defaultColor,
				size: defaultSize,
				showColorPicker: false,
				checkAddFont: false
			};
		},
		onLoad() {
			let system = null
			if (this.$store.state.system) {
				system = this.$store.state.system
			} else {
				system = uni.getSystemInfoSync()
			}
			this.windowWidth = system.windowWidth
			this.windowHeight = system.windowHeight
			// #ifdef H5
			this.windowHeight = system.windowHeight - 44
			// #endif
		},
		methods: {
			handleAreaStart (e) {
				let items = this.imgs.slice()
				for (let i = 0; i < items.length; i++) {
					items[i].active = false;
				}
				let fonts = this.fonts.slice()
				for (let i = 0; i < fonts.length; i++) {
					fonts[i].active = false;
				}
				this.imgs = items
				this.fonts = fonts
			},
			handleImgStart(e) {
				let items = this.imgs.slice()
				for (let i = 0; i < items.length; i++) {
					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						index = i
						items[index].active = true
					}
				}
				let fonts = this.fonts.slice()
				for (let i = 0; i < fonts.length; i++) {
					fonts[i].active = false;
				}
				items[index].lx = e.touches[0].clientX
				items[index].ly = e.touches[0].clientY
				this.imgs = items
				this.fonts = fonts
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
				let imgs = this.imgs.slice()
				for (let i = 0; i < imgs.length; i++) {
					imgs[i].active = false;
				}
				items[index].lx = e.touches[0].clientX
				items[index].ly = e.touches[0].clientY
				this.fonts = items
				this.imgs = imgs
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
               					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						items.splice(i, 1)
					}
				}
				this.imgs = items
			},
			editFonts (e) {
				let items = this.fonts.slice()
				for (let i = 0; i < items.length; i++) {
					items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						index = i
						console.log(items[i] ,'item')
						items[i].active = true
						this.text = items[i].text
						this.color = items[i].color
						this.size = items[i].fontSize
					}
				}
				console.log(this.color, this.size, this.text, e, 'edit')
				this.$refs.popup.open()
			},
			handleFontClose (e) {
				let items = this.fonts.slice()
				for (let i = 0; i < items.length; i++) {
								items[i].active = false;
					if (e.currentTarget.dataset.id == items[i].id) {
						items.splice(i, 1)
					}
				}
				this.fonts = items
			},
			handleInput (e) {
				this.text = e.detail.value
			},
			handleTextSure () {
				if(!this.text.trim()) {
					this.$gd.uniToast({
						title: '内容不能为空'
					})
					return
				}
				if (this.checkAddFont) {
					this.addFonts({
						size: this.size,
						color: this.color,
						text: this.text
					})
				} else {
					let items = this.fonts.slice()
					items[index].active = true
					items[index].fontSize = this.size
					items[index].lineHeight = 1.5*this.size
					items[index].color = this.color
					items[index].text = this.text
					this.fonts = items
				}
				this.handleCloseMask()
			},
			handleCloseMask () {
				this.$refs.popup.close()
			},
			handleShowColorPicker () {
				this.showColorPicker = true
			},
			handleColorPicker (color) {
				this.showColorPicker = false
				/* 判断颜色值是否有效 */
				if(color){
					this.color = color
				}
			},
			handleSlider (e) {
				this.size = e.detail.value
			},
			addImgs (img) {
				this.imgs.push({
					id: targetId++,
					url: img.url,
					top: 0,
					left: 0,
					x: 50,
					y: img.height*50/img.width,
					width: 100,
					height: img.height*100/img.width,
					scale: 1,
					angle: 0,
					rotate: 0,
					active: false
				})
			},
			addFonts (font) {
				this.fonts.push({
					id: targetId++,
					top: 0,
					left: 0,
					width: 120,
					height: 120,
					lineHeight: (font.size || defaultSize)*1.5,
					fontSize: font.size || defaultSize,
					color: font.color || defaultColor,
					text: font.text,
					active: false
				})
				this.checkAddFont = false
			},
			async getBackgroundImage () {
				const vx = this
				const img = await this.chooseImage()
				const bgRatio = img.height / img.width
				const ratio = this.windowHeight / this.windowWidth
				if (bgRatio > ratio) {
					this.bgHeight = this.windowHeight
					this.bgWidth = this.windowHeight / bgRatio
				} else {
					this.bgWidth = this.windowWidth
					this.bgHeight = this.windowWidth * bgRatio
				}
				this.bg = img.url
			},
			async getImgs () {
				const img = await this.chooseImage()
				this.addImgs(img)
			},
			getFonts () {
				this.color = defaultColor
				this.size = defaultSize
				this.text = ''
				this.checkAddFont = true
				this.$refs.popup.open()
			},
			chooseImage () {
				return new Promise((resolve, reject) => {
					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						success: (res) => {
							const path = res.tempFilePaths[0]
							uni.getImageInfo({
								src: path,
								success: function (res) {
									resolve({
										url: res.path,
										width: res.width,
										height: res.height
									})
								},
								fail: function (err) {
									reject(err)
								}
							})
						},
						fail: function (err) {
							reject(err)
						}
					})
				})
			},
			handleDraw() {
				if (!this.bg) {
					this.$gd.uniToast({
						title: '请先选择一张背景图',
						icon: 'none'
					})
				} else {
					this.$store.commit('setPreviewInfo', {
						global: {
							width: this.bgWidth,
							height: this.bgHeight,
							url: this.bg
						},
						imgs: this.imgs,
						fonts: this.fonts
					})
					uni.navigateTo({
						url: '/pages/puzzle/canvas/canvas'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.movable-area {
		width: 100vw;
		height: 100vh;
		background-color: #EFEFEF;
		overflow: hidden;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		display: flex;
		justify-content: center;
		align-items: center;
		.movable-view-box {
			background-repeat: no-repeat;
			background-position: center center;
			background-size: 100% 100%;
			position: relative;
			z-index: 0;
			> .bg-notice-text {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 0;
				display: flex;
				justify-content: center;
				align-items: center;
				> view {
					padding: 30rpx;
					border: 1px solid #E0E0E0;
					color: #C0C0C0;
				}
			}
			> .fit-bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
			}
		}
		.movable-view {
			position: absolute;
			z-index: 2;
			&.active {
				&::after {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					border: 1rpx solid #E5E5E5;
				}
			}

			>.rotate-tool {
				position: absolute;
				width: 20px;
				height: 20px;
				font-size: 20px;
				color: #4a4a4a;
				z-index: 3;
				&.icon-drag {
					bottom: -10px;
					right: -10px;
				}
				&.icon-close {
					top: -10px;
					left: -10px;
				}
				&.icon-editor {
					top: -10px;
					right: -10px;
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
		.replace-pic-box {
			width: 80rpx;
			height: 80rpx;
			position: absolute;
			top: 30rpx;
			right: 30rpx;
			> .tupian-box {
				width: 100%;
				height: 100%;
				border-radius: 40rpx;
				overflow: hidden;
				background-color: rgba(255,255,255,0.6);
				line-height: 70rpx;
				color: #009480;
				box-shadow: 0 0 5px 3px rgba(0,0,0,0.1);
				display: flex;
				justify-content: center;
				align-items: center;
				> .icon-pic {
					font-size: 30px;
				}
			}
			> .icon-turn {
				position: absolute;
				bottom: -5rpx;
				right: 0;
				color: #009480;
				font-weight: bold;
				font-size: 16px;
				background-color: #fff;
				border-radius: 50%;
			}
		}
		.picachu-box {
			// width: 80px;
			// height: 80px;
			position: absolute;
			bottom: 0rpx;
			left: 50%;
			transform: translateX(-50%);
			// border: none;
			// border-radius: 50%;
			// box-shadow: 0 0 5px 3px rgba(0,0,0,0.1);
			.picachu-btn{
				position: absolute;
				top: 0;
				left: 0;
				.picachu-container {
					transform: scale(0.17);
					left: -185px;
					top: -185px;
				}
			}
			.tietu-wrap {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.label {
					width: 80rpx;
					height: 40rpx;
					background-color: #009480;
					color: #fff;
					position: relative;
					border-radius: 20rpx;
					text-align: center;
					font-size: 24rpx;
					line-height: 40rpx;
					margin-bottom: 15rpx;
					margin-left: 10rpx;
					&::before {
						content: '';
						width: 0;
						height: 0;
						border: 10rpx solid;
						position: absolute;
						bottom: -13rpx;
						left: 10rpx;
						left: 50%;
						transform: translateX(-50%);
						border-color: #009480 transparent transparent;
					}
				}
				> image {
					width: 120px;
					height: 40px;
				}
			}
		}
		.btn {
			width: 180rpx;
			height: 70rpx;
			position: absolute;
			bottom: 30rpx;
			padding: 0;
			border-radius: 35rpx;
			border: none;
			overflow: hidden;
			background-color: rgba(255,255,255,0.6);
			line-height: 70rpx;
			color: #009480;
			font-size: 30rpx;
			box-shadow: 0 0 5px 3px rgba(0,0,0,0.1);
			&.right {
				right: 30rpx;
			}
			&.left {
				left: 30rpx;
			}
		}
		.popup-wrap {
			width: 100%;
			background-color: #FFFFFF;
			padding: 30rpx;
			padding-top: 0;
			> .popup-top {
				width: 100%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 40px;
				> .icon-close {
					font-size: 24px;
					color: #E9E9E9;
				}
			}
			> .popup-textarea {
				width: 100%;
				> textarea {
					line-height: 1.5;
					width: 100%;
					background-color: #EFEFEF;
					padding: 15rpx;
					box-sizing: border-box;
				}
			}
			> .popup-bottom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 25rpx;
				> .color-box {
					.color {
						width: 60rpx;
						height: 35rpx;
					}
				}
				> .size-box {
					flex: 1;
				}
				> .btn-box {
					.popup-btn {
						width: 180rpx;
						height: 70rpx;
						border-radius: 35rpx;
						border: none;
						overflow: hidden;
						line-height: 70rpx;
						color: #fff;
						font-size: 32rpx;
						background-color: #a67e00;
					}
				}
			}
		}
	}
</style>
