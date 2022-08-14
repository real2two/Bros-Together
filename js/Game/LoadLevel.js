const MAX_LEVELS = 3;
const CACHED_LEVELS = {};

let level = 1;

cacheLevels();

async function cacheLevels() {
    for (let i = 0; i < MAX_LEVELS; ++i) {
        if (CACHED_LEVELS[i + 1]) continue;

        try {
            const res = await fetch(`res/levels/${i + 1}.json`);
            CACHED_LEVELS[i + 1] = await res.json();
        } catch(err) {
            alert('An error has occured while trying to load a level. Expect errors. (Try reloading!)');
            console.error(err);
        }
    }
}

// FOR PRODUCTION:
async function loadLevelByID(id) {
    stopDebugLevel();

    if (!CACHED_LEVELS[id]) return alert(`Cannot find level with the provided ID. (${id})`)
    loadLevel(CACHED_LEVELS[id])

    /*
    try {
        const res = await fetch(`res/levels/${id}.json`);
        return loadLevel(await res.json());
    } catch(err) {
        alert('Failed to load level.');
    }
    */
}

const loadedLevel = { start_pos: { x: 0, y: 0 }, blocks: [] };
let loadedBodies = [];

let shown_sprites = [];

function loadLevel({ start_pos = { x: 0, y: 0 }, sprites = [], blocks, recording }) {
    if (!start_pos.x) start_pos.x = 0;
    if (!start_pos.y) start_pos.y = 0;

    loadedLevel.start_pos = start_pos;
    loadedLevel.blocks = blocks;
    loadedLevel.sprites = sprites;

    shown_sprites = sprites;

    Composite.remove(currentScene.engine.world, loadedBodies);

    for (const body of loadedBodies) {
        if (currentScene.bodies.indexOf(body) !== -1) {
            body.removed = true;
            currentScene.bodies.splice(currentScene.bodies.indexOf(body), 1);
        }
    }

    loadedBodies = [];

    for (const block of blocks) {
        addBlock(block);
    }

    Body.setPosition(gameScene.player, start_pos);
    Body.setVelocity(gameScene.player, { x: 0, y: 0 });
    Body.setAngularVelocity(gameScene.player, 0);

    gameScene.player.grounded = false;
    gameScene.player.firstJump = false;

    if (recording) {
        if ('lasts' in recording === false || 'actions' in recording === false) return;
        if (recording.actions === null) return;

        return playRecording(recording);
    }
}

function addBlock({ after_recording, is = 'static', x = 0, y = 0, width = 10, height = 10, killzone = false, properties = {} }) {
    if (playing_recording && after_recording === true) return;
    
    let block;
    switch (is) {
        case 'static':
            block = createBlock(x, y, width, height, { isStatic: true, ...properties });
            break;
        case 'movable':
            block = createBlock(x, y, width, height, properties);
            break;
        case 'collectable':
            block = createBlock(x, y, width, height, { restitution: 0, mass: 0, inverseMass: 0, ...properties });
            break;
    }

    block.is = is;
    block.killzone = killzone;

    loadedBodies.push(block);
}