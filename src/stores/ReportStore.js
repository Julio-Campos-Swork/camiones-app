import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import axios from "axios";
import { useGeneralStore } from "./GeneralStore";
import { ServerError } from "@/utils/errors";
export const useReportStore = defineStore(
  "Report Store",
  () => {
    const useGeneral = useGeneralStore();
    const dataReport = reactive({
      reports: null,
      truckList: null,
    });
    async function getReports(initialDate, finaldate) {
      dataReport.reports = null;
      const dataToSend = new FormData();
      dataToSend.append("initialDate", initialDate);
      if (finaldate.length > 0) {
        dataToSend.append("finalDate", finaldate);
      }

      try {
        const { data } = await axios.post(
          "getReports",
          dataToSend,
          useGeneral.AuthToken
        );
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        console.log({ getReports: data });
        dataReport.reports = data.reportsVideo;
        dataReport.truckList = data.trucks;
        dataReport.truckList.pop();
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, getReports);
      }
    }

    async function editRegisterByID(item) {
      const dataToSend = new FormData();
      dataToSend.append("id_load_register", item.id_load_register);
      dataToSend.append("id_truck", item.id_truck);
      dataToSend.append("id_load", item.id_load);
      dataToSend.append("id_register_type", item.id_register_type);
      try {
        const { data } = await axios.post(
          "editRegisterByID",
          dataToSend,
          useGeneral.AuthToken
        );
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        console.log({ editRegisterByID: data });
        useGeneral.showNotification(data.message, "green");
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, editRegisterByID);
      }
    }
    async function deleteRegisterByID(item) {
      const dataToSend = new FormData();
      dataToSend.append("id_load_register", item.id_load_register);

      try {
        const { data } = await axios.post(
          "deleteRegisterByID",
          dataToSend,
          useGeneral.AuthToken
        );
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        console.log({ deleteRegisterByID: data });
        useGeneral.showNotification(data.message, "green");
        return true;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, deleteRegisterByID);
        return false;
      }
    }

    return {
      getReports,
      dataReport,
      deleteRegisterByID,
      editRegisterByID,
    };
  },
  { persist: true }
);
