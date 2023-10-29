'use strict';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

// XXX maybe we can try a cloud storage like qiniu, superbase, s3, etc.
class LocalStorage {
    constructor({ storeBase, relativePathBase, isDebug }) {
        this.storeBase = storeBase || './public/uploads';
        this.relativePathBase = relativePathBase || '/uploads';
        this.isDebug = isDebug;
    }
    async store(filename, buffer) {
        const date = new Date();
        let localFilename = uuid().replace(/-/g, '');
        const extIndex = filename?.lastIndexOf('.') || -1;
        if (extIndex !== -1) localFilename = localFilename + filename.substring(extIndex);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dir = `${this.storeBase}/${year}/${month}/${day}`;

        if (!fs.existsSync(dir)) await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(`${dir}/${localFilename}`, buffer);
        const filePath = `${this.relativePathBase}/${year}/${month}/${day}/${localFilename}`;
        if (this.isDebug) console.log(`storage:local File ${filename} is store to dir ${dir}, relative path is ${filePath} .`);
        return filePath;
    }
    async delete(filename) {
        const path = filename.substring(this.relativePathBase.length);
        const dir = `${this.storeBase}${path}`;
        await fs.promises.unlink(dir);
        if (this.isDebug) console.log(`storage:local File ${filename} is deleted`);
    }
}

const isProdEnv = process.env.NODE_ENV === 'production';

const globalForStorage = global;
const storage = globalForStorage.storage ?? new LocalStorage({ isDebug: !isProdEnv });
if (!isProdEnv) globalForStorage.storage = storage;

export default storage;
