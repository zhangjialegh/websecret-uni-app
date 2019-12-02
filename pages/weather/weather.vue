<template>
	<view class="bgc-w">
		<view class="wt-box">
			<view class="fs28 fcff wt-d" @tap="translate">{{my}}</view>
			<image src="/static/weather/wz.png" class="wz-img" />
		</view>
		<!-- 页面显示天气部分  -->
		<view class="wt-text">
			<view class="fcff">
				{{liveweather.tmp}}℃
			</view>
		</view>
		<view class="mainbox">
			<image v-if="liveweather.cond_code" :src="'/static/weather/'+liveweather.cond_code+'.svg'" class="mainimg" />
		</view>
		<view class="wt-text">
			<view class="fcff">
				{{liveweather.cond_txt}}
			</view>
		</view>
		<!-- 详细信息  -->
		<view class="detbox">
			<!-- 五条数据 -->
			<view class="detlist">
				<view class="fcff fs28 det-tt">湿度</view>
				<view>
					<image src="/static/weather/sd.png" class="detimg" />
				</view>
				<view class="fcff fs28">{{liveweather.hum}}</view>
			</view>
			<!-- 五条数据 -->
			<view class="detlist">
				<view class="fcff fs28 det-tt">降水量</view>
				<view>
					<image src="/static/weather/jstj.png" class="detimg" />
				</view>
				<view class="fcff fs28">{{liveweather.pcpn}}</view>
			</view>
			<!-- 五条数据 -->
			<view class="detlist">
				<view class="fcff fs28 det-tt">风向</view>
				<view>
					<image src="/static/weather/fx.png" class="detimg" />
				</view>
				<view class="fcff fs28">{{liveweather.wind_dir}}</view>
			</view>
			<!-- 五条数据 -->
			<view class="detlist">
				<view class="fcff fs28 det-tt">风力</view>
				<view>
					<image src="/static/weather/fl.png" class="detimg" />
				</view>
				<view class="fcff fs28">{{liveweather.wind_sc}}</view>
			</view>
			<!-- 五条数据 -->
			<view class="detlist">
				<view class="fcff fs28 det-tt">风速</view>
				<view>
					<image src="/static/weather/fs.png" class="detimg" />
				</view>
				<view class="fcff fs28">{{liveweather.wind_spd}}</view>
			</view>
			<view class="clear"></view>
		</view>
		<!-- 未来三天天气  -->
		<view class="threebox">
			<!-- 三天 -->
			<view class="threelist fcff fs30">
				<view class="leftbox" v-if="three[0]">今天 {{three[0].date}}</view>
				<view class="centerbox">
					<view class="dp-ib threeimgbox">
						<image v-if="three[0] && three[0].cond_code_d" :src="'/static/weather/'+three[0].cond_code_d+'.svg'" class="detimg threeimg" />
						<view class="dp-ib threetext" v-if="three[0]">
							{{three[0].cond_txt_d}}
						</view>
					</view>
				</view>
				<view class="rightbox" v-if="three[0]">{{three[0].tmp_min}}℃ ~ {{three[0].tmp_max}}℃</view>
			</view>
			<!-- 三天 -->
			<view class="threelist fcff fs30">
				<view class="leftbox" v-if="three[1]">明天 {{three[1].date}}</view>
				<view class="centerbox">
					<view class="dp-ib threeimgbox">
						<image v-if="three[1] && three[1].cond_code_d" :src="'/static/weather/'+three[1].cond_code_d+'.svg'" class="detimg threeimg" />
						<view class="dp-ib threetext" v-if="three[1]">
							{{three[1].cond_txt_d}}
						</view>
					</view>
				</view>
				<view class="rightbox" v-if="three[1]">{{three[1].tmp_min}}℃ ~ {{three[1].tmp_max}}℃</view>
			</view>
			<!-- 三天 -->
			<view class="threelist fcff fs30">
				<view class="leftbox" v-if="three[2]">后天 {{three[2].date}}</view>
				<view class="centerbox">
					<view class="dp-ib threeimgbox">
						<image v-if="three[2] && three[2].cond_code_d" :src="'/static/weather/'+three[2].cond_code_d+'.svg'" class="detimg threeimg" />
						<view class="dp-ib threetext" v-if="three[2]">
							{{three[2].cond_txt_d}}
						</view>
					</view>
				</view>
				<view class="rightbox" v-if="three[2]">{{three[2].tmp_min}}℃ ~ {{three[2].tmp_max}}℃</view>
			</view>
		</view>
		<!--  定位地址  -->
		<area-picker :show="show" :animation="animated" :provinces="provinces" :citys="citys" :countys="countys" :value="value"
		 @hidden="hiddenFloatView" @change="bindChange"></area-picker>
		 
		 <!-- 加载组件 -->
		 <loadingpage :show="isLoading"></loadingpage>
	</view>
</template>

<script>
	import model from '@/common/area.js'
	import areaPicker from '@/pages/weather/area.vue'
	import loadingpage from '@/components/loadingpage/loadingpage.vue'
	export default {
		components: {
			areaPicker,
			loadingpage
		},
		data() {
			return {
				show: false,
				animated: null,
				provinces: [],
				citys: [],
				countys: [],
				value: [0, 0, 0],
				my: "未知",
				isLoading: true,
				liveweather: {
				
				},
				three: [
					{}
				]
			};
		},
		onLoad() {
			this.init()
		},
		onReady(e) {
			const vx = this
			model.updateAreaData(this, 0, e, (res) => {
				vx.animated = res.animated
				vx.show = res.show
				vx.provinces = res.provinces
				vx.citys = res.citys
				vx.countys = res.countys
				vx.value = res.value
			});
		},
		methods: {
			init() {
				const vx = this;
				// #ifndef H5
				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						const latitude = res.latitude;
						const longitude = res.longitude;
						const location = longitude + ',' + latitude
						vx.getWeatherInfo(location)
					},
					fail: function (err) {
						console.log(err)
					}
				})
				// #endif
				
				// #ifdef H5
				vx.getWeatherInfo('朝阳区')
				// #endif
				
			},
			getWeatherInfo: function(location) {
				const vx = this
				this.$gd.uniAll([{
					url: 'weather/now',
					isGet: true,
					data: {
						location
					}
				}, {
					url: 'weather/forecast',
					isGet: true,
					data: {
						location
					}
				}], {
					notAuth: true
				}).then(res => {
					vx.isLoading = false
					const my = res[0].data.HeWeather6[0].basic.admin_area + " " + res[0].data.HeWeather6[0].basic.parent_city + " " + res[0].data.HeWeather6[0].basic.location
					vx.my = my
					vx.liveweather = res[0].data.HeWeather6[0].now
					vx.three = res[1].data.HeWeather6[0].daily_forecast
				}).catch(() => vx.isLoading = false)
			},
			//点击选择城市按钮显示picker-view
			translate: function(e) {
				const vx = this
				model.animationEvents(this, 0, true, 400, (res) => {
					vx.animated = res.animated
					vx.show = res.show
					vx.provinces = res.provinces
					vx.citys = res.citys
					vx.countys = res.countys
					vx.value = res.value
				});
			},
			//隐藏picker-view
			hiddenFloatView: function(e, sure = false) {
				const vx = this
				model.animationEvents(this, 200, false, 400, (res) => {
					vx.animated = res.animated
					vx.show = res.show
					vx.provinces = res.provinces
					vx.citys = res.citys
					vx.countys = res.countys
					vx.value = res.value
				});
				var length = this.value[2];
				var lengthc = this.value[1];
				var countyCity = this.countys[length].name;
				if (countyCity == "市辖区") {
					countyCity = this.citys[lengthc].name;
				}
				(sure || e.currentTarget.dataset.type === 'sure') && this.getWeatherInfo(countyCity)
			},
			//滑动事件
			bindChange: function(e) {
				const vx = this
				model.updateAreaData(this, 1, e, (res) => {
					vx.animated = res.animated
					vx.show = res.show
					vx.provinces = res.provinces
					vx.citys = res.citys
					vx.countys = res.countys
					vx.value = res.value
				});
			}
		}
	}
</script>

<style scoped>
	.bgc-w {
		background-color: var(--base-color);
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding: 30rpx 2rpx;
	}

	.wt-box {
		position: relative;
		padding-left: 20rpx;
		box-sizing: border-box;
		color: #fff;
	}

	.wt-d {
		box-sizing: border-box;
		padding-left: 40rpx;
	}

	.wz-img {
		width: 35rpx;
		height: 35rpx;
		position: absolute;
		top: 2rpx;
		left: 20rpx;
	}

	.mainbox {
		width: 100%;
		box-sizing: border-box;
		text-align: center;
		color: #fff;
	}

	.mainimg {
		width: 250rpx;
		height: 250rpx;
		margin-top: 30rpx;
	}

	.wt-text {
		text-align: center;
		margin: 20rpx 0rpx;
		padding: 20rpx 0rpx;
		color: #fff;
	}

	.detbox {
		width: 100%;
		box-sizing: border-box;
		margin-top: 60rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #fff;
	}

	.det-tt {
		margin-bottom: 10rpx;
	}

	.detlist {
		box-sizing: border-box;
		text-align: center;
		flex: 1;
	}

	.detimg {
		width: 40rpx;
		height: 40rpx;
		padding: 0rpx 0rpx;
	}

	.threebox {
		width: 100%;
		margin-top: 40rpx;
		box-sizing: border-box;
		padding: 0rpx 40rpx;
		padding-bottom: 50rpx;
		color: #fff;
	}

	.threelist {
		box-sizing: border-box;
		padding: 20rpx 0rpx;
	}

	.leftbox {
		width: 45%;
		text-align: left;
		display: inline-block;
		vertical-align: middle;
		font-size: 32rpx;
	}

	.centerbox {
		width: 20%;
		text-align: center;
		display: inline-block;
		vertical-align: middle;
		font-size: 32rpx;
	}

	.rightbox {
		width: 35%;
		text-align: right;
		display: inline-block;
		vertical-align: middle;
		font-size: 32rpx;
	}

	.threeimgbox {
		position: relative;
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}

	.threeimg {
		width: 40rpx;
		height: 40rpx;
	}

	.threetext {
		box-sizing: border-box;
		padding-left: 8rpx;
	}
	
	.fs28 {
		font-size: 28rpx;
	}
</style>
