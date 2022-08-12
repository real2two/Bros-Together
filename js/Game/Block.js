class Block {
    constructor(p_px, p_py, p_sx, p_sy, p_opt) {
        this.body = Matter.Bodies.rectangle(p_px, p_py, p_sx, p_sy, p_opt);

        if (currentScene.bodies !== undefined)
            currentScene.bodies.push(this.body);

        if (currentScene.blocks !== undefined)
            currentScene.blocks.push(this.body);

        if (currentScene.engine.world === undefined)
            throw new Error("Current scene does not have a `Matter.js` Engine called `engine`!");

        Matter.Composite.add(currentScene.engine.world, this.body);
    }
}