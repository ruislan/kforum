import CredentialsProvider from 'next-auth/providers/credentials';
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
            session.user.isLocked = await userModel.isLocked(token.id);
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