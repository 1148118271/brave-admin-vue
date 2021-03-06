import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import axios from './utils/request'

import Storage from 'vue-ls'

const options = {
  namespace: 'vuejs__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
}

import '@/icons' // icon
import '@/permission' // permission control

Vue.prototype.$msg = ElementUI.Message
Vue.prototype.$ls = Vue.ls
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.use(mavonEditor)
Vue.use(Storage, options)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
