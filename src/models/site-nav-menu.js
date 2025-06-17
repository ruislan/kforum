import prisma from '@/lib/prisma';

const siteNavMenuModel = {
    async getMenus() {
        return await prisma.siteNavMenu.findMany({ orderBy: { sequence: 'asc' } });
    },
    async update({ menus }) {
        await prisma.$transaction([
            prisma.siteNavMenu.deleteMany(),
            prisma.siteNavMenu.createMany({ data: menus })
        ]);
    }
};

export default siteNavMenuModel;