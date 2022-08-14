document.getElementById('level_data').onchange = evt => {
    try {
        loadLevel(JSON.parse(evt.target.value));
    } catch(err) {};
}