import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "../configs";

export const useI18n = () => {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    lng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};
