import prisma from '@/lib/prisma';
import { SITE_SETTING_TYPES } from '@/lib/constants';

const siteSettingModel = {
    fields: {
        siteTitle: 'site_title',
        siteAbout: 'site_about',
        siteLogo: 'site_logo',
        siteFavicon: 'site_favicon',
    },
    async updateSettings(settings) {
        await prisma.$transaction(async tx => {
            for (const setting of settings) {
                let data = { value: setting.value };
                if (setting.dataType === SITE_SETTING_TYPES.image) { // 图片类型，链接图片
                    const upload = await tx.upload.findFirst({
                        where: { url: data.value }
                    });
                    data.uploadId = upload?.id;
                }
                await tx.siteSetting.update({
                    where: { id: setting.id },
                    data
                });
            }
        });
    },
    async getSettings() {
        return await prisma.siteSetting.findMany();
    },
    async getFieldsValues(...fields) {
        const data = {};
        if (!fields || fields.length == 0) return data;

        const items = await prisma.siteSetting.findMany({
            where: {
                key: {
                    in: fields
                }
            }
        });

        items.forEach(item => {
            data[item.key] = this.decodeValue(item);
        });

        return data;
    },
    async getFieldValue(field) {
        if (!field) return null;
        const item = await prisma.siteSetting.findUnique({ where: { key: field } });
        const value = this.decodeValue(item);
        return value;
    },
    decodeValue(item) {
        switch (item.dataType) {
            case 'json':
                return JSON.parse(item.value);
            case 'number':
                return new Number(item.value);
            default:
                return item.value;
        }
    }
};

export default siteSettingModel;