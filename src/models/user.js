import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import ModelError from './model-error';
import pageUtils from '@/lib/page-utils';
import uploadModel from './upload';

const userModel = {
    errors: {
        USER_NOT_FOUND: '没有找到该用户',
        CAN_NOT_LOCK_ADMIN: '管理员不能被封锁',
        USER_WAS_LOCKED: '你已经被管理员封禁',
        CREDENTIAL_NOT_VALID: '用户名或密码不正确',
    },
    fields: {
        simple: { id: true, name: true, email: true, gender: true, avatarUrl: true, isAdmin: true, isModerator: true, isLocked: true },
        passport: { id: true, name: true, email: true, gender: true, avatarUrl: true, isAdmin: true }
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
            select: { ...userModel.fields.passport, isLocked: true, password: true }
        });
        if (user.isLocked) throw new ModelError(this.errors.USER_WAS_LOCKED);
        if (!user) throw new ModelError(this.errors.CREDENTIAL_NOT_VALID);

        const isPasswordMatched = userModel.comparePassword(password, user.password);
        if (!isPasswordMatched) throw new ModelError(this.errors.CREDENTIAL_NOT_VALID);

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
        ignoreSensitive = true,
        query
    }) {
        const countCondition = {};
        if (query) countCondition.where = query;
        const fetchCount = prisma.user.count(countCondition);

        const queryCondition = {};
        const { limit: take, skip } = pageUtils.getDefaultLimitAndSkip(page);
        queryCondition.take = take;
        queryCondition.skip = skip;
        if (query) queryCondition.where = query;

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
                ...this.fields.simple, createdAt: true,
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
    }
};

export default userModel;