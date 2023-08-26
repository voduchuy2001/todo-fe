import { createRouter, createWebHistory } from "vue-router";
import Todo from "../pages/todo/Todo.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    name: "Todo",
    component: Todo,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../pages/auth/Register.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "Forgot",
    component: () => import("../pages/auth/Forgot.vue"),
    meta: { requiresAuth: false },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.authenticated) {
    return next({ name: "Login" });
  }

  if (
    (to.name == "Login" && authStore.authenticated) ||
    (to.name == "Register" && authStore.authenticated) ||
    (to.name == "Forgot" && authStore.authenticated)
  ) {
    return next({ name: "Todo" });
  }

  next();
});

export default router;
