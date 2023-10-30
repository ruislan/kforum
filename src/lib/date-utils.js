import * as dateFns from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

const dateUtils = {
    fromNow(date) {
        if (!date) return '';
        return dateFns.formatDistanceToNow(new Date(date), { locale: zhCN, addSuffix: true });
    }
};

export default dateUtils;