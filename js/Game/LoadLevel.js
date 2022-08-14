// FOR PRODUCTION:
async function loadLevelByID(id) {
    const res = await fetch(`/res/levels/${id}.json`);
    loadLevel(await res.json());
}

const loadedLevel = { start_pos: { x: 0, y: 0 }, blocks: [{ is: 'static', x: 0, y: 72, width: 768, height: 20 }] };
let loadedBodies = [];

function loadLevel({ start_pos = { x: 0, y: 0 }, blocks, recording }) {
    if (!start_pos.x) start_pos.x = 0;
    if (!start_pos.y) start_pos.y = 0;

    loadedLevel.start_pos = start_pos;
    loadedLevel.blocks = blocks;

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

    if (recording) return playRecording(recording);
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