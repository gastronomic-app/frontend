import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createProvider } from "./vue-apollo";


import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";
import VuePaginate from "vue-paginate";
import Vuesax from "vuesax";

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import '@/assets/css/global.css';
import 'vuesax/dist/vuesax.css';

Vue.config.productionTip = false;


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VuePaginate);
Vue.use(Vuesax);

// Filtro global
Vue.filter("capitalize", function (value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
