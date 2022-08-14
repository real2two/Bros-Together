let level_debug_interval;
let old_level_data;

let savedRecording;

function startLevelDebug(level_id, enable_errors = false) {
    if (PRODUCTION === true) return loadLevelByID(level_id);

    stopDebugLevel();

    let first_load = true;

    level_debug_interval = setInterval(async () => {
        const res = await fetch(`res/levels/${level_id}.json`);
        
        let level_data;
        let level;
    
        try {
            level_data = await res.text();
            level = JSON.parse(level_data);
        } catch(err) {
            if (enable_errors || first_load) console.error(err);
            if (first_load) {
                alert('Cannot find level with provided ID.');
                document.getElementById('level_id').value = '';
                stopDebugLevel();
            }
            return;
        };

        first_load = false;
    
        if (old_level_data === level_data) return;
        old_level_data = level_data;

        savedRecording = level.recording;
        delete level.recording;
    
        loadLevel(level);
    }, 100);
}

function stopDebugLevel() {
    if (level_debug_interval) {
        clearInterval(level_debug_interval);
        level_debug_interval = null;

        old_level_data = null;
        savedRecording = null;

        loadLevel({ start_pos: { x: 0, y: 0 }, blocks: [ { is: 'static', x: 0, y: 72, width: 768, height: 20 } ] });
    }
}

document.getElementById('level_id').onchange = evt => {
    const level_id = evt.target.value;
    if (level_id === '') return stopDebugLevel();
    startLevelDebug(level_id);
}

function playRecordedRecording() {
    if (!savedRecording) return alert('Cannot find saved recording.');
    
    const level = JSON.parse(old_level_data);
    level.recording = savedRecording;

    loadLevel(level);
}