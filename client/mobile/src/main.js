import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import api from "./api";
Vue.use(uView);
Vue.use(api)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
