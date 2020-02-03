# Operate

Operate is a very primitive re-creation of an operating system inside the browser. It started as an attempt to re-create the style of an operating system in CSS, and then I went ahead and tried to create an API around it.

## [Demo](https://shadythgod.github.io/operate)

## WindowClass

`WindowClass` is the class you can use to create new windows. See below for and examples.

**`new WindowClass({options?})`**

### Properties

`title`: Title of the window

`content`: Content of the window

`id`: ID of the window

`customClass`: Custom classes applied to the window

`customCSS`: Custom CSS imported from a file

`eventListeners`: Array containing any custom event listeners for the window

`DOMElement`: The DOM elements for the window itself and the taskbar button

`isMinimized`: Whether window is minimized or not

### Constructor Options

`title`: Title of the window

`content`: Window Content

`active`: Window is active or not

`id`: Custom Window ID (Generates random ID if no value is provided)

`customClass`: Custom class or classes

`customCSS`: Custom CSS (Make sure to scope your elements in the CSS file itself)

`eventListeners`: Array of custom event listeners added to the window element

`size`: Initial size options

`size.width`: Initial width

`size.height`: Initial height

`size.minHeight`: Minimum height

`size.maxHeight`: Maximum height

`size.minWidth`: Minimum width

`size.maxWidth`: Maximum width

### Methods

#### `addToDOM(options?)`

Adds window element to the DOM

**Options:**

`position.x`: X-coordinate of window

`position.y`: Y-coordinate of window

`active`: If window is active or not

#### `removeFromDOM()`

Removes window element from DOM

#### `show()`

Shows window

#### `hide()`

Hides window

#### `makeActive()`

Make the window active

### Static Methods

#### `resetAllActive(window?)`

Make all windows non-active except the window provided if one is provided

### Example

```js
// Import Window Class
const WindowClass = require('./js/window-class');

// Import custom CSS
import * as newWindowCSS from './css/new-window.css';

// Create content for the window (Can be a DocumentFragment as well)
let content = document.createElement('h1');
content.textContent = 'Hello!';

// Create new instance
let window = new WindowClass({
    title: 'New Window',
    content: content,
    active: true,
    id: 'new-window',
    customClass: ['new', 'window'],
    customCSS: newWindowCSS,
    size: {
        width: '50%',
        height: '50vh',
        minHeight: '40rem',
        maxHeight: '90vmax'
    }
});

// Add instance to DOM using the method
window.addToDOM();
```