const jsonHeaders = { 'Content-Type': 'application/json' };

const Rest = {
    created(json) {
        const body = json ? JSON.stringify(json) : null;
        return new Response(body, { status: 201, headers: jsonHeaders });
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

export default Rest;