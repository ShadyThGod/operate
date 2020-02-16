# Operate

Operate is a very primitive re-creation of an operating system inside the browser. It started as an attempt to re-create the style of an operating system in CSS, and then I went ahead and tried to create an API around it.

**[Use Operate](https://operate.amanharwara.xyz/)**

## Why?

Operate serves no purpose other than learning experience for me. It lacks important features like a filesystem to serve as a proper operating system.

There aren't any useful apps either. However, I've built the system with extensibility in mind. You can create and submit your own apps. Look at the **Documentation** section for info on how to do this.

## Features

### Current
- Basic Notepad app
- Basic Settings app that allows you to change the background

### Upcoming
- A basic drawing app
- A very basic filesystem
- Calculator
- Command Prompt

## How To Use

Go to [this link](https://operate.amanharwara.xyz/) to use Operate.

If you want to run Operate on your own computer, follow these steps:

- Make sure you have NodeJS installed.
- Clone this repository. You can delete the `docs` folder if you want to.
- Run `npm install` in your command prompt.
- After that, run `npm start`
- This will start a local server on `localhost:1234`

# Documentation:

## How to create new apps?

All the files for apps should be put inside the `apps` folder.

The `WindowClass` class is the base for any app. Documentation for it is provided below. Since the main `WindowClass` is loaded at the start, you don't have to specifically import it in your app, neither do you have to instantiate it. You only have to create a new Object containing all the info.

The example below will explain it to you:

Create a new folder inside the _apps_ directory with the name of the app. E.g. `newApp`

- Create the main `index.js` file inside that folder. This will be the file that will be loaded.

- Create a CSS file if you want. E.g. `newApp.css`. This will imported inside the **index.js** file.

- Inside the `index.js` file, import your CSS using `import` statement

- Export an Object containing any options you want to use for the Window class.

- Import the folder in the `index.js` file inside the apps directory.

### Example:

_newApp.css_:
```css
#newApp {
    background: blue;
}
```

_newApp/index.js_:
```js
import * as newAppCSS from './newApp.css';

let content = document.createElement('p');
content.textContent = 'New App Content';

module.exports = {
    title: 'New App',
    content: content,
    customCSS: newAppCSS,
    // You can add more options. Refer the WindowClass documentation
};
```

_apps/index.js_:
```js
// Start of the file
const newAppWindow = require('./newApp');

module.exports = {
    newAppWindow,
    //... There might be more here. Don't remove them.
}
```

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
