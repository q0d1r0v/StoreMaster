import { createApp } from "vue";
import { router } from "./routes/index";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();

createApp(App).use(router).use(ElementPlus).use(pinia).mount("#app");
