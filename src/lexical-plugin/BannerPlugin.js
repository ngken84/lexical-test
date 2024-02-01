import React from 'react';
import { ElementNode, EditorConfig, NodeKey, createCommand, COMMAND_PRIORITY_LOW, $getSelection, $isRangeSelection } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $setBlocksType } from '@lexical/selection'

export class BannerNode extends ElementNode {

    static getType() {
        return "kenbanner";
    }

    static clone(node) {
        return new BannerNode(node.__key);
    }

    createDOM(config) {
        const element = document.createElement('div');
        element.className = config.theme.banner;
        return element;
    }

    updateDOM(prevNode, __dom, _config) {
        console.log("updateDOM");
        console.log(prevNode);
        console.log(__dom);
        console.log(_config);
        return super.updateDOM;
    }

    
}

export const $createBannerNode = () => {
    return new BannerNode();
}

export const $isBannerNode = (node) => {
    return node instanceof BannerNode;
}

export const INSERT_BANNER_COMMAND = createCommand('insertBanner');

export const BannerPlugin = () => {

    const [editor] = useLexicalComposerContext();
    if(!editor.hasNodes([BannerNode])) {
        throw new Error('BannerPlugin: BannerNode not registered on Editor');
    }
    editor.registerCommand(INSERT_BANNER_COMMAND, () => {
        const selection = $getSelection();
        if($isRangeSelection(selection)) {
            $setBlocksType(selection, $createBannerNode);
        }
        return true;
    }, COMMAND_PRIORITY_LOW)

    const onClick = () => {
        editor.update(() => {
            const selection = $getSelection();
            if($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createBannerNode());
            }
        })
    }

    return <button onClick={onClick}>Banner</button>
}