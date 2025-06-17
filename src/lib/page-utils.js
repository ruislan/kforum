export const DEFAULT_PAGE_LIMIT = 20;

const pageUtils = {
    getDefaultLimitAndSkip(page = 1) {
        return { limit: DEFAULT_PAGE_LIMIT, skip: this.getSkip(page) };
    },
    getSkip(page, limit = DEFAULT_PAGE_LIMIT) {
        return Math.max(0, page - 1) * limit;
    }
};

export default pageUtils;