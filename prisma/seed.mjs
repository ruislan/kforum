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
        // 网站配置相关
        { dataType: 'STRING', key: 'site_title', value: 'KForum', name: '站点标题', description: '尽量用简单的词或者短句，对所有用户都可见。', },
        { dataType: 'STRING', key: 'site_about', name: '关于本站', description: '用简单的一句话描述本站，对所有用户都可见。', value: 'KForum 是一个开源的在线论坛。基于 NextJS、Prisma 等技术。秉承开源、简单、便捷、易用、易扩展和集成的理念，旨在帮助公司、组织或个人快速建立一个现代且时尚的在线论坛。' },
        { dataType: 'IMAGE', key: 'site_logo', value: '', name: '站点 Logo', description: '站点左上角的 Logo 图片，建议使用宽高比为 3:1 的矩形图片。设置为空则展示默认。', },
        { dataType: 'IMAGE', key: 'site_favicon', value: '', name: '站点 Favicon', description: '站点的 Favicon 图片，建议使用128x128的 png 图片。设置为空则展示默认。', },
        // 网站声望相关
        { dataType: 'NUMBER', key: 'reputation_discussion_sticky', value: '20', name: '话题置顶声望值', description: '用户的话题被置顶获得的声望值', },
        { dataType: 'NUMBER', key: 'reputation_discussion_unsticky', value: '-20', name: '话题取消置顶声望值', description: '用户的话题被取消置顶扣除的声望值', },
        { dataType: 'NUMBER', key: 'reputation_discussion_followed', value: '2', name: '话题被关注声望值', description: '用户的话题被关注获得的声望值', },
        { dataType: 'NUMBER', key: 'reputation_discussion_unfollowed', value: '-2', name: '话题被取消关注声望值', description: '用户的话题被取消关注扣除的声望值', },
        { dataType: 'NUMBER', key: 'reputation_post_created', value: '10', name: '回帖声望值', description: '用户的话题有新的回帖获得的声望值，自己回复自己的话题不会产生声望值', },
        { dataType: 'NUMBER', key: 'reputation_post_deleted', value: '-10', name: '帖子被删除声望值', description: '用户的帖子被删除扣除的声望值', },
        { dataType: 'NUMBER', key: 'reputation_reaction_created', value: '2', name: '反馈声望值', description: '用户的帖子有新的反馈获得的声望值，自己反馈自己的帖子不会产生声望值', },
        { dataType: 'NUMBER', key: 'reputation_reaction_deleted', value: '-2', name: '反馈被取消声望值', description: '用户的反馈被取消扣除的声望值', },
        { dataType: 'NUMBER', key: 'reputation_user_followed', value: '2', name: '用户被关注声望值', description: '用户被关注获得的声望值', },
        { dataType: 'NUMBER', key: 'reputation_user_unfollowed', value: '-2', name: '用户被取消关注声望值', description: '用户被取消关注扣除的声望值', },
    ];
    for (let i = 0; i < siteSettings.length; i++) {
        const item = siteSettings[i];
        item.id = i + 1;
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
        { name: '很棒', icon: '/reactions/good.png' },
        { name: '大笑', icon: '/reactions/laughing.png' },
        { name: '亲亲', icon: '/reactions/kiss.png' },
        { name: '鼓掌', icon: '/reactions/clap.png' },
        { name: '鲜花', icon: '/reactions/flowers.png' },
        { name: '火焰', icon: '/reactions/fire.png' },
        { name: '满分', icon: '/reactions/perfect.png' },
        { name: '火箭', icon: '/reactions/rocket.png' },
        { name: '眼睛', icon: '/reactions/eyes.png' },
        { name: '眼冒星光', icon: '/reactions/stunning.png' },
        { name: '很差', icon: '/reactions/bad.png' },
        { name: '药丸', icon: '/reactions/medicine.png' },
        { name: '哭泣', icon: '/reactions/crying.png' },
        { name: '悲伤', icon: '/reactions/sad.png' },
        { name: '愤怒', icon: '/reactions/angry.png' },
    ];
    for (let i = 1; i <= reactions.length; i++) {
        const reaction = reactions[i - 1];
        reaction.position = i;
        reaction.id = i;
        await db.reaction.upsert({ where: { id: reaction.id }, create: reaction, update: reaction });
    }
    console.log('已完成反馈初始化.');

    const tags = [
        { name: '求助', textColor: '#ffffff', bgColor: '#008751' },
        { name: 'AI', textColor: '#ffffff', bgColor: '#29aeff' },
        { name: '闲聊', textColor: '#ffffff', bgColor: '#5f574e' },
    ];
    for (let i = 1; i <= tags.length; i++) {
        const tag = tags[i - 1];
        tag.id = i;
        await db.tag.upsert({ where: { id: tag.id }, create: tag, update: tag });
    }
}

// 用于测试
async function initDev() {

}

// 用于生成一个中型活跃论坛的数据
// 一些不错的论坛的数据
// discourse meta
//        24 小时 7 天 30 天 所有时间
// 话题    19 88 476 48.4k
// 帖子    619 2.3k 14.4k 1.3M
// 注册    60 193 929 73.9k
// 活跃用户 558 1.1k 2.2k —
// 赞      504 1.7k 9.1k 1.4M
// ruby - china
// 会员数：56029 个
// 话题数：39211 篇
// 回帖数：377305 条
// 测试之家
// 社区会员: 81347 人
// 帖子数: 36005 个
// 回帖数: 235207 条
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

    // 每个用户都关注第一个用户(10 万关注)，便于后续测试
    const followers = _.range(2, userCount + 1).map(id => ({
        followingId: 1,
        userId: id,
    }));
    await db.userFollower.createMany({ data: followers });
    console.log(`已完成初始化关注， ${followers.length} 个用户关注了 id:1 的用户`);

    // 1000 个用户，每个生成 20 个话题，共30000个话题
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
    // Mac i9 16G 276.203s
}

async function cleanDb() {
    await db.siteNavMenu.deleteMany({});
    await db.siteSetting.deleteMany({});
    await db.tagDiscussionRef.deleteMany({});
    await db.tag.deleteMany({});
    await db.bookmark.deleteMany({});
    await db.uploadAvatarRef.deleteMany({});
    await db.uploadPostRef.deleteMany({});
    await db.upload.deleteMany({});
    await db.notification.deleteMany({});
    await db.userFollower.deleteMany({});
    await db.discussionFollower.deleteMany({});
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
