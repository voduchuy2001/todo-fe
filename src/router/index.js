import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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
  },
  {
    path: "/forgot-password",
    name: "Forgot",
    component: () => import("../components/Forgot.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
