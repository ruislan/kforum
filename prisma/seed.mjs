import prisma from '@prisma/client';
import bcrypt from 'bcrypt';
import { parseArgs } from 'node:util';

const db = new prisma.PrismaClient({ log: ['error', 'warn'] });
await db.$connect();

// 运行网站的基本数据
async function initBase() {
    // init admin
    const passwordHash = await bcrypt.hash('123123', 10);
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

async function main() {
    const { values } = parseArgs({ options: { environment: { type: 'string', }, } });
    initBase();
    switch (values.environment) {
        case 'dev': initDev(); break;
        default: break;
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await db.$disconnect();
});