function addBody(p_body) {
    if (currentScene.bodies !== undefined)
        currentScene.bodies.push(this.body);

    if (currentScene.engine.world === undefined)
        throw new Error("Current scene does not have a `Matter.js` Engine called `engine`!");

    Matter.Composite.add(currentScene.engine.world, p_body);
}

function removeBody(p_body) {
    if (currentScene.bodies !== undefined)
        currentScene.bodies.push(this.body);

    if (currentScene.engine.world === undefined)
        throw new Error("Current scene does not have a `Matter.js` Engine called `engine`!");

    Matter.Composite.remove(currentScene.engine.world, p_body);
}