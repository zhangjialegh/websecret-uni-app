<template>
	<view class="move-wrapper" v-if="show" @tap='goAbout' @longtap='handlelongtap'>
	  <view class='move-box'>
	    <view class='iconfont icon-about'></view>
	  </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				taplock: false
			};
		},
		created () {
			const closeMove = uni.getStorageSync('closeMove')
			if(closeMove) return
			this.show = true
		},
		methods: {
		    goAbout() {
		      if (this.taplock) {
		        this.taplock = false
		        return
		      }
		      uni.navigateTo({
		        url: '/pages/about/about'
		      })
		    },
		    handlelongtap() {
		      const vx = this
		      this.taplock = true
		      uni.showActionSheet({
		        itemList: ['删除'],
		        success(res) {
		          if (res.tapIndex == 0) {
		            vx.deleteCard()
		          }
		        }
		      })
		    },
		    deleteCard() {
		      this.show = false
		      uni.setStorage({
		        key: 'closeMove',
		        data: true
		      })
		    }
		}
	}
</script>

<style>
.move-wrapper {
  width: 110rpx;
  height: 60rpx;
  border-radius: 30rpx;
  position: fixed;
  bottom: 200rpx;
  left: -50rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: var(--base-color);
  /* border: 1rpx solid #000; */
  /* box-shadow: 0 0 0 1rpx rgba(0,0,0,.1), 0 2px 4px 0 rgba(0,0,0,.16); */
}
.move-box {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.move-box > .iconfont {
  font-size: 50rpx;
  color: #fff;
}
</style>
