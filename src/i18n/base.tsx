import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
    resources: {
        "en": {
        translation: {   "welcome": "Welcome",}
        },
        "zh-HK": {
        translation: {   "welcome": "Welcome",}
        }
    },
    lng: "en",
    fallbackLng: "en",
    debug: true,

    interpolation: {
        escapeValue: false
    }
    });