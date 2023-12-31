'use strict';
import 'server-only';
import fs from 'fs';
import logger from './logger';

// XXX maybe we can try a cloud storage like qiniu, superbase, s3, etc.
class DiskStorage {
    constructor({ storeBase, relativePathBase }) {
        this.storeBase = storeBase || './public/uploads';
        this.relativePathBase = relativePathBase || '/uploads';
    }
    async store(filename, bytes) {
        const buffer = Buffer.from(bytes);
        const date = new Date();

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dir = `${this.storeBase}/${year}/${month}/${day}`;

        if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(`${dir}/${filename}`, buffer);
        const filePath = `${this.relativePathBase}/${year}/${month}/${day}/${filename}`;
        logger.info(`storage:disk File ${filename} is store to dir ${dir}, relative path is ${filePath} .`);
        return filePath;
    }
    async delete(filename) {
        const path = filename.substring(this.relativePathBase.length);
        const dir = `${this.storeBase}${path}`;
        await fs.promises.unlink(dir);
        logger.info(`storage:disk File ${filename} is deleted`);
    }
}

const isProdEnv = process.env.NODE_ENV === 'production';

const globalForStorage = global;
const storage = globalForStorage.storage ?? new DiskStorage({});
if (!isProdEnv) globalForStorage.storage = storage;

export default storage;
