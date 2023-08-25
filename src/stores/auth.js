import axios from "axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    authenticated: (state) => !!state.token,
    authenticatedUser: (state) => state.user,
  },
  actions: {
    async login(data) {
      this.isLoading = true;
      await axios
        .post("http://127.0.0.1:8000/api/auth/login", {
          email: data.email,
          password: data.password,
        })
        .then((response) => {
          this.isLoading = false;

          this.token = response.data.access_token;
          localStorage.setItem("access_token", response.data.access_token);
          this.router.push("/");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async register(data) {
      await axios
        .post("http://127.0.0.1:8000/api/auth/register", {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        })
        .then((response) => {
          console.log(response.data);
          this.router.push("/login");
        })
        .catch((error) => {
          console.log(error);
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
          this.user = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
