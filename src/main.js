import Vue from "vue";
import dotenv from 'dotenv';
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import slide from './components/Slide.vue'

dotenv.config();

Vue.component('slide', slide);


Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
