<template>
	<view class='container' v-if="isLoading">
	 <view class='loading-wrapper'>
	   <view class='loading-box'>
	    <loadicon color="#73b9a2" size="large"/>
	   </view>
	 </view>
	</view>
</template>

<script>
	import loadicon from '@/components/loadicon'
	export default {
		components: {loadicon},
		props:{
			show: {
			  type: Boolean,
			  value: false
			}
		},
		data() {
			return {
				isLoading: true
			};
		},
		watch:{
			show: function (show) {
				this.isLoading = show
			}
		}
	}
</script>

<style scoped>
.loading-wrapper {
  position: fixed;
  z-index: 9;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-wrapper .loading-box {
  width: 500rpx;
  height: 500rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  /* transform: translateY(-300rpx) */
}
</style>
