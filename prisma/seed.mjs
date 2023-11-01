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
        id: 1, name: 'admin', email: 'admin@kforum.com', phone: '12345678901',
        password: passwordHash, isAdmin: true, gender: 'MAN',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=admin&size=96',
        bio: 'I am the admin', createdAt: new Date(), updatedAt: new Date(),
    };
    await db.user.upsert({ where: { id: admin.id }, create: admin, update: admin });
    console.log('已完成管理员初始化. User: admin, Pass: 123123');

    // init nav menus
    const navMenus = [
        { name: '首页', url: '/', sequence: 0 },
    ];
    for (const item of navMenus) {
        await db.webNavMenus.upsert({ where: { name: item.name }, create: item, update: item });
    }
    console.log('已完成菜单初始化.');

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
    console.log('已完成分类初始化.');

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

// 用于生成一堆漂亮的假数据
// XXX 插入较慢，可以适当做一些优化
async function initFaker() {
    await db.postReactionRef.deleteMany({});
    await db.post.deleteMany({});
    await db.discussion.deleteMany({});
    await db.user.deleteMany({ where: { id: { gt: 1 } } });

    const userCount = 1000;
    for (let i = 2; i <= userCount; i++) { // avoid 0,1 starts from 2
        const gender = _.sample(['MAN', 'WOMAN']);
        const name = casual.username;
        const user = {
            id: i,
            name,
            email: casual.email,
            phone: casual.phone,
            password: passwordHash,
            isAdmin: false,
            gender,
            avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}&size=96`,
            bio: casual.words(6),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await db.user.create({ data: user });
    }
    console.log(`已完成初始化 ${userCount} 个用户`);

    // 1000 个用户，每个生成 20 个话题，共20000个话题
    let totalDiscussion = 20000;
    let dIds = _.shuffle(_.range(1, 20001, 1));
    let dIdIndex = 0;
    for (let userId = 1; userId <= userCount; userId++) {
        for (let j = 0; j < 20; j++) {
            const dId = dIds[dIdIndex];
            const category = _.sample([1, 2, 3, 4, 5]); // 5 categories
            const content = casual.sentences(10);
            const d = await db.discussion.create({
                data: {
                    id: dId,
                    title: casual.title,
                    categoryId: category,
                    userId,
                }
            });
            const p = await db.post.create({
                data: {
                    discussionId: d.id,
                    content: content,
                    text: content,
                    type: 'text',
                    userId,
                    ip: casual.ip,
                }
            });
            await db.discussion.update({
                where: { id: d.id },
                data: {
                    firstPostId: p.id,
                    lastPostId: p.id,
                    lastPostedAt: new Date(),
                }
            });

            dIdIndex += 1;
        }
    };
    console.log(`已完成初始化 ${totalDiscussion} 个话题`);

    // 每个话题下面 随机选择 100 个用户，每个生成 1 个回帖（单个话题 100 个回帖），最大总帖数 100 * 20000 = 2,000,000 (200万条回帖)
    for (let dId = 1; dId <= totalDiscussion; dId++) {
        for (let j = 0; j < 100; j++) {
            const uId = _.random(1, 1000, false);
            const content = casual.sentences(10);
            const p = await db.post.create({
                data: {
                    discussionId: dId,
                    content: content,
                    text: content,
                    type: 'text',
                    userId: uId,
                    ip: casual.ip,
                }
            });
            await db.discussion.update({
                where: { id: dId },
                data: {
                    lastPostId: p.id,
                    lastPostedAt: new Date(),
                }
            });
        }
    }
    console.log(`已完成初始化 2,000,000 个回帖`);
}

async function main() {
    const { values } = parseArgs({ options: { environment: { type: 'string', }, } });
    initBase();
    switch (values.environment) {
        case 'dev': initDev(); break;
        case 'faker': initFaker(); break;
        default: break;
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await db.$disconnect();
});