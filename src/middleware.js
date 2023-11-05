import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            return Boolean(token);
        }
    }
});

export const config = {
    matcher: [
        '/d/create',
        '/settings',
        '/settings/:path*',
    ]
};