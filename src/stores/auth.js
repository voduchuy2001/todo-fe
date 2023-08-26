import axios from "axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("access_token") || null,
  }),
  getters: {
    authenticated: (state) => !!state.token,
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
    async login(email, password) {
      await axios
        .post("http://127.0.0.1:8000/api/auth/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          this.setToken(response.data.access_token);
          localStorage.setItem("access_token", response.data.access_token);
          toast.success("Login successfully");
          this.router.push("/");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Unauthorized");
        });
    },
    async register(name, email, password, password_confirmation) {
      await axios
        .post("http://127.0.0.1:8000/api/auth/register", {
          name: name,
          email: email,
          password: password,
          password_confirmation: password_confirmation,
        })
        .then((response) => {
          console.log(response);
          toast.success("Register successfully");
          this.router.push("/login");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Email has already been taken");
        });
    },
    async me() {
      await axios
        .get("http://127.0.0.1:8000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async logout() {
      await axios
        .get("http://127.0.0.1:8000/api/auth/logout", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((response) => {
          console.log(response);
          localStorage.removeItem("access_token");
          this.token = null;
          this.router.push({ name: "Login" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
