const Rest = {
    ok({ json }) {
        const body = JSON.stringify(json || {});
        return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
    },
    badRequest(json) {
        const body = JSON.stringify({ ...json });
        return new Response(body, { status: 400, headers: { 'Content-Type': 'application/json' } });
    },
};

export default Rest;