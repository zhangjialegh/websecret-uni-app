<template>
	<!-- components/mask/mask.wxml -->
	<view class='mask-container' :style="{background:`rgba(0,0,0,`+opacity+`)`}" data-target="outside" @click="clickoutside">
	    <slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			opacity: {
			  type: Number,
			  value: 0.3
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			clickoutside(e) {
			    this.$emit('outside');
			},
			stopBubble: function () {
			    return;
			}
		 }
	}
</script>

<style scopeds>
.mask-container {
  position: fixed;
  z-index: 12;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
