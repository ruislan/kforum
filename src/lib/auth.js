import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import { userModel } from './models';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const { username, password } = credentials;
                if (!username || !password) return null;

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: username },
                            { name: username }
                        ]
                    },
                    select: { ...userModel.fields.passport, password: true }
                });
                if (!user) return null;

                const isPasswordMatched = userModel.comparePassword(password, user.password);
                if (!isPasswordMatched) return null;

                return user;
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.avatar = user.avatar;
                token.isAdmin = user.isAdmin;
            }
            if (trigger === 'update') {
                if (session?.email) token.email = session.email;
                if (session?.avatar) token.avatar = session.avatar;
                if (session?.gender) token.gender = session.gender;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.avatar = token.avatar;
            session.user.isAdmin = token.isAdmin;
            return session;
        }
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV !== 'production',
};

export default authOptions;