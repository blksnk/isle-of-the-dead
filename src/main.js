import Vue from "vue";
import dotenv from 'dotenv';
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import slide from './components/Slide.vue'

dotenv.config();

Vue.component('slide', slide);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
