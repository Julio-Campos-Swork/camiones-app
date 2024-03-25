import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { retryConnection } from "@/utils/retryConnection.js";
import { ServerError } from "@/utils/errors";

export const useGeneralStore = defineStore(
  "GeneralStore",
  () => {
    const versionisUpdate = ref(true);
    const router = useRouter();
    const generalLoading = ref(false);
    //
    // const VIDEO_PATH = "http://192.168.0.109/camionesTSJ-api/videos/";
    const VIDEO_PATH = "http://192.168.0.110/api-registro-camiones-tsj/videos/";
    // const VIDEO_PATH = "https://registro-camiones.sisinte.com/api/videos/";
    const isLogged = ref(false);
    const AUTH = ref(false);
    const _IP = ref("");
    const city = ref("");
    const country = ref("");
    const AuthToken = ref([]);
    const userData = reactive({ user: [] });
    const loginData = reactive({
      email: "",
      password: "",
    });
    const registerData = reactive({
      name: null,
      email: null,
      password: null,
      id_level: null,
    });
    async function loginUser() {
      generalLoading.value = true;
      await getIP();
      const dataToSend = new FormData();
      dataToSend.append("identifier", loginData.email);
      dataToSend.append("password", loginData.password);
      dataToSend.append("ip_value", _IP.value);
      dataToSend.append("city", city.value);
      dataToSend.append("country", country.value);

      try {
        const { data } = await axios.post("auth/login", dataToSend);
        if (data.APP_VERSION != undefined) versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        userData.user = data.userData;
        localStorage.setItem(
          "logedUser",
          JSON.stringify({
            user: data.userData,
            token: data.token,
          })
        );
        AuthToken.value = {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        };
        AUTH.value = true;
        showNotification(data.message, "green");
        router.push("/");
        generalLoading.value = false;
      } catch (error) {
        console.error({ error });
        errorType(error, loginUser);
      }
    }

    async function registerUser() {
      generalLoading.value = true;
      const dataToSend = new FormData();
      dataToSend.append("name", registerData.name);
      dataToSend.append("email", registerData.email);
      dataToSend.append("password", registerData.password);
      dataToSend.append("id_level", registerData.id_level);
      try {
        const { data } = await axios.post("auth/register", dataToSend);
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        console.log({ data });
        showNotification(data.message, "green");
        registerData.name = null;
        registerData.email = null;
        registerData.password = null;
        registerData.id_level = null;
        generalLoading.value = false;
      } catch (error) {
        console.error({ error });
        errorType(error, registerUser);
      }
    }
    async function validateSession() {
      const dataUser = JSON.parse(localStorage.getItem("logedUser"));
      if (dataUser) {
        userData.user = dataUser.user;
        AuthToken.value = {
          headers: {
            Authorization: `Bearer ${dataUser.token}`,
          },
        };
        AUTH.value = true;
      } else {
        userData.user = [];
        AuthToken.value = {};
        AUTH.value = false;
      }
    }

    async function logout() {
      generalLoading.value = true;
      const dataToSend = new FormData();
      dataToSend.append("email", userData.user.email);
      try {
        const { data } = await axios.post("auth/logout", dataToSend);
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        showNotification(data.message, "green");
      } catch (error) {
        console.error({ error });
        errorType(error, logout);
      } finally {
        localStorage.removeItem("logedUser");
        resetUserStore();
        _IP.value = "";
        city.value = "";
        country.value = "";
        generalLoading.value = false;
      }
    }

    async function getIP() {
      try {
        await fetch("https://ipapi.co/json/")
          .then((response) => response.json())
          .then((data) => {
            _IP.value = data.ip;
            city.value = data.city;
            country.value = data.country_name;
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
    function resetUserStore() {
      userData.user = [];
      AuthToken.value = [];
      AUTH.value = false;
      loginData.email = null;
      loginData.password = null;
    }
    const statusNotification = ref(false);
    const messageColor = ref("");
    const messageText = ref("");

    function showNotification(text, color = "yellow") {
      statusNotification.value = true;
      messageColor.value = color;
      messageText.value = text;
    }

    const retries = ref(0);
    function errorNetworkRetry(callback) {
      if (retries.value < 5) {
        retryConnection(callback, retries.value);
        retries.value++;
      } else {
        showNotification(
          "Error de red, por favor verifica tu conexión a internet o comunicate a soporte.",
          "red"
        );
        retries.value = 0;
        generalLoading.value = false;
      }
    }

    function errorType(error, callback) {
      if (error.code == "ERR_NETWORK" || error.status == "ERR_BAD_RESPONSE") {
        errorNetworkRetry(callback);
      }
      if (error instanceof ServerError) {
        showNotification(error.message, "red");
        generalLoading.value = false;
      }
    }

    return {
      isLogged,
      loginData,
      loginUser,
      AUTH,
      AuthToken,
      userData,
      validateSession,
      logout,
      registerUser,
      registerData,
      resetUserStore,
      generalLoading,
      statusNotification,
      messageColor,
      messageText,
      showNotification,
      VIDEO_PATH,
      errorNetworkRetry,
      errorType,
      versionisUpdate,
    };
  },
  { persist: true }
);
