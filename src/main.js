import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'

import {
  Button,
  Cell,
  CellGroup,
  NavBar,
  Field
} from 'vant'

Vue
  .use(Button)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Field)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
