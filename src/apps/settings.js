/**
 * Settings Window
 */

import * as settingsWindowCSS from './settings.scss';

let settingsWindowContent = document.createRange().createContextualFragment(`
    <div class="settings">
        <div id="background-setting" class="setting">
            <div class="label" style="flex-grow: 100">
                Background Image:
            </div>
            <div class="input" style="flex-grow: 1">
                <label for="bg-file" style="width: fit-content" class="button">Browse...</label>
                <input type="file" name="bg-file" id="bg-file" accept="image/*">
            </div>
        </div>
    </div>
    <div class="buttons">
        <div class="cancel-button button">Cancel</div>
        <div class="apply-button button">Apply</div>
        <div class="ok-button button">OK</div>
    </div>
`);

function applySettings() {
    let bgImg = document.querySelector('#bg-file').files || undefined;
    if (bgImg !== undefined) {
        document.body.style.backgroundImage = `url(${window.URL.createObjectURL(bgImg[0])})`;
    }
}

function applySettingsAndClose(e) {
    applySettings();
    e.target.closest('.window')._windowClass.removeFromDOM();
}

function closeWindow(e) {
    e.target.closest('.window')._windowClass.removeFromDOM();
}

let settingsWindow = {
    title: 'Settings',
    id: 'settings',
    content: settingsWindowContent,
    customCSS: settingsWindowCSS,
    eventListeners: [{
        type: 'click',
        handler: applySettings,
        element: '.apply-button'
    }, {
        type: 'click',
        handler: applySettingsAndClose,
        element: '.ok-button'
    }, {
        type: 'click',
        handler: closeWindow,
        element: '.cancel-button'
    }],
};

module.exports = settingsWindow;