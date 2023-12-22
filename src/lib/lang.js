import {
  enUS,
  zhCN,
} from 'date-fns/locale';

export const languages = {
  'en-US': { label: 'English (US)', dateLocale: enUS },
  'zh-CN': { label: '中文', dateLocale: zhCN },
};

export function getDateLocale(locale) {
  return languages[locale]?.dateLocale || enUS;
}
