const PROJECT_PREFIX = 'roofmagic_project_'
const PUBLIC_PROJECT_PREFIX = 'roofmagic_public_project_'

const jsonError = (status, message, extra = {}) => {
    return new Response(JSON.stringify({ error: message, ...extra }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    })
}

const jsonOk = (data) => {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    })
}

const getUserInfo = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();
        return { uuid: user?.uuid || null, username: user?.username || null };
    } catch {
        return { uuid: null, username: null };
    }
}

router.post('/api/projects/save', async ({request, user}) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;

        if(!project?.id || !project?.sourceImage) return jsonError(400, 'Project not found');

        const payload = {
            ...project,
            updatedAt: new Date().toISOString(),
        }

        const { uuid: userId } = await getUserInfo(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const key = `${PROJECT_PREFIX}${project.id}`;
        await userPuter.kv.set(key, payload);

        return { saved: true, id: project.id, project: payload };
    } catch (e) {
        return jsonError(500, 'failed to save project', { message: e.message || 'Unknown error' });
    }
})

// Returns current user's private projects + ALL community projects from all users
router.get('/api/projects/list', async ({user}) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const { uuid: userId } = await getUserInfo(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const privateProjects = (await userPuter.kv.list(PROJECT_PREFIX, true))
            .map(({value}) => ({ ...value, isPublic: false }));

        const allPublicProjects = (await me.puter.kv.list(PUBLIC_PROJECT_PREFIX, true))
            .map(({value}) => value);

        return { projects: [...privateProjects, ...allPublicProjects] };
    } catch (e) {
        return jsonError(500, 'failed to list projects', { message: e.message || 'Unknown error' });
    }
})

// No auth required — for guests to see community projects
router.get('/api/projects/public', async () => {
    try {
        const projects = (await me.puter.kv.list(PUBLIC_PROJECT_PREFIX, true))
            .map(({value}) => value);

        return jsonOk({ projects });
    } catch (e) {
        return jsonError(500, 'failed to list public projects', { message: e.message || 'Unknown error' });
    }
})

// Checks user's private KV first, then app-level public KV
router.get('/api/projects/get', async ({request, user}) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const { uuid: userId } = await getUserInfo(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if(!id) return jsonError(400, 'Project ID is required');

        const privateKey = `${PROJECT_PREFIX}${id}`;
        let project = await userPuter.kv.get(privateKey);

        if(!project) {
            const publicKey = `${PUBLIC_PROJECT_PREFIX}${id}`;
            project = await me.puter.kv.get(publicKey);
        }

        if(!project) return jsonError(404, 'Project not found');

        return { project };
    } catch (e) {
        return jsonError(500, 'failed to get project', { message: e.message || 'Unknown error' });
    }
})

// Moves project from user's private KV → app-level public KV (me.puter.kv)
router.post('/api/projects/share', async ({request, user}) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const { id } = body;
        if(!id) return jsonError(400, 'Project ID is required');

        const { uuid: userId, username } = await getUserInfo(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const privateKey = `${PROJECT_PREFIX}${id}`;
        const project = await userPuter.kv.get(privateKey);
        if(!project) return jsonError(404, 'Project not found');

        const publicPayload = {
            ...project,
            isPublic: true,
            ownerId: userId,
            sharedBy: username,
            sharedAt: new Date().toISOString(),
        };

        const publicKey = `${PUBLIC_PROJECT_PREFIX}${id}`;
        await me.puter.kv.set(publicKey, publicPayload);
        await userPuter.kv.del(privateKey);

        return { project: publicPayload };
    } catch (e) {
        return jsonError(500, 'failed to share project', { message: e.message || 'Unknown error' });
    }
})

// Moves project from app-level public KV (me.puter.kv) → user's private KV (owner only)
router.post('/api/projects/unshare', async ({request, user}) => {
    try {
        const userPuter = user.puter;
        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const { id } = body;
        if(!id) return jsonError(400, 'Project ID is required');

        const { uuid: userId } = await getUserInfo(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const publicKey = `${PUBLIC_PROJECT_PREFIX}${id}`;
        const project = await me.puter.kv.get(publicKey);
        if(!project) return jsonError(404, 'Project not found in public');

        if(project.ownerId !== userId) return jsonError(403, 'Not authorized to unshare this project');

        const { isPublic: _ip, sharedBy: _sb, sharedAt: _sa, ownerId: _oi, ...rest } = project;
        const privatePayload = { ...rest, isPublic: false };

        const privateKey = `${PROJECT_PREFIX}${id}`;
        await userPuter.kv.set(privateKey, privatePayload);
        await me.puter.kv.del(publicKey);

        return { project: privatePayload };
    } catch (e) {
        return jsonError(500, 'failed to unshare project', { message: e.message || 'Unknown error' });
    }
})

router.get('/', () => {
    return 'Hello World';
});
router.get('/api/hello', () => {
    return {'msg': 'hello'};
});
router.get('/*page', ({params}) => {
    return new Response(`Page ${params.page} not found`, {status: 404});
});
