import { useGeneralStore } from "@/stores/GeneralStore";

const maxRetries = 5;

export const retryConnection = (callback, retries) => {
  console.log({ retryConnection: retries });
  const useGeneral = useGeneralStore();

  if (retries >= maxRetries) {
    useGeneral.showNotification(
      "Por favor revisa tu conexión a internet o ponte en contacto con soporte",
      "red"
    );
    return;
  } else {
    useGeneral.generalLoading = true;
    setTimeout(() => {
      callback();
    }, 5000);
  }
};
