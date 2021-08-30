import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createProvider } from "./vue-apollo";
import { LoaderPlugin } from 'vue-google-login';

import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import '@/assets/css/global.css';


Vue.config.productionTip = false;


Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);


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
Vue.GoogleAuth.then(auth2 => {
  console.log(auth2.isSignedIn.get());
  console.log(auth2.currentUser.get())
})
