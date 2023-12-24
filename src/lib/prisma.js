import 'server-only';
import { PrismaClient } from '@prisma/client';

BigInt.prototype.toJSON = function () {
    return this.toString();
}; // bigint serialization in prisma client.


const isProdEnv = process.env.NODE_ENV === 'production';

const logOptions = ['error', 'warn'];
if (!isProdEnv) logOptions.push('query');

const globalForPrisma = global;
const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: logOptions });
if (!isProdEnv) globalForPrisma.prisma = prisma;

export default prisma;