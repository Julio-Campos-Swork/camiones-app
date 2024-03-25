import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from "axios";
import { useGeneralStore } from "./GeneralStore";
import { ServerError } from "@/utils/errors";

export const useRegisterStore = defineStore(
  "register",
  () => {
    const useGeneral = useGeneralStore();
    const dataToDisplay = reactive({
      loads: null,
      register_type: null,
      trucks: null,
    });

    async function getRegisterData() {
      useGeneral.generalLoading = true;

      try {
        const { data } = await axios.get(
          "getRegisterData",
          useGeneral.AuthToken
        );
        console.log({ getRegisterData: data });
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        dataToDisplay.loads = data.loads;
        dataToDisplay.register_type = data.register_type;
        dataToDisplay.trucks = data.trucks;
        useGeneral.generalLoading = false;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, getRegisterData);
      }
    }

    const finishedRegisters = ref([]);
    async function saveRegisterDate(
      id_register_type,
      id_load,
      id_truck,
      register_date,
      filename
    ) {
      const dataToSend = new FormData();
      dataToSend.append("register_date", register_date);
      dataToSend.append("id_register_type", id_register_type);
      dataToSend.append("id_load", id_load);
      dataToSend.append("id_truck", id_truck);
      dataToSend.append("filename", filename);
      useGeneral.generalLoading = true;
      try {
        const { data } = await axios.post(
          "saveRegisterDate",
          dataToSend,
          useGeneral.AuthToken
        );
        if (!data.status) {
          throw new ServerError(data.message);
        }
        console.log({ saveRegisterDate: data });
        finishedRegisters.value.push(data.newRegister);
        useGeneral.showNotification(data.message, "green");
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, saveRegisterDate);
      }
    }

    const videoList = ref(null);
    async function getVideoByDate(date) {
      useGeneral.generalLoading = true;
      videoList.value = null;
      const dataToSend = new FormData();
      dataToSend.append("date", date);

      try {
        const { data } = await axios.post(
          "getVideoByDate",
          dataToSend,
          useGeneral.AuthToken
        );
        console.log({ getVideoByDate: data });
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        data.fileList.length > 0
          ? (videoList.value = data.fileList)
          : (videoList.value = null);
        useGeneral.generalLoading = false;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, getVideoByDate);
      }
    }

    async function discartVideo(date, filename) {
      useGeneral.generalLoading = true;
      const dataToSend = new FormData();
      dataToSend.append("date", date);
      dataToSend.append("filename", filename);
      try {
        const { data } = await axios.post(
          "discartVideo",
          dataToSend,
          useGeneral.AuthToken
        );
        console.log({ discartVideo: data });
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        useGeneral.showNotification(data.message, "green");
        useGeneral.generalLoading = false;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, discartVideo);
      }
    }
    async function confirmVideo(date, filename) {
      useGeneral.generalLoading = true;
      const dataToSend = new FormData();
      dataToSend.append("register_date", date);
      dataToSend.append("filename", filename);
      try {
        const { data } = await axios.post(
          "confirmVideo",
          dataToSend,
          useGeneral.AuthToken
        );
        console.log({ confirmVideo: data });
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        useGeneral.generalLoading = false;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, confirmVideo);
      }
    }

    async function saveNewRegisters(register) {
      useGeneral.generalLoading = true;
      const dataToSend = new FormData();
      dataToSend.append("registers", JSON.stringify(register));
      console.log({ dataToSend });
      try {
        const { data } = await axios.post(
          "saveNewRegisters",
          dataToSend,
          useGeneral.AuthToken
        );
        console.log({ saveNewRegisters: data });
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        useGeneral.showNotification(data.message, "green");
        useGeneral.generalLoading = false;

        return true;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, saveNewRegisters);
        return false;
      }
    }
    return {
      getRegisterData,
      dataToDisplay,
      saveRegisterDate,
      getVideoByDate,
      videoList,
      discartVideo,
      finishedRegisters,
      confirmVideo,
      saveNewRegisters,
    };
  },
  { persist: true }
);
