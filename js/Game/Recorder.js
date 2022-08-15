let playing_recording = false;

let recording = false;
let recording_since = null;

let started_playing;
let playing_actions;
let bot_pos = { x: 0, y: 0 };
let movements = [];

// record

function startRecording() {
    stopRecording(false);

    killPlayer();
    recording = true;

    setInterval(() => {
        movements.push({ ...gameScene.player.position });
    }, 16);
}

function stopRecording(log = true) {
    if (!recording) return;

    if (log === true) {
        console.log(JSON.stringify(movements));
    }

    recording = false;
    recording_since = null;

    movements = [];
    bot_pos = { x: 0, y: 0 };
}

// play

async function playRecording(actions) {
    stopPlayingRecording(true);

    playing_actions = actions;
    started_playing = performance.now();
}

function stopPlayingRecording(pr = false) {
    if (!playing_recording && !pr) return;

    playing_recording = pr;
    started_playing = null;
    playing_actions = null;

    killPlayer();
}