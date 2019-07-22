import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
