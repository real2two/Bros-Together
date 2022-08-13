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