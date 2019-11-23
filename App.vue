<script>
	import Vue from 'vue'
    export default {
        onLaunch: function(options) {
			// #ifndef H5
			Vue.gd.initOptions(options)
			Vue.gd.uniLogin(options)
			// #endif
        },
        onShow: function() {
        },
        onHide: function() {
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
