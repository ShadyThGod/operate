import * as notepadWindowCSS from "./notepad.scss";

let notepadWindowContent = document.createRange().createContextualFragment(`
<textarea id="notepad-textarea"></textarea>
<input type="file" style="display: none" id="notepad-file-input" accept="text/plain"/>
`);

function onLoad() {
  document.getElementById("notepad-textarea").focus();
  document
    .getElementById("notepad-file-input")
    .addEventListener("input", (e) => {
      for (const file of e.target.files) {
        file
          .text()
          .then(
            (text) => (document.getElementById("notepad-textarea").value = text)
          );
      }
      e.target.value = "";
    });
}

let notepadWindow = {
  title: "Notepad",
  id: "notepad",
  content: notepadWindowContent,
  customCSS: notepadWindowCSS,
  menu: [
    {
      label: "File",
      submenu: [
        {
          label: "Open",
          click: () => {
            document.getElementById("notepad-file-input").click();
          },
        },
        {
          label: "Save",
          click: () => {
            let text = document.getElementById("notepad-textarea").value;
            let text_blob = new Blob([text], { type: "text/plain" });
            window.URL = window.URL || window.webkitURL;
            let link = document.createElement("a");
            link.download = "note.txt";
            link.href = window.URL.createObjectURL(text_blob);
            link.click();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Select All",
          click: () => {
            document.getElementById("notepad-textarea").select();
          },
        },
      ],
    },
  ],
  onLoadFunction: onLoad,
  size: {
    height: "30%",
    minHeight: "30%",
  },
};

module.exports = notepadWindow;
