import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            // check role?

            // others
            return !!token;
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