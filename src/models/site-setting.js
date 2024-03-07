import prisma from '@/lib/prisma';
import { SITE_SETTING_TYPES } from '@/lib/constants';

const siteSettingModel = {
    fields: {
        siteTitle: 'site_title',
        siteAbout: 'site_about',
        siteLogo: 'site_logo',
        siteFavicon: 'site_favicon',
        reputationDiscussionSticky: 'reputation_discussion_sticky',
        reputationDiscussionUnsticky: 'reputation_discussion_unsticky',
        reputationDiscussionFollowed: 'reputation_discussion_followed',
        reputationDiscussionUnfollowed: 'reputation_discussion_unfollowed',
        reputationPostCreated: 'reputation_post_created',
        reputationPostDeleted: 'reputation_post_deleted',
        reputationReactionCreated: 'reputation_reaction_created',
        reputationReactionDeleted: 'reputation_reaction_deleted',
        reputationUserFollowed: 'reputation_user_followed',
        reputationUserUnfollowed: 'reputation_user_unfollowed'
    },
    async updateSettings(settings) {
        await prisma.$transaction(async tx => {
            for (const setting of settings) {
                let data = { value: setting.value };
                if (setting.dataType?.toUpperCase() === SITE_SETTING_TYPES.IMAGE) { // 图片类型，链接图片
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
        if ('JSON' === item.dataType?.toUpperCase()) {
            return JSON.parse(item.value);
        }
        if ('NUMBER' === item.dataType?.toUpperCase()) {
            return Number(item.value);
        }
        return item.value;
    }
};

export default siteSettingModel;
