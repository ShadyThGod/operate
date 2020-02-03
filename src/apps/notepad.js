import * as notepadWindowCSS from './notepad.scss';

let notepadWindowContent = document.createRange().createContextualFragment(`
<textarea></textarea>
`);

let notepadWindow = {
    title: 'Notepad',
    id: 'notepad',
    content: notepadWindowContent,
    customCSS: notepadWindowCSS,
    size: {
        height: '30%',
        minHeight: '30%',
    }
};

module.exports = notepadWindow;