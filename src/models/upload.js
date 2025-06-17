import CryptoJS from 'crypto-js';
import prisma from '@/lib/prisma';
import storage from '@/lib/storage';
import ModelError from './model-error';

const uploadModel = {
    errors: {
        FILE_NOT_FOUND: '没有找到上传的文件，或者文件不完整，请重新上传',
        FILE_IS_BROKEN: '文件已经被破坏，请重新上传',
    },
    getImageUrls(content) {
        if (!content) return [];
        return content.match(/\/uploads\/[^"]+/g);
    },
    async create({ userId, file, checksum }) {
        if (!file || file.size === 0) throw new ModelError(this.errors.FILE_NOT_FOUND);
        const uploadBytes = await file.arrayBuffer();
        const wordArray = CryptoJS.lib.WordArray.create(uploadBytes);
        const uploadChecksum = CryptoJS.SHA1(wordArray).toString();
        if (checksum !== uploadChecksum) throw new ModelError(this.errors.FILE_IS_BROKEN);

        // 相同的checksum的文件，就不用存储了，节约点空间
        let savedFile = await prisma.upload.findUnique({ where: { checksum } });
        if (!savedFile) {
            const originalFileName = file.name;
            const extension = originalFileName.split('.').pop();
            // xxx check extension?
            const filename = `${uploadChecksum}.${extension}`;
            const url = await storage.store(filename, uploadBytes);

            savedFile = await prisma.upload.create({
                data: {
                    url,
                    fileSize: file.size,
                    userId,
                    originalFileName,
                    checksum: uploadChecksum
                }
            });
        }
        return savedFile;
    },
    async cleanup() {
        // 清理的图片通常是不能 PostRef, AvatarRef，Discussion Poster
        // 同时清理 3 天前的，避免清理掉正在上传的。
        // 清理掉数据库记录
        // 清理掉文件
        // 为了避免清理过大，我们一次最多只处理 1000 条记录
        const deadDay = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const uploads = await prisma.upload.findMany({
            take: 1000,
            where: {
                discussions: { none: {} },
                posts: { none: {} },
                avatars: { none: {} },
                siteSettings: { none: {} },
                createdAt: { lte: deadDay }
            }
        });
        const data = await prisma.upload.deleteMany({ where: { id: { in: uploads.map(u => u.id) } } });
        if (data.count > 0) await Promise.all(uploads.map(u => u.url).map(url => storage.delete(url)));
        data.size = uploads.reduce((prev, curr) => prev + (Number(curr.fileSize) || 0), 0);
        return data;
    }
}

export default uploadModel;
