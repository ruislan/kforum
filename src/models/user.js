import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import ModelError from './model-error';
import pageUtils from '@/lib/page-utils';
import uploadModel from './upload';
import { REPUTATION_TYPES, USER_SORT } from '@/lib/constants';
import siteSettingModel from './site-setting';

const userModel = {
    errors: {
        USER_NOT_FOUND: '没有找到该用户',
        CAN_NOT_LOCK_ADMIN: '管理员不能被封锁',
        USER_WAS_LOCKED: '你已经被管理员封禁',
        CREDENTIAL_NOT_VALID: '用户名或密码不正确',
        CAN_NOT_FOLLOW_YOURSELF: '你不能关注你自己',
    },
    fields: {
        short: {
            id: true,
            name: true,
            gender: true,
            avatarUrl: true
        },
        simple: {
            id: true,
            name: true,
            email: true,
            gender: true,
            avatarUrl: true,
            reputation: true,
            isAdmin: true,
            isModerator: true,
            isLocked: true
        },
    },
    hashPassword(pwd) {
        return bcrypt.hashSync(pwd, 10);
    },
    comparePassword(plainPwd, hashedPwd) {
        return bcrypt.compareSync(plainPwd, hashedPwd);
    },
    async authorize({ username, password }) {
        if (!username || !password) throw new ModelError(this.errors.CREDENTIAL_NOT_VALID);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: username },
                    { name: username }
                ]
            },
            select: { ...userModel.fields.simple, password: true }
        });
        if (!user) throw new ModelError(this.errors.CREDENTIAL_NOT_VALID);
        if (user.isLocked) throw new ModelError(this.errors.USER_WAS_LOCKED);

        const isPasswordMatched = userModel.comparePassword(password, user.password);
        if (!isPasswordMatched) throw new ModelError(this.errors.CREDENTIAL_NOT_VALID);

        delete user.password;
        return user;
    },
    async getUser({ id, fields, ignoreSensitive = true }) {
        const queryCondition = { where: { id } };
        if (fields) queryCondition.select = fields;

        const user = await prisma.user.findUnique(queryCondition);

        if (ignoreSensitive) {
            delete user.password;
            delete user.phone;
        }

        return user;
    },
    async getUsers({
        page = 1,
        sort, // 排序
        ignoreSensitive = true,
        query
    }) {
        // count
        const countCondition = {};
        if (query) countCondition.where = query;
        const fetchCount = prisma.user.count(countCondition);

        // query
        const orderBy = [];
        if (!sort || sort === USER_SORT[0]) orderBy.push({ createdAt: 'desc' });
        if (sort === USER_SORT[1]) orderBy.push({ createdAt: 'asc' });
        const queryCondition = {};
        const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);
        queryCondition.take = take;
        queryCondition.skip = skip;
        if (query) queryCondition.where = query;
        if (orderBy.length > 0) queryCondition.orderBy = orderBy;

        const fetchUsers = prisma.user.findMany(queryCondition);
        const [users, count] = await Promise.all([fetchUsers, fetchCount]);
        for (const user of users) {
            if (ignoreSensitive) {
                delete user.password;
                delete user.phone;
            }
        }

        return { users, hasMore: count > skip + take };
    },
    async getUserByName({
        name,
        withStats = true,
    }) {
        const queryCondition = {
            where: { name },
            select: {
                ...this.fields.simple,
                createdAt: true,
            }
        };
        if (withStats) {
            queryCondition.select._count = {
                select: {
                    discussions: true,
                    posts: true,
                }
            };
        }
        const user = await prisma.user.findFirst(queryCondition);
        if (!user) return null;
        if (withStats) {
            user.discussionCount = user._count.discussions;
            user.postCount = user._count.posts - user._count.discussions;// sub first posts
            delete user._count;
        }
        return user;
    },
    async isLocked(id) {
        // xxx return lock expired time
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, isLocked: true }
        });
        return user.isLocked;
    },
    async lock({ userId, isLocked }) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new ModelError(this.errors.USER_NOT_FOUND);
        if (isLocked && user.isAdmin) throw new ModelError(this.errors.CAN_NOT_LOCK_ADMIN);
        await prisma.user.update({
            where: { id: userId, },
            data: { isLocked }
        });
    },
    async updateModerator({ userId, isModerator }) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new ModelError(this.errors.USER_NOT_FOUND);
        await prisma.user.update({
            where: { id: userId, },
            data: { isModerator }
        });
    },
    async updateAvatar({ userId, file, checksum }) {
        const savedFile = await uploadModel.create({
            userId,
            file,
            checksum,
        });
        const result = await prisma.$transaction(async tx => {
            await tx.uploadAvatarRef.upsert({
                where: { userId },
                create: {
                    user: { connect: { id: userId } },
                    upload: { connect: { id: savedFile.id } }
                },
                update: {
                    upload: { connect: { id: savedFile.id } }
                },
            })
            const user = await tx.user.update({
                where: { id: userId, },
                data: { avatarUrl: savedFile.url }
            });
            return user;
        });
        return result;
    },
    async getModerators() {
        const moderators = await prisma.user.findMany({
            where: { isModerator: true },
            select: {
                ...this.fields.short, createdAt: true
            }
        });
        return moderators;
    },
    async follow({ user, followingUsername, isFollowing }) {
        const localUser = { ...user };
        const followingUser = await prisma.user.findUnique({ where: { name: followingUsername } });
        if (!followingUser) throw new ModelError(this.errors.USER_NOT_FOUND);
        if (localUser.id === followingUser) throw new ModelError(this.errors.CAN_NOT_FOLLOW_YOURSELF);
        if (isFollowing) {
            await prisma.userFollower.upsert({
                where: {
                    followingId_userId: {
                        followingId: followingUser.id,
                        userId: localUser.id
                    }
                },
                create: {
                    followingId: followingUser.id,
                    userId: localUser.id
                },
                update: {}
            });
        } else {
            await prisma.userFollower.delete({
                where: {
                    followingId_userId: {
                        followingId: followingUser.id,
                        userId: localUser.id
                    }
                }
            });
        }
    },
    async isUserFollowed({ userId, followingUserId }) {
        const follower = await prisma.userFollower.findUnique({
            where: {
                followingId_userId: {
                    followingId: followingUserId,
                    userId,
                }
            }
        });
        return !!follower;
    },
    async updateReputation({ userId, type }) {
        if (!type) return;
        // get siteSettings
        let key = null;
        switch (type) {
            case REPUTATION_TYPES.DISCUSSION_PINNED:
                key = siteSettingModel.fields.reputationDiscussionPinned;
                break;
            case REPUTATION_TYPES.DISCUSSION_UNPINNED:
                key = siteSettingModel.fields.reputationDiscussionUnpinned;
                break;
            case REPUTATION_TYPES.DISCUSSION_FOLLOWED:
                key = siteSettingModel.fields.reputationDiscussionFollowed;
                break;
            case REPUTATION_TYPES.DISCUSSION_UNFOLLOWED:
                key = siteSettingModel.fields.reputationDiscussionUnfollowed;
                break;
            case REPUTATION_TYPES.POST_CREATED:
                key = siteSettingModel.fields.reputationPostCreated;
                break;
            case REPUTATION_TYPES.POST_DELETED:
                key = siteSettingModel.fields.reputationPostDeleted;
                break;
            case REPUTATION_TYPES.REACTION_CREATED:
                key = siteSettingModel.fields.reputationReactionCreated;
                break;
            case REPUTATION_TYPES.REACTION_DELETED:
                key = siteSettingModel.fields.reputationReactionDeleted;
                break;
            case REPUTATION_TYPES.USER_FOLLOWED:
                key = siteSettingModel.fields.reputationUserFollowed;
                break;
            case REPUTATION_TYPES.USER_UNFOLLOWED:
                key = siteSettingModel.fields.reputationUserUnfollowed;
                break;
            default:
                break;
        }
        if (!key) return;
        const value = await siteSettingModel.getFieldValue(key);
        console.log('update value: ' + value);
        await prisma.user.update({
            where: { id: userId },
            data: { reputation: { increment: value } }
        });
    }
};

export default userModel;
