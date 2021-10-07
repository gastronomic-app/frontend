import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createProvider } from "./vue-apollo";
import { LoaderPlugin } from 'vue-google-login';

import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";
import VuePaginate from "vue-paginate";
import Vuesax from "vuesax";
import VueSweetalert2 from 'vue-sweetalert2';

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import '@/assets/css/global.css';
import 'vuesax/dist/vuesax.css';
import 'sweetalert2/dist/sweetalert2.min.css'

Vue.config.productionTip = false;


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VuePaginate);
Vue.use(Vuesax);
Vue.use(VueSweetalert2);

// Filtro global
Vue.filter("capitalize", function (value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});
Vue.use(LoaderPlugin, {
  client_id: "588145504123-1m52mg56815cv0o5u64jbbrks2t99s8d.apps.googleusercontent.com"
});
new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
