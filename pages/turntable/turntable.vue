<template>
	<view class="gb-turntable">
	  <view class="gb-turntable-container" :animation="animation">
	    <canvas style="width: 300px;height: 300px;" canvas-id="turntable"></canvas>
		<cover-view class="gb-turntalbe-list">
			<cover-view class="gb-turntable-item" v-for="item in tables" :key="item.text">
				<cover-view class="span" :style="{transform: 'rotate('+item.rotate +'deg)'}">
					<cover-view v-if="!item.img">{{item.text}}</cover-view>
					<cover-image v-if="item.img" class="img" :src="item.img"></cover-image>
				</cover-view>
			</cover-view>
		</cover-view>
	  </view>
	  <cover-view class="gb-turntable-btn" @tap="getPrize">抽奖</cover-view>
	</view>
</template>

<script>
	let deg = 0
	const datas = [{
            text: '1元红包',
            img: '/static/logo.png'
          }, {
            text: '2元红包'
          }, {
            text: '3元红包'
          }, {
            text: '显示器',
            img: '/static/2048.jpg'
          }, {
            text: '5元红宝'
          }, {
            text: '6元红宝'
          }]
	export default {
		data() {
			return {
				animation: {},
				tables: [],
				angel: 0
			};
		},
		onReady() {
			this.draw(datas)
		},
		methods: {
			getPrize() {
				const vx = this
				const num = Math.random() * 6 >>> 0
				const len = this.tables.length
				deg = deg + (360 - deg % 360) + (360*10 - num * (360/len))
				const Ani = wx.createAnimation({
					duration: 6000,
					timingFunction: 'linear',
					delay: 0
				})
				Ani.rotate(deg).step()
				this.animation = Ani.export()
				setTimeout(function() {
					console.log(vx.tables[num].text)
				}, 6000);
			},
			draw(datas) {
				const num = datas.length
				const rotateDeg = 360 / num / 2 + 90
				const turnNum = 1 / num * 360
				const ctx = uni.createCanvasContext('turntable')
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
				  if (i % 2 == 0) {
				    ctx.fillStyle = '#ffb820';
				  } else {
				    ctx.fillStyle = '#ffcb3f';
				  }
				
				  // 填充扇形
				  ctx.fill();
				  // 绘制边框
				  ctx.lineWidth = 0.5;
				  ctx.strokeStyle = '#e4370e';
				  ctx.stroke();
				
				  // 恢复前一个状态
				  ctx.restore();
				  datas[i].rotate = i * turnNum
				  if ((i + 1) === num) {
				    this.tables = datas
				  }
				}
			}
		}
	}
</script>

<style lang="scss">
@charset "UTF-8";

$base: #E44025;

.gb-turntable{
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 16px solid $base;
  box-sizing: content-box;
  box-shadow: 0 2px 3px #333,
              0 0 2px #000;
}
.gb-turntable-container{
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
.gb-turntable-container canvas{
  width: inherit;
  height: inherit;
  border-radius: 50%;
}
.gb-turntalbe-list{
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;
  z-index: 2;
}
.gb-turntable-item{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: #e4370e;
  font-weight: bold;
  text-shadow: 0 1px 1px rgba(255,255,255,.6);
}
.gb-turntable-item .span{
  position: relative;
  display: block;
  padding-top: 20px;
  /* width: 50px; */
  margin: 0 auto;
  text-align: center;
  -webkit-transform-origin: 50% 150px;
  -ms-transform-origin: 50% 150px;
      transform-origin: 50% 150px;
}
.gb-turntable-item .img {
display: inline-block;
  width: 50px;
  height: 50px;;
}

.gb-turntable-btn{
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
  text-shadow: 0 -1px 1px rgba(0,0,0,.6);
  box-shadow: 0 3px 5px rgba(0,0,0,.6);
  text-decoration: none;
}
.gb-turntable-btn::after{
  position: absolute;
  display: block;
  content: '';
  left: 10px;
  top: -46px;
  width: 0;
  height: 0;
  overflow: hidden;
  border-width: 30px;
  border-style: solid;
  border-color: transparent;
  border-bottom-color: $base;
}
.gb-turntable-btn.disabled{
    pointer-events: none;
    background: #B07A7B;
    color: #ccc;
}
.gb-turntable-btn.disabled::after{
  border-bottom-color: #B07A7B;
}

.gb-run{
    transition: all 6s ease;
}
</style>
