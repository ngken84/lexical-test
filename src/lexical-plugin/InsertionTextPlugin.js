import { ElementNode, createCommand, COMMAND_PRIORITY_LOW, $getSelection, $isRangeSelection  } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $setBlocksType } from '@lexical/selection'
import React from 'react';

export class InsertionTextNode extends ElementNode {
    
    constructor(key) {
        super(key);
    }

    static getType() {
        return "insertionText";
    }

    static clone(node) {
        return new InsertionTextNode(node.__key);
    }

    createDOM(config) {
        const element = document.createElement('span')
        element.className = config.theme.insertion;
        return element;
    }

    updateDOM(prevNode, __dom, _config) {
        return false;
    }
}

export function $createInsertionTextNode() {
    return new InsertionTextNode();
}

export function $isInsertionTextNode(node) {
    return node instanceof InsertionTextNode;
}

export const INSERT_INSERTION_TEXT = createCommand('insertInsertionText');

export const InsertionTextPlugin = () => {
    const [editor] = useLexicalComposerContext();
    if(!editor.hasNodes([InsertionTextNode])) {
        throw new Error('InsertionTextNode: InsertionTextNode not registered on Editor');
    }
    editor.registerCommand(INSERT_INSERTION_TEXT, () => {
        const selection = $getSelection();
        if($isRangeSelection(selection)) {
            $setBlocksType(selection, $createInsertionTextNode);
        }
        return true;
    }, COMMAND_PRIORITY_LOW)

    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();
            if($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createInsertionTextNode());
            }
        })
    }

    return <button onClick={onClick}>Insertion Text</button>
}