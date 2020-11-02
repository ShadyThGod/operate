import * as cmdPromptCSS from "./cmdprompt.scss";
import { getPromptElement, inputKeyDownHandler } from "./utils";

let cmdPromptWindowContent = document.createRange().createContextualFragment(`
  <div class="command-prompt" id="command-prompt-content"></div>
`);

function onLoad() {
  window.State.CmdPrompt = {
    history: [],
    currentIndexInHistory: undefined,
  };

  if (!document.querySelector(".prompt")) {
    document
      .getElementById("command-prompt-content")
      .appendChild(getPromptElement());
  }
  document
    .getElementById("prompt-input")
    .addEventListener("keydown", inputKeyDownHandler);
  document.getElementById("prompt-input").focus();
}

let cmdPromptWindow = {
  title: "Command Prompt",
  id: "cmdprompt",
  content: cmdPromptWindowContent,
  customCSS: cmdPromptCSS,
  onLoadFunction: onLoad,
  eventListeners: [
    {
      type: "click",
      handler: () => {
        document.getElementById("prompt-input").focus();
      },
    },
  ],
};

module.exports = cmdPromptWindow;
