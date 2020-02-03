/**
 * Toggle Start Menu
 * @param {('open'|'close')} [state] Optionally, specify the state of the start menu.
 */
function toggleStartMenu(state) {
    if (state) {
        if (state === 'open') {
            document.querySelector('.start .toggle').checked = true;
        } else {
            document.querySelector('.start .toggle').checked = false;
        }
    } else {
        document.querySelector('.start .toggle').checked = !document.querySelector('.start .toggle').checked;
    }
}

module.exports = {
    toggleStartMenu
}