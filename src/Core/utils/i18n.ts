import { initReactI18next } from 'react-i18next';
import resources from 'App/translations';
import i18n from 'i18next';

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
};
