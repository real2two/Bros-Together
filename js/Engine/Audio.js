const AUDIO = {};

async function loadAudio(id, path) {
    // TODO: add error handling.
    return await new Promise((resolve, reject) => {
        loadSound(`res/${path}`, audio => {
            resolve(AUDIO[id] = audio);
        });
    });
}