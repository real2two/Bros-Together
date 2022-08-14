document.getElementById('level_data').onchange = evt => {
    try {
        const level = JSON.parse(evt.target.value);
        delete level.recording;

        loadLevel(level);
    } catch(err) {};
}