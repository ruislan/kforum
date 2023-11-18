import prisma from '@prisma/client';
import bcrypt from 'bcrypt';
import { parseArgs } from 'node:util';
import casual from 'casual';
import _ from 'lodash';

const db = new prisma.PrismaClient({ log: ['error', 'warn'] });
await db.$connect();
const passwordHash = await bcrypt.hash('123123', 10);

// 运行网站的基本数据
async function initBase() {
    // init admin
    const admin = {
        id: 1, name: 'admin', email: 'admin@kforum.com',
        password: passwordHash, isAdmin: true, gender: 'MAN',
        bio: 'I am the admin', createdAt: new Date(), updatedAt: new Date(),
        avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=admin&size=96',
    };
    await db.user.upsert({ where: { id: admin.id }, create: admin, update: admin });
    console.log('已完成管理员初始化. User: admin, Pass: 123123');

    // init site settings
    const siteSettings = [
        {
            id: 1,
            dataType: 'text',
            key: 'site_title',
            name: '站点标题',
            description: '尽量用简单的词或者短句，对所有用户都可见。',
            value: 'KForm 是一个简洁、现代、有趣的论坛'
        },
        {
            id: 2,
            dataType: 'text',
            key: 'site_about',
            name: '关于本站',
            description: '用简单的一句话描述本站，对所有用户都可见。',
            value: 'KForum 是一个开源的在线论坛。基于 NextJS、Prisma 等技术。秉承开源、简单、便捷、易用、易扩展和集成的理念，旨在帮助公司、组织或个人快速建立一个现代且时尚的在线论坛。'
        },
    ];
    for (const item of siteSettings) {
        await db.siteSetting.upsert({ where: { id: item.id }, create: item, update: item });
    }
    console.log('已完成站点信息初始化.');
    // init site nav menus
    const navMenus = [
        { name: '首页', url: '/', sequence: 0 },
    ];
    for (const item of navMenus) {
        await db.siteNavMenu.upsert({ where: { name: item.name }, create: item, update: item });
    }
    console.log('已完成站点菜单初始化.');

    // init categories
    const categories = [
        { id: 1, slug: 'general', name: '综合', color: '#0E76BD', description: '综合讨论，不限制类别和话题，什么都可以说' },
        { id: 2, slug: 'support', name: '帮助与支持', color: '#12A89D', description: '安装、部署和使用的问题与解答' },
        { id: 3, slug: 'uiux', name: 'UI/UX', color: '#92278F', description: '讨论 KForum 的界面设计' },
        { id: 4, slug: 'bug', name: 'Bug', color: '#ED207B', description: '提交 Bug 并追踪进度' },
        { id: 5, slug: 'feature', name: '功能', color: '#F7941D', description: '功能改进与提升和后续迭代的意见和建议' },
    ];
    for (const item of categories) {
        await db.category.upsert({ where: { id: item.id }, create: item, update: item });
    }
    console.log('已完成站点分类初始化.');

    // init reactions
    const reactions = [
        { name: '爱心', icon: '/reactions/heart.png' },
        { name: '微笑', icon: '/reactions/smiling.png' },
        { name: '亲亲', icon: '/reactions/kiss.png' },
        { name: '心碎', icon: '/reactions/broken-heart.png' },
        { name: '哭泣', icon: '/reactions/crying.png' },
        { name: '悲伤', icon: '/reactions/sad.png' },
        { name: '愤怒', icon: '/reactions/angry.png' },
        { name: '小丑', icon: '/reactions/clown.png' },
    ];
    for (let i = 1; i <= reactions.length; i++) {
        const reaction = reactions[i - 1];
        reaction.position = i;
        reaction.id = i;
        await db.reaction.upsert({ where: { id: reaction.id }, create: reaction, update: reaction });
    }
    console.log('已完成反馈初始化.');
}

// 用于测试
async function initDev() {

}

// 用于生成一个中型活跃论坛的数据
// 注册用户在数万-数十万，每日发帖数在数百，一年在数十万贴左右
// Mac i9 16G 386.178s
async function initFaker() {
    console.log('开始进行faker数据填充，这会会花费一些时间：');
    const time = Date.now();
    await cleanDb();

    const userCount = 100_000;
    const users = _.range(2, userCount + 1).map(id => {
        const gender = _.sample(['MAN', 'WOMAN']);
        const name = casual.username + '_' + id;
        const email = name + '@mail.fake';
        const user = {
            id,
            name,
            email,
            password: passwordHash,
            isAdmin: false,
            gender,
            avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&size=96`,
            bio: casual.words(6),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return user;
    })
    await db.user.createMany({ data: users });
    console.log(`已完成初始化 ${userCount} 个用户`);

    // 1000 个用户，每个生成 20 个话题，共20000个话题
    let userLimit = 1000;
    let totalDiscussion = 20_000;
    let dIds = _.shuffle(_.range(1, 20001, 1));
    let dIdIndex = 0;
    let postId = 1;
    for (let userId = 1; userId <= userLimit; userId++) {
        for (let j = 0; j < 20; j++) {
            const dId = dIds[dIdIndex];
            const category = _.sample([1, 2, 3, 4, 5]); // 5 categories
            const content = casual.sentences(10);
            await db.$transaction(async tx => {
                await tx.discussion.create({
                    data: {
                        id: dId,
                        title: casual.title,
                        categoryId: category,
                        userId,
                    }
                });
                await tx.post.create({
                    data: {
                        id: postId,
                        discussionId: dId,
                        content: content,
                        text: content,
                        type: 'text',
                        userId,
                        ip: casual.ip,
                    }
                });
                await tx.discussion.update({
                    where: { id: dId },
                    data: {
                        firstPostId: postId,
                        lastPostId: postId,
                        lastPostedAt: new Date(),
                    }
                });
            });
            dIdIndex += 1;
            postId += 1;
        }
    };
    console.log(`已完成初始化 ${totalDiscussion} 个话题`);

    // 选择 2000 个话题，每个话题随机选择 100 个用户，每个用户产生 1 个回帖，单个话题 100 个回帖，最大回贴数 100 * 2000 = 200,000(20万)
    for (let dId = 1; dId <= 2000; dId++) {
        const posts = _.range(0, 100).map(i => {
            const uId = _.random(1, userLimit, false);
            const content = casual.sentences(10);
            const post = {
                id: postId,
                discussionId: dId,
                content: content,
                text: content,
                type: 'text',
                userId: uId,
                ip: casual.ip,
            };
            postId += 1;
            return post;
        });
        await db.post.createMany({ data: posts });
        await db.discussion.update({
            where: { id: dId },
            data: {
                postCount: { increment: posts.length },
                lastPostId: postId - 1,
                lastPostedAt: new Date(),
            }
        });
    }
    console.log(`已完成初始化 200,000 个回帖`);
    console.log(`全部Faker初始化完成，总耗时：${(Date.now() - time) / 1000} 秒`);
}

async function cleanDb() {
    await db.reactionPostRef.deleteMany({});
    await db.post.deleteMany({});
    await db.discussion.deleteMany({});
    await db.user.deleteMany({ where: { id: { gt: 1 } } });
}

async function main() {
    const { values } = parseArgs({ options: { cmd: { type: 'string', }, } });
    switch (values.cmd) {
        case 'clean': await cleanDb(); break;
        case 'base': await initBase(); break;
        case 'dev': {
            await initBase();
            await initDev();
            break;
        }
        case 'faker': {
            await initBase();
            await initFaker();
            break;
        }
        default: break;
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await db.$disconnect();
});