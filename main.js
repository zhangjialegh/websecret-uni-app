import Vue from 'vue'
import App from './App'

import uLink from '@/components/uLink.vue'
import store from './store'
const config = require('@/common/config.js')
import gd from '@/common/global.js'
import '@/widget/ican-H5Api'

Vue.config.productionTip = false


Vue.store = Vue.prototype.$store = store
Vue.cg = Vue.prototype.$cg = config
Vue.use(gd, {api: config.BASE_URL, key: config.STORAGE_KEY})

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
