const AUDIO = {};

async function loadAudio(id, path) {
    // TODO: add error handling.
    return await new Promise((resolve, reject) => {
        loadSound(`audio/${path}`, audio => {
            resolve(AUDIO[id] = audio);
        });
    });
}