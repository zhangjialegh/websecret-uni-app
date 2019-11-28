<script>
	import Vue from 'vue'
    export default {
        onLaunch: function(options) {
			Vue.gd.initOptions(options)
			// #ifndef H5
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
    @import './common/base.css';
</style>
