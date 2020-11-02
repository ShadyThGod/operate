const nanoid = require("nanoid");
const drag = require("draggabilly");

class WindowClass {
  /**
   * Window Class constructor
   * @param {object} options Initial options
   * @param {string} [options.title] Title of Window
   * @param {string} [options.id] Custom Window ID
   * @param {string} [options.customCSS] Custom CSS (Make sure to scope your elements in the CSS file itself)
   * @param {object} [options.size] Initial size options
   * @param {string} [options.size.width] Initial width
   * @param {string} [options.size.height] Initial height
   * @param {string} [options.size.minHeight] Minimum height
   * @param {string} [options.size.maxHeight] Maximum height
   * @param {string} [options.size.minWidth] Minimum width
   * @param {string} [options.size.maxWidth] Maximum width
   * @param {boolean} [options.active] Window is active or not
   * @param {Element} [options.content] Window Content
   * @param {function[]} [options.eventListeners] Custom event listeners added to the window element
   * @param {string|string[]} [options.customClass] Custom class or classes
   * @param {Object[]} [options.menu] Object defining a menu
   * @param {string} [options.menu[].label] Label for menu item
   * @param {Object[]} [options.menu[].submenu] Object defining the submenu
   * @param {string} [options.menu[].submenu[].label] Label for submenu item
   * @param {function} [options.menu[].submenu[].click] Click handler for submenu item
   */
  constructor(options) {
    this.title = options.title || "Window";
    this.content =
      options.content ||
      document
        .createRange()
        .createContextualFragment('<div class="content"></div>');
    this.id = options.id || "w" + nanoid();
    this.customClass = options.customClass || [];
    this.customCSS = options.customCSS || undefined;
    this.eventListeners = options.eventListeners || undefined;
    this.size = options.size || undefined;
    this.onLoadFunction = options.onLoadFunction || undefined;
    this.menu = options.menu || undefined;
    this.draggie = undefined;

    this.DOMElement = this.getDOMElement();

    if (window.WindowInstances) window.WindowInstances.push(this);
  }

  /**
   * Register event listeners
   * @param {function[]} listeners
   */
  registerEventListeners(listeners) {
    if (listeners.length > 0) {
      listeners.forEach((listener) => {
        if (typeof listener.element === "string") {
          document
            .querySelector(listener.element)
            .addEventListener(listener.type, listener.handler);
        } else {
          document
            .getElementById(this.id)
            .addEventListener(listener.type, listener.handler);
        }
      });
    }
  }

  /**
   * Add window element to DOM
   * @param {object} [options] Optional options
   * @param {object} [options.position] Initial position of window
   * @param {number} [options.position.x] Initial x position of window
   * @param {number} [options.position.y] Initial y position of window
   * @param {boolean} [options.active] Window is active or not
   */
  addToDOM(options) {
    let element = this.DOMElement.window;
    let taskEl = this.DOMElement.taskbarButton;
    if (options) {
      if (options.position) {
        element.style.top = `${options.position.y}px`;
        element.style.left = `${options.position.x}px`;
      }
      if (options.active) {
        WindowClass.resetAllActive(this.DOMElement);
        element.classList.add("active");
        taskEl.classList.add("active");
        window.State.focused_window_id = this.id;
      }
    }
    let appended = !document.getElementById(this.id)
      ? document.querySelector(".main-area").appendChild(element)
      : document.getElementById(this.id);
    if (!document.getElementById("task-" + this.id))
      document.querySelector(".taskbar .windows").appendChild(taskEl);
    let draggie = new drag(appended, {
      containment: ".main-area",
      handle: ".titlebar",
    });
    this.draggie = draggie;
    if (this.onLoadFunction !== undefined && appended) this.onLoadFunction();
    if (this.eventListeners !== undefined)
      this.registerEventListeners(this.eventListeners);
  }

  /**
   * Remove window element from DOM
   */
  removeFromDOM() {
    document.querySelector(`#${this.id}`).remove();
    document.querySelector(`#task-${this.id}`).remove();
  }

  /**
   * Show window
   */
  show() {
    document.querySelector(`#${this.id}`).style.display = "";
  }

  /**
   * Hide window
   */
  hide() {
    document.querySelector(`#${this.id}`).style.display = "none";
  }

  /**
   * Make current window active
   */
  makeActive() {
    WindowClass.resetAllActive(this.DOMElement);
    document.querySelector(`#${this.id}`).classList.add("active");
    document.querySelector(`#task-${this.id}`).classList.add("active");
    window.State.focused_window_id = this.id;
  }

  /**
   * Get the window element and the taskbar button element as an object.
   */
  getDOMElement() {
    let DOMElement = document.createElement("div");
    DOMElement.className = "window";
    DOMElement.id = this.id;
    DOMElement._windowClass = this;
    if (typeof this.customClass === "string")
      DOMElement.classList.add(this.customClass);
    if (typeof this.customClass === "object" && this.customClass.length > 0) {
      this.customClass.forEach((className) =>
        DOMElement.classList.add(className)
      );
    }
    if (this.size !== undefined && typeof this.size === "object") {
      Object.keys(this.size).forEach((k) => {
        DOMElement.style[k] = this.size[k];
      });
    }

    let titlebar = document.createElement("div");
    titlebar.className = "titlebar";

    let title = document.createElement("div");
    title.className = "title";
    title.textContent = this.title;

    let controls = document.createElement("div");
    controls.className = "controls";

    let exitButton = document.createElement("div");
    exitButton.className = "exit button";
    exitButton.innerHTML = "&#10005;";

    let minimizeButton = document.createElement("div");
    minimizeButton.className = "minimize button";
    minimizeButton.innerHTML = "&#8722;";

    controls.appendChild(minimizeButton);
    controls.appendChild(exitButton);

    titlebar.appendChild(title);
    titlebar.appendChild(controls);

    let menu = document.createElement("div");
    if (this.menu) {
      menu.className = "menu";

      this.menu.forEach((menuItem) => {
        let menuItemDOM = document.createElement("div");
        menuItemDOM.className = "item";
        menuItemDOM.textContent = menuItem.label;

        menuItemDOM.onclick = (e) => {
          if (document.querySelector(".active-item")) {
            document
              .querySelector(".active-item")
              .classList.remove("active-item");
          }

          if (e.target.classList.contains("active-item")) {
            e.target.classList.remove("active-item");
          } else {
            e.target.classList.add("active-item");
          }
        };

        if (menuItem.submenu) {
          let subMenuDOM = document.createElement("div");
          subMenuDOM.className = "submenu";
          menuItem.submenu.forEach((subMenuItem) => {
            let subMenuItemDOM = document.createElement("div");
            subMenuItemDOM.className = "item";
            subMenuItemDOM.textContent = subMenuItem.label;
            subMenuItemDOM.onclick = subMenuItem.click;
            subMenuDOM.appendChild(subMenuItemDOM);
          });
          menuItemDOM.appendChild(subMenuDOM);
        }

        menu.appendChild(menuItemDOM);
      });
    } else {
      menu = undefined;
    }

    let content = document.createElement("div");
    content.className = "content";
    content.appendChild(this.content);
    content.innerHTML = content.innerHTML;

    if (this.customCSS !== undefined && this.customCSS.length > 0) {
      let styleElement = document.createElement("style");
      styleElement.id = "style-" + this.id;
      styleElement.innerHTML = this.customCSS;
      DOMElement.appendChild(styleElement);
    }

    DOMElement.appendChild(titlebar);
    if (this.menu && menu) DOMElement.appendChild(menu);
    DOMElement.appendChild(content);

    let taskbarButton = document.createElement("div");
    taskbarButton.className = "task button";
    taskbarButton.textContent = this.title;
    taskbarButton.id = "task-" + this.id;

    return {
      window: DOMElement,
      taskbarButton: taskbarButton,
    };
  }

  /**
   * Make all windows non-active except the current window if provided.
   * @param {object} currentWindow Current Window's DOMElement object
   */
  static resetAllActive(currentWindow) {
    let windowEl =
      currentWindow !== undefined ? currentWindow.window : undefined;
    let taskEl =
      currentWindow !== undefined ? currentWindow.taskbarButton : undefined;
    document.querySelectorAll(".active").forEach(function (element) {
      if (!element.isEqualNode(windowEl) && !element.isEqualNode(taskEl)) {
        window.State.focused_window_id = null;
        element.classList.remove("active");
      }
    });
  }

  /**
   * @returns {boolean} Whether Window is minimized or not
   */
  get isMinimized() {
    return document.getElementById(this.id).style.display === "none"
      ? true
      : false;
  }
}

module.exports = {
  WindowClass,
};
