import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import api from "./api";
import filters from "./filters";
import store from './store'  
// Vue.prototype.$store = store
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.use(uView);
Vue.use(api)
Vue.use(store)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
