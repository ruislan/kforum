import prisma from '@prisma/client';
import bcrypt from 'bcrypt';
import { parseArgs } from 'node:util';

const db = new prisma.PrismaClient({ log: ['error', 'warn'] });
await db.$connect();

// 运行网站的基本数据
async function initBase() {
    // init admin
    const passwordHash = await bcrypt.hash('123456', 10);
    const admin = {
        id: 1, name: 'admin', email: 'admin@ktap.com', phone: '123456789',
        password: passwordHash, isAdmin: true, gender: 'MAN',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&size=96',
        bio: 'I am the admin', createdAt: new Date(), updatedAt: new Date(),
    };
    await db.user.upsert({ where: { id: admin.id }, create: admin, update: admin });

    // init nav menus
    const navMenus = [
        { name: '首页', url: '/', },
        { name: '流行', url: '/popular', sequence: 1, }
    ];
    for (const item of navMenus) {
        await db.webNavMenus.upsert({ where: { name: item.name }, create: item, update: item });
    }

    // init tags
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