import { createApp, markRaw } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const pinia = createPinia();

pinia.use(({ store }) => {
  store.router = markRaw(router);
});

const app = createApp(App);

app.use(Toast);
app.use(pinia);
app.use(router);
app.mount("#app");
