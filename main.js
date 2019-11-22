import Vue from 'vue'
import App from './App'

import pageHead from './components/page-head.vue'
import pageFoot from './components/page-foot.vue'
import uLink from '@/components/uLink.vue'
import store from './store'
const config = require('@/common/config.js')
import gd from '@/common/custom.js'
import '@/common/ican-H5Api'

Vue.config.productionTip = false


Vue.store = Vue.prototype.$store = store
Vue.cg = Vue.prototype.$cg = config
Vue.use(gd, {api: config.BASE_URL, key: config.STORAGE_KEY})

Vue.component('page-head', pageHead)
Vue.component('page-foot', pageFoot)
Vue.component('uLink', uLink)

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
