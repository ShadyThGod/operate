import "../css/normalize.scss";
import "../css/index.scss";
const { toggle_start_menu } = require("./start-menu");
const { WindowClass } = require("./window-class");

// Keep collection of window instances
window.WindowInstances = [];

// Extra global state
window.State = {
  focused_window_id: null,
};

// Import all apps
import("../apps").then((apps) => {
  // Iterate through them
  for (var i in apps) {
    let app = apps[i];
    // Create & add start menu entry
    let start_menu_entry = document
      .createRange()
      .createContextualFragment(
        `<li class="item" id="start-${app.id}">${app.title}</li>`
      );
    document.querySelector(".start .menu").appendChild(start_menu_entry);
    // Instantiate the Window
    new WindowClass(app);
  }
});

document.body.addEventListener("click", function (e) {
  // Closes windows
  if (e.target.className === "exit button") {
    let window = e.target.closest(".window");
    window._windowClass.draggie.destroy();
    window._windowClass.removeFromDOM();
    return;
  }
  // Focus window on click
  if (e.target.closest(".window")) {
    e.target.closest(".window")._windowClass.makeActive();
  } else {
    WindowClass.resetAllActive();
  }
  // Minimize windows
  if (e.target.className === "minimize button") {
    WindowClass.resetAllActive();
    let window = e.target.closest(".window");
    window._windowClass.hide();
  }
  // Focus window on taskbar task click
  if (e.target.classList.contains("task")) {
    document
      .getElementById(e.target.id.replace("task-", ""))
      ._windowClass.makeActive();
    document
      .getElementById(e.target.id.replace("task-", ""))
      ._windowClass.show();
  }
  // Find and open window on Start Menu item click
  if (e.target.classList.contains("item") && e.target.closest(".start")) {
    let windowID = e.target.id.replace("start-", "");
    let instance = window.WindowInstances.filter((w) => w.id === windowID)[0];
    if (instance !== undefined) {
      instance.addToDOM({
        active: true,
      });
      instance.show();
    }
    toggle_start_menu();
  }
  // Close start menu if not in focus
  if (!e.target.closest(".start")) {
    toggle_start_menu("close");
  }
  // Close window menu if not in focus
  if (e.target.parentElement.className !== "menu") {
    if (document.querySelector(".active-item")) {
      document.querySelector(".active-item").classList.remove("active-item");
    }
  }
});

document.querySelector(".time").textContent = new Date().toLocaleTimeString(
  undefined,
  {
    timeStyle: "short",
  }
);
let timeInterval = window.setInterval(function () {
  document.querySelector(".time").textContent = new Date().toLocaleTimeString(
    undefined,
    {
      timeStyle: "short",
    }
  );
}, 1000);
