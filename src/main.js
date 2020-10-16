import Vue from "vue";
import App from "./App.vue";
import { initializeFirebase } from "../push-notification";

Vue.config.productionTip = false;
initializeFirebase();
new Vue({
  render: (h) => h(App),
}).$mount("#app");
