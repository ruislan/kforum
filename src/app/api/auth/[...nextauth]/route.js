import prisma from '@/lib/prisma';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const errorMessage = 'Incorrect username and password';

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
                if (!username || !password) throw new Error(errorMessage);

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: username },
                            { name: username }
                        ]
                    }
                });
                if (!user) throw new Error(errorMessage);

                const isPasswordMatched = await bcrypt.compare(password, user.password);
                if (!isPasswordMatched) throw new Error(errorMessage);

                return { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            console.log('jwt:');
            console.log(user);
            if (user) {
                token.id = user.id;
                token.avatar = user.avatar;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.avatar = token.avatar;
            return session;
        }
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV !== 'production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };