import * as dateFns from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

const dateUtils = {
    fromNow(date, locale) {
        if (!date) return '';
        return dateFns.formatDistanceToNow(new Date(date), { locale: locale || zhCN, addSuffix: true });
    }
};

export default dateUtils;