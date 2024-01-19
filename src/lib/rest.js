import 'server-only';

const jsonHeaders = { 'Content-Type': 'application/json' };

const rest = {
    notFound() {
        return new Response(null, { status: 404, headers: jsonHeaders });
    },
    unauthorized() {
        return new Response(null, { status: 401, headers: jsonHeaders });
    },
    forbidden() {
        return new Response(null, { status: 403, headers: jsonHeaders });
    },
    created(json) {
        const body = json ? JSON.stringify(json) : null;
        return new Response(body, { status: 201, headers: jsonHeaders });
    },
    updated() {
        return new Response(null, { status: 204, headers: jsonHeaders });
    },
    deleted() {
        return new Response(null, { status: 204, headers: jsonHeaders });
    },
    ok(json) {
        const body = json ? JSON.stringify(json) : null;
        return new Response(body, { status: 200, headers: jsonHeaders });
    },
    badRequest(json) {
        const body = json ? JSON.stringify({ ...json }) : null;
        return new Response(body, { status: 400, headers: jsonHeaders });
    },
};

export default rest;