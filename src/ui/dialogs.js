/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let activeDialog = undefined;

function appendMessage(container, message) {
    let paragraphs = message.split(/\n\s*\n/);
    for (let paragraph of paragraphs) {
        let p = document.createElement('p');
        let lines = paragraph.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) {
                p.appendChild(document.createElement('br'));
            }
            p.appendChild(document.createTextNode(lines[i]));
        }
        container.appendChild(p);
    }
}

function closeDialog(value) {
    if (activeDialog === undefined) {
        return;
    }
    let dialog = activeDialog;
    activeDialog = undefined;
    document.removeEventListener('keydown', dialog.onKeyDown);
    dialog.layer.remove();
    if (dialog.previousFocus !== undefined && typeof dialog.previousFocus.focus === 'function') {
        dialog.previousFocus.focus({preventScroll: true});
    }
    dialog.resolve(value);
}

function showDialog({title, message, value, hasInput}) {
    if (activeDialog !== undefined) {
        closeDialog(null);
    }

    let previousFocus = document.activeElement;
    let layer = document.createElement('div');
    layer.className = 'app-dialog-layer';

    let dialog = document.createElement('section');
    dialog.className = 'app-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    let heading = document.createElement('h2');
    heading.className = 'app-dialog-title';
    heading.textContent = title;
    let headingId = `app-dialog-title-${Date.now()}`;
    heading.id = headingId;
    dialog.setAttribute('aria-labelledby', headingId);

    let messageBox = document.createElement('div');
    messageBox.className = 'app-dialog-message';
    appendMessage(messageBox, message);

    let input;
    if (hasInput) {
        input = document.createElement('input');
        input.className = 'app-dialog-input';
        input.type = 'text';
        input.value = value;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-label', 'Dialog value');
    }

    let actions = document.createElement('div');
    actions.className = 'app-dialog-actions';
    let cancel = document.createElement('button');
    cancel.className = 'app-dialog-button';
    cancel.type = 'button';
    cancel.textContent = hasInput ? 'Cancel' : 'Close';
    let confirm = document.createElement('button');
    confirm.className = 'app-dialog-button app-dialog-button-primary';
    confirm.type = 'button';
    confirm.textContent = 'OK';
    actions.append(cancel, confirm);

    dialog.append(heading, messageBox);
    if (input !== undefined) {
        dialog.appendChild(input);
    }
    dialog.appendChild(actions);
    layer.appendChild(dialog);
    document.body.appendChild(layer);

    return new Promise(resolve => {
        let onKeyDown = ev => {
            if (ev.key === 'Escape') {
                ev.preventDefault();
                closeDialog(null);
            } else if (ev.key === 'Enter' && input !== undefined) {
                ev.preventDefault();
                closeDialog(input.value);
            }
        };
        activeDialog = {layer, resolve, previousFocus, onKeyDown};
        document.addEventListener('keydown', onKeyDown);
        cancel.addEventListener('click', () => closeDialog(null));
        confirm.addEventListener('click', () => closeDialog(input === undefined ? true : input.value));
        if (input !== undefined) {
            input.focus();
            input.select();
        } else {
            confirm.focus();
        }
    });
}

/**
 * @param {!string} title
 * @param {!string} message
 * @param {!string} value
 * @returns {!Promise.<(null|string)>}
 */
function showPrompt(title, message, value) {
    return showDialog({title, message, value, hasInput: true});
}

/**
 * @param {!string} title
 * @param {!string} message
 * @returns {!Promise.<boolean>}
 */
function showAlert(title, message) {
    return showDialog({title, message, value: '', hasInput: false});
}

export {showAlert, showPrompt};
