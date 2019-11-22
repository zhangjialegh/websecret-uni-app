<script>
	import Vue from 'vue'
    export default {
        onLaunch: function(options) {
            console.log('App Launch')
			// #ifndef H5
			console.log('h5')
			Vue.gd.initOptions(options)
			Vue.gd.wxLogin(options)
			// #endif
        },
        onShow: function() {
            console.log('App Show')
        },
        onHide: function() {
            console.log('App Hide')
        },
		globalData: {
			test: ''
		}
    }
</script>

<style>
    @import './common/icon.css';
    @import './common/custom.css';
</style>
