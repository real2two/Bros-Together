let playing_recording = false;

let recording = false;
let recording_since = null;

let movements = [];
let movement_intervals = [];
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

function playRecording({ actions, lasts }) {
    stopPlayingRecording(true);

    for (const { when, press, hold } of actions) {
        if (typeof when !== 'number') when = 0;

        movement_intervals.push(
            setTimeout(() => {
                switch (press) {
                    case 'w':
                        jump();
                        break;
                    case 'a':
                    case 'd':
                        holding[press] = hold;
                        break;
                }
            }, when)
        );
    }

    movement_intervals.push(
        setTimeout(() => {
            stopPlayingRecording();
        }, lasts)
    )
}

function stopPlayingRecording(pr = false) {
    if (!playing_recording && !pr) return;

    for (const interval of movement_intervals) clearTimeout(interval);

    holding.a = false;
    holding.d = false;

    playing_recording = pr;

    killPlayer();
}