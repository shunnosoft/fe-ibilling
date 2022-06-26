import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import lang file
import enLnag from "../lang/EN.json";
import bnLang from "../lang/BN.json";

//Creating object with the variables of imported translation files
const resources = {
  en: {
    translation: enLnag,
  },
  bn: {
    translation: bnLang,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "bn", //default language
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
