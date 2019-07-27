import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
/*
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
*/

import { TablePlugin } from "bootstrap-vue";
Vue.use(TablePlugin);
import Lightbox from "vue-easy-lightbox";
Vue.use(Lightbox);
import { LayoutPlugin } from "bootstrap-vue";
Vue.use(LayoutPlugin);
import { FormPlugin } from "bootstrap-vue";
Vue.use(FormPlugin);
import { FormInputPlugin } from "bootstrap-vue";
Vue.use(FormInputPlugin);
import { ButtonPlugin } from "bootstrap-vue";
Vue.use(ButtonPlugin);
import { FormGroupPlugin } from "bootstrap-vue";
Vue.use(FormGroupPlugin);
import { InputGroupPlugin } from "bootstrap-vue";
Vue.use(InputGroupPlugin);
import { FormSelectPlugin } from "bootstrap-vue";
Vue.use(FormSelectPlugin);
import { LinkPlugin } from "bootstrap-vue";
Vue.use(LinkPlugin);
import { PaginationPlugin } from "bootstrap-vue";
Vue.use(PaginationPlugin);
import { MediaPlugin } from "bootstrap-vue";
Vue.use(MediaPlugin);
import { AlertPlugin } from "bootstrap-vue";
Vue.use(AlertPlugin);
import { SpinnerPlugin } from "bootstrap-vue";
Vue.use(SpinnerPlugin);
import { ModalPlugin } from "bootstrap-vue";
Vue.use(ModalPlugin);
import { BreadcrumbPlugin } from "bootstrap-vue";
Vue.use(BreadcrumbPlugin);
import { ImagePlugin } from "bootstrap-vue";
Vue.use(ImagePlugin);

Vue.config.productionTip = false;

const axios = require("axios");
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com/";

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
