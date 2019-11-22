import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userInfo: null,
		accessToken: '',
		query: {},
		path: '',
		system: null,
		scene: ''
	},
	mutations: {
		setUserInfo (state, payload) {
			state.userInfo = payload
		},
		setAccessToken (state, payload) {
			state.accessToken = payload
		},
		setQuery (state, payload) {
			state.query = payload
		},
		setPath (state, payload) {
			state.path = payload
		},
		setSystem (state, payload) {
			state.system = payload
		},
		setScene (state, payload) {
			state.scene = payload
		},
	}
})

export default store
