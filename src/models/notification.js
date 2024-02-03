import _ from 'lodash';
import prisma from '@/lib/prisma';
import ModelError from './model-error';

export const NOTIFICATION_TYPES = [
    'NEW_DISCUSSION', // 有新的话题
    'NEW_POST', // 话题有新的帖子
];

const notificationModel = {
    errors: {
    },
    fields: {
    },
};

export default notificationModel;
