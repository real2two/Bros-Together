let playing_recording = false;

let recording = false;
let recording_since = null;

let movements = [];
let holding = {
    a: false,
    d: false
}

function startRecording() {
    stopRecording(false);

    killPlayer();
    recording = true;
}

function logMovement(press, hold) {
    if (!recording) return;
    
    const log = { when: performance.now(), press };

    if (typeof hold === 'boolean') {
        log.hold = hold; // true = start holding | false = stop holding

        if (holding[press] === true && log.hold === true) return;
        if (holding[press] === false && log.hold === false) return;

        holding[press] = hold;
    }

    movements.push(log);
}

function stopRecording(log = true) {
    if (!recording) return;

    if (log === true) {
        if (recording_since) {
            for (const movement of movements) {
                movement.when -= recording_since;
            }
    
            console.log(JSON.stringify(movements));
        } else {
            console.warn("There's nothing to log. You never started moving.");
        }
    }

    recording = false;
    recording_since = null;
    movements = [];
    holding.a = false;
    holding.d = false;
}

function playRecording(recording) {
    playing_recording = true;
    killPlayer();

    let i = 0;
    for (const record of recording) {
        const { when, press, hold } = record;
        setTimeout(() => {
            switch(press) {
                case 'w':
                    jump();
                    break;
                case 'a':
                case 'd':
                    holding[press] = hold;
                    break;
            }

            if (record === recording[recording.length - 1]) {
                stopPlayingRecording();
            }
        }, when);
        ++i;
    }
}

function stopPlayingRecording() {
    holding.a = false;
    holding.d = false;

    playing_recording = false;

    killPlayer();
}