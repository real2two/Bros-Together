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

let loadedLevel = {};
const loadedBodies = [];

function loadLevel(level) {
    for (let i = 0; i < loadedBodies.length; ++i) {
        Composite.remove(currentScene.engine.world, loadedBodies[i]);
        currentScene.bodies.splice(currentScene.bodies.indexOf(loadedBodies[i]), 1);
    }

    const { blocks } = level;

    for (const { x, y, width, height } of blocks) {
        loadedBodies.push(createBlock(x, y, width, height, { isStatic: true }));
    }

    loadedLevel = level;
}