import Vue from 'vue'
import Vuex from 'vuex'
import { getItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储token
    user: getItem('user')
  },
  mutations: {
    // 获取token
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {}
})
