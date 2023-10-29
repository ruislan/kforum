import bcrypt from 'bcrypt';

export const userModal = {
    fields: {
        simple: { id: true, name: true, email: true, gender: true, avatar: true },
        passport: { id: true, name: true, email: true, gender: true, avatar: true, isAdmin: true }
    },
    hashPassword(pwd) {
        return bcrypt.hashSync(pwd, 10);
    },
    comparePassword(plainPwd, hashedPwd) {
        return bcrypt.compareSync(plainPwd, hashedPwd);
    }
};
