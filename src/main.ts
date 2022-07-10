import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//导入全局样式
import "./assets/css/global.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//导入字体图标
import "@/assets/fonts/iconfont.css";
//导入axios
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus).use(store).use(router).mount("#app");
