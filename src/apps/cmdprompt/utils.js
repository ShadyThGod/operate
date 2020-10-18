const commands = {
  echo: {
    requiresValue: true,
    returnsResult: true,
    description: "Prints any value passed to it.",
    handler: (value) => {
      return value;
    },
  },
  clear: {
    requiresValue: false,
    returnsResult: false,
    description: "Clears the command prompt.",
    handler: () => {
      document.getElementById("command-prompt-content").innerHTML = "";

      setTimeout(() => {
        addNewPrompt();
        console.clear();
      }, 1);
    },
  },
  calc: {
    requiresValue: false,
    returnsResult: false,
    description: "Opens the calculator.",
    handler: () => {
      openApp("calculator");
    },
  },
  notepad: {
    requiresValue: false,
    returnsResult: false,
    description: "Opens the notepad.",
    handler: () => {
      openApp("notepad");
    },
  },
  help: {
    requiresValue: false,
    returnsResult: true,
    description: "Shows this help dialog.",
    handler: () => {
      let result = "";
      for (let key of Object.keys(commands)) {
        result += `${key}:\t\t${commands[key].description}\n`;
      }
      return result;
    },
  },
};

function openApp(ID) {
  let instance = window.WindowInstances.filter((w) => w.id === ID)[0];
  if (instance !== undefined) {
    instance.addToDOM({
      active: true,
    });
    instance.show();
  }
}

function inputKeyDownHandler(e) {
  if (e.key === "Enter" && e.target.value.length !== 0) {
    e.preventDefault();
    let command = parseCommand(e.target.value);
    runCommand(command);
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    let history = window.State.CmdPrompt.history;
    if (history.length !== 0) {
      let currentIndexInHistory = window.State.CmdPrompt.currentIndexInHistory;
      if (currentIndexInHistory) {
        currentIndexInHistory =
          currentIndexInHistory !== 0
            ? currentIndexInHistory - 1
            : currentIndexInHistory;
        window.State.CmdPrompt.currentIndexInHistory = currentIndexInHistory;
      } else {
        currentIndexInHistory = window.State.CmdPrompt.history.length - 1;
        window.State.CmdPrompt.currentIndexInHistory = currentIndexInHistory;
      }
      let { name, value } = window.State.CmdPrompt.history[
        currentIndexInHistory
      ];
      document.getElementById("prompt-input").value = `${name}${
        value ? " " + value : ""
      }`;
    }
  }
}

function getPromptElement() {
  let promptElement = document.createElement("div");
  promptElement.className = "prompt";
  let promptTextElement = document.createElement("div");
  promptTextElement.textContent = "C:\\OPERATE>";
  promptTextElement.className = "prompt-text";
  let promptInputElement = document.createElement("input");
  promptInputElement.id = "prompt-input";
  promptInputElement.type = "text";
  promptTextElement.className = "prompt-input";
  promptElement.appendChild(promptTextElement);
  promptElement.appendChild(promptInputElement);
  return promptElement;
}

function parseCommand(input) {
  let commandRegEx = new RegExp(/^\s*(\w+)\s?(.+)*$/);
  let matches = commandRegEx.exec(input);
  if (matches) {
    let name = matches[1];
    let value = matches[2] ? matches[2].trimEnd() : undefined;
    return { name, value };
  }
}

function printCommand(command, result) {
  let { name, value } = command;

  let commandText = document.createElement("div");
  commandText.className = "command-text";
  commandText.innerText = `${name}${value ? ` ${value}` : ""}`;

  let currentInput = document.getElementById("prompt-input");
  currentInput.parentElement.appendChild(commandText);
  currentInput.remove();

  let resultText = document.createElement("div");
  resultText.className = "result";
  resultText.innerText = result;
  document.getElementById("command-prompt-content").appendChild(resultText);

  addNewPrompt();
}

function runCommand(command) {
  let result = "";
  let { name, value } = command;

  if (name && commands[name]) {
    if (commands[name].requiresValue) {
      if (value) {
        if (commands[name].returnsResult) {
          result = commands[name].handler(value);
        } else {
          commands[name].handler(value);
        }
      } else {
        result = "Please enter a value for the command.";
      }
    } else {
      if (commands[name].returnsResult) {
        result = commands[name].handler();
      } else {
        commands[name].handler();
      }
    }
  } else {
    result = `${name} is not a valid command.`;
  }

  if (
    JSON.stringify(
      window.State.CmdPrompt.history[window.State.CmdPrompt.history.length - 1]
    ) !== JSON.stringify(command)
  ) {
    window.State.CmdPrompt.history.push(command);
  }

  printCommand(command, result);
}

function addNewPrompt() {
  document
    .getElementById("command-prompt-content")
    .appendChild(getPromptElement());
  document
    .getElementById("prompt-input")
    .addEventListener("keydown", inputKeyDownHandler);
  if (window.State.focused_window_id === "cmdprompt") {
    document.getElementById("prompt-input").focus();
  }
}

module.exports = {
  addNewPrompt,
  getPromptElement,
  inputKeyDownHandler,
  printCommand,
  runCommand,
  parseCommand,
};
