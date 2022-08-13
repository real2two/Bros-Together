const AUDIO = {};

async function loadAudio(id, path) {
    // TODO: add error handling.
    return await new Promise((resolve, reject) => {
        loadSound(`res/${path}`, audio => {
            resolve(AUDIO[id] = audio);
        });
    });
}

function clearAudio() {
    for (const [ id, audio ] of Object.entries(AUDIO)) {
        audio.stop();
        delete AUDIO[id]
    }
}