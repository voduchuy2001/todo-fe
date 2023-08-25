import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import { useAuthStore } from "../stores/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/Register.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "Forgot",
    component: () => import("../components/Forgot.vue"),
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

  next();
});

export default router;
