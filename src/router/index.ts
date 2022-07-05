import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/home", component: Home },
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
