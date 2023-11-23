'use strict';

const MB = 1024 * 1024;

const urlUtils = {
    isURL(url) {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', // fragment locator
            'i'
        );
        return pattern.test(url);
    },
    fixURL(url) {
        var httpsRegex = /^https:\/\//;
        var httpRegex = /^http:\/\//;

        if (!httpsRegex.test(url) && !httpRegex.test(url)) {
            return 'https://' + url;
        } else {
            return url;
        }
    }
};

export default urlUtils;