document.getElementById('upload').addEventListener('change', function() {
    if (!this.files.length) return;

    const reader = new FileReader();
    reader.onload = () => {
        let data;
        try {
            data = JSON.parse(reader.result);
        } catch(err) {
            console.error(err);
            return alert('Could not parse JSON.');
        }

        loadLevel(data);
    };

    reader.readAsText(this.files[0]);
});

/*
function createBlock(p_px, p_py, p_sx, p_sy, p_opt) {
    let body = Bodies.rectangle(p_px, p_py, p_sx, p_sy, p_opt);

    if (currentScene.bodies)
        currentScene.bodies.push(body);

    //if (currentScene.blocks)
    //currentScene.blocks.push(this.body);

    if (currentScene.engine.world === undefined)
        throw new Error("Current scene does not have a `js` Engine called `engine`!");

    Composite.add(currentScene.engine.world, body);
    return body;
}
*/

const loadedLevel = { blocks: [] };
let loadedBodies = [];

function loadLevel({ blocks }) {
    loadedLevel.blocks = blocks;

    Composite.remove(currentScene.engine.world, loadedBodies);
    for (const body of loadedBodies) {
        if (currentScene.bodies.indexOf(body) !== -1) {
            currentScene.bodies.splice(currentScene.bodies.indexOf(body), 1);
        }
    }
    loadedBodies = [];

    for (const block of blocks) {
        addBlock(block);
    }
}

function addBlock({ is, x, y, width, height, killzone = false, properties = {} }) {
    let block;
    switch (is) {
        case 'static':
            block = createBlock(x, y, width, height, { isStatic: true, ...properties });
            break;
        case 'movable':
            block = createBlock(x, y, width, height, properties);
            break;
        case 'collectable':
            block = createBlock(x, y, width, height, properties);
            break;
    }

    block.is = is;
    block.killzone = killzone;

    console.log(block)
    loadedBodies.push(block);
}