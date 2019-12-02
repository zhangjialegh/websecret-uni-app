<template>
	<view class="sky">
		<view class="clouds clouds_one"></view>
		<view class="clouds clouds_two"></view>
		<view class="clouds clouds_three"></view>
	</view>
</template>

<script>
</script>

<style scoped>
	.sky {
		height: 100%;
		background-color: #007fd5;
		position: relative;
		overflow: hidden;
		width: 100%;
		animation: sky_background 50s ease-out infinite;
		transform: translate3d(0,0,0);
		opacity: 0.2;
	}
	@keyframes sky_background {
		0% {
			background-color: #007FD5;
			color: #007FD5;
		}
		50% {
			background-color: #000000;
			color: #a3d9ff;
		}
		100% {
			background-color: #007FD5;
			color: #007FD5;
		}
	}
	.clouds {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 300%;
		transform: translate3d(0,0,0);
		/* background-position: 0 20%; */
	}
    .clouds_one {
		animation: cloud_one 50s linear infinite;
		background-image: url('https://abc.zhangjiale.club/ifiles/cloud_one.png');
	}
	@keyframes cloud_one {
		0% {
			left: 0;
		}
		100% {
			left:  -200%;
		}
	}
	.clouds_two {
		animation: cloud_two 75s linear infinite;
		background-image: url('https://abc.zhangjiale.club/ifiles/cloud_two.png');
	}
	@keyframes cloud_two {
		0% {
			left: 0;
		}
		100% {
			left:  -200%;
		}
	}
	.clouds_three {
		animation: cloud_three 100s linear infinite;
		background-image: url('https://abc.zhangjiale.club/ifiles/cloud_three.png');
	}
	@keyframes cloud_three {
		0% {
			left: 0;
		}
		100% {
			left:  -200%;
		}
	}
</style>
