import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

const axios = require("axios");
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com/";

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
