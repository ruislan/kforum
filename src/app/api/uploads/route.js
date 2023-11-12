import { getServerSession } from 'next-auth';
import sha1 from 'crypto-js/sha1';

import prisma from '@/lib/prisma';
import rest from '@/lib/rest';
import storage from '@/lib/storage';
import authOptions from '@/lib/auth';

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session.user?.id || session.user?.isLocked) return rest.unauthorized();

    const data = await request.formData();
    const file = data.get('file');
    const checksum = data.get('checksum');
    // 相同的checksum的文件，就不用存储了，节约点空间

    if (!file) return rest.badRequest({ message: '没有找到上传的文件，或者文件不完整，请重新上传' });
    const uploadBytes = await file.arrayBuffer();
    const uploadChecksum = sha1(uploadBytes).toString();
    if (checksum !== uploadChecksum) return rest.badRequest({ message: '文件已经被破坏，请重新上传' });

    let savedFile = await prisma.uploads.findUnique({ where: { checksum } });
    if (!savedFile) {
        const uploadBuffer = Buffer.from(uploadBytes);
        const originalFileName = file.name;
        const url = await storage.store(originalFileName, uploadBuffer);

        savedFile = await prisma.uploads.create({
            data: {
                url,
                fileSize: file.size,
                userId: session.user?.id,
                originalFileName,
                checksum: uploadChecksum
            }
        });
    }

    return rest.created({
        data: {
            userId: session.user?.id,
            url: savedFile.url,
            fileSize: savedFile.fileSize
        }
    });
}