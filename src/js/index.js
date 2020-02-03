import '../css/normalize.scss';
import '../css/index.scss';
const {
    toggleStartMenu
} = require('./start-menu');
const {
    WindowClass
} = require('./window-class');

// Keep collection of window instances
window.WindowInstances = [];

// Import all apps
import('../apps').then(apps => {
    // Iterate through them
    for (var i in apps) {
        let app = apps[i];
        // Create & add start menu entry
        let startMenuEntry = document.createRange().createContextualFragment(`<li class="item" id="start-${app.id}">${app.title}</li>`);
        document.querySelector('.start .menu').appendChild(startMenuEntry);
        // Instantiate the Window
        let appWindow = new WindowClass(app);
    }
});

document.body.addEventListener('click', function (e) {
    // Closes windows
    if (e.target.className === 'exit button') {
        let window = e.target.closest('.window');
        window._windowClass.removeFromDOM();
    }
    // Focus window on click
    if (e.target.closest('.window')) {
        e.target.closest('.window')._windowClass.makeActive()
    } else {
        WindowClass.resetAllActive();
    }
    // Minimize windows
    if (e.target.className === 'minimize button') {
        WindowClass.resetAllActive();
        let window = e.target.closest('.window');
        window._windowClass.hide();
    }
    // Focus window on taskbar task click
    if (e.target.classList.contains('task')) {
        document.getElementById(e.target.id.replace('task-', ''))._windowClass.makeActive();
        document.getElementById(e.target.id.replace('task-', ''))._windowClass.show();
    }
    // Find and open window on Start Menu item click
    if (e.target.classList.contains('item') && e.target.closest('.start')) {
        let windowID = e.target.id.replace('start-', '');
        let instance = window.WindowInstances.filter(w => w.id === windowID)[0];
        if (instance !== undefined) {
            instance.addToDOM({
                active: true
            });
            instance.show();
        }
        toggleStartMenu();
    }
    // Close start menu if not in focus
    if (!e.target.closest('.start')) {
        toggleStartMenu('close');
    }
});

document.querySelector('.time').textContent = new Date().toLocaleTimeString(undefined, {
    timeStyle: 'short'
});
let timeInterval = window.setInterval(function () {
    document.querySelector('.time').textContent = new Date().toLocaleTimeString(undefined, {
        timeStyle: 'short'
    });
}, 1000);