import CredentialsProvider from 'next-auth/providers/credentials';
import { userModel } from '@/models';

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
                const user = await userModel.authorize({ username, password });
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
                token.avatarUrl = user.avatarUrl;
                token.isAdmin = user.isAdmin;
                token.isModerator = user.isModerator;
            }
            if (trigger === 'update') {
                if (session?.email) token.email = session.email;
                if (session?.avatarUrl) token.avatarUrl = session.avatarUrl;
                if (session?.gender) token.gender = session.gender;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.isLocked = await userModel.isLocked(token.id);
            session.user.id = token.id;
            session.user.avatarUrl = token.avatarUrl;
            session.user.isAdmin = token.isAdmin;
            session.user.isModerator = token.isModerator;
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
