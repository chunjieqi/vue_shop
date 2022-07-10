import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import Welcome from "@/views/Welcome.vue";
import User from "@/views/User.vue";
import Roles from "@/views/Roles.vue";
import Rights from "@/views/Rights.vue";
import Goods from "@/views/Goods.vue";
import Params from "@/views/Params.vue";
import Categories from "@/views/Categories.vue";
import Orders from "@/views/Orders.vue";
import Reports from "@/views/Reports.vue";
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: "/home/welcome",
    children: [
      { path: "welcome", component: Welcome },
      { path: "users", component: User },
      { path: "roles", component: Roles },
      { path: "rights", component: Rights },
      { path: "goods", component: Goods },
      { path: "params", component: Params },
      { path: "categories", component: Categories },
      { path: "orders", component: Orders },
      { path: "reports", component: Reports },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
//挂在路由导航守卫
router.beforeEach((to, from, next) => {
  //to是要访问的地址
  //from是原先的地址
  //next是放行函数 next()代表放行

  //用户要访问登录页，直接放行
  if (to.path === "/login") return next();
  //获取token
  const takenstar = window.sessionStorage.getItem("token");
  //判断是否有token(是否已登陆)
  //没有，则跳转到登录
  if (!takenstar) {
    alert("请先登录");
    return next("/login");
  }
  //有，直接放行
  next();
});

export default router;
