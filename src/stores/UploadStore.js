import { defineStore } from "pinia";
import { useGeneralStore } from "./GeneralStore";
import axios from "axios";
import { ref, reactive } from "vue";
import { ServerError } from "@/utils/errors";

export const useUploadStore = defineStore(
  "UploadStore",
  () => {
    const useGeneral = useGeneralStore();

    async function createFolder(folderName) {
      const dataToSend = new FormData();

      dataToSend.append("folderName", folderName);
      try {
        const { data } = await axios.post(
          "createFolder",
          dataToSend,
          useGeneral.AuthToken
        );
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        getAllDirectories();
        console.log({ data });
        useGeneral.showNotification(data.message, "green");
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, createFolder);
      }
    }

    const directoryList = ref(null);
    async function getAllDirectories() {
      try {
        const { data } = await axios.get(
          "getAllDirectories",
          useGeneral.AuthToken
        );
        console.log({ getAllDirectories: data });
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        directoryList.value = data.directoryList;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, getAllDirectories);
      }
    }

    async function saveFilesIntoDirectory(files, folderName) {
      useGeneral.generalLoading = true;
      const dataToSend = new FormData();

      dataToSend.append("folderName", folderName);
      files.forEach((file) => {
        dataToSend.append("files[]", file);
      });
      try {
        const { data } = await axios.post(
          "saveFilesIntoDirectory",
          dataToSend,
          useGeneral.AuthToken
        );
        console.log({ saveFilesIntoDirectory: data });
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);

        useGeneral.showNotification(data.message, "green");
        useGeneral.generalLoading = false;
        return true;
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, saveFilesIntoDirectory);
        return false;
      }
    }

    async function deleteDirectory(folderName) {
      useGeneral.generalLoading = true;
      const dataToSend = new FormData();

      dataToSend.append("folderName", folderName);
      try {
        const { data } = await axios.post(
          "deleteDirectory",
          dataToSend,
          useGeneral.AuthToken
        );
        if (data.APP_VERSION != undefined) useGeneral.versionisUpdate = false;
        if (!data.status) throw new ServerError(data.message);
        useGeneral.showNotification(data.message, "green");
        useGeneral.generalLoading = false;
        getAllDirectories();
      } catch (error) {
        console.error({ error });
        useGeneral.errorType(error, deleteDirectory);
      }
    }

    return {
      createFolder,
      getAllDirectories,
      directoryList,
      saveFilesIntoDirectory,
      deleteDirectory,
    };
  },
  { persist: true }
);
