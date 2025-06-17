'use strict';

const MB = 1024 * 1024;

const numberUtils = {
    round(number, precision) {
        return Math.round(+number + 'e' + precision) / Math.pow(10, precision);
    },
    formatStorageUsage(value) {
        const num = Number(value) || 0;
        return this.round(num / MB, 2);
    }
};

export default numberUtils;