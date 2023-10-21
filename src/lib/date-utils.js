import * as dateFns from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

const DateUtils = {
    fromNow(date) {
        if (!date) return '';
        return dateFns.formatDistanceToNow(new Date(date), { locale: zhCN, addSuffix: true });
    }
};

export default DateUtils;