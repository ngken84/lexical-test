import { TextNode, createCommand, COMMAND_PRIORITY_LOW, $getSelection, $isRangeSelection, $getRoot, ParagraphNode, $isParagraphNode, $createRangeSelection, $setSelection  } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useEffect, useRef } from 'react';


const TYPE_INSERTION = "insertionText";
const TYPE_DELETION = "deletionText";

export class InsertionTextNode extends TextNode {
    
    constructor(text, key) {
        super(text, key);
    }

    static getType() {
        return "insertionText";
    }

    static clone(node) {
        return new InsertionTextNode(node.__text, node.__key);
    }

    createDOM(config) {
        const element = super.createDOM(config)
        element.style.color = "blue";
        element.style.textDecoration = "underline";
        return element;
    }

    updateDOM(prevNode, __dom, _config) {
        const isUpdated = super.updateDOM(prevNode, __dom, _config);
        return isUpdated;
    }
}

export function $createInsertionTextNode(text) {
    return new InsertionTextNode(text);
}

export function $isInsertionTextNode(node) {
    return node instanceof InsertionTextNode;
}

export class DeletionTextNode extends TextNode {
    constructor(text, key) {
        super(text, key);
    }

    static getType() {
        return "deletionText";
    }

    static clone(node) {
        return new DeletionTextNode(node.__text, node.__key);
    }

    createDOM(config) {
        const element = super.createDOM(config)
        element.style.color = "red";
        element.style.textDecoration = "line-through";
        return element;
    }

    updateDOM(prevNode, __dom, _config) {
        const isUpdated = super.updateDOM(prevNode, __dom, _config);
        return isUpdated;
    }
}

export function $createDeletionTextNode(text) {
    return new DeletionTextNode(text);
}

export function $isDeletionTextNode(node) {
    return node instanceof DeletionTextNode;
}

export const INSERT_INSERTION_TEXT = createCommand('insertInsertionText');
export const INSERT_DELETION_TEXT = createCommand('insertDeletionText');

export const TrackChangesPlugin = () => {

    const [editor] = useLexicalComposerContext();

    if(!editor.hasNodes([InsertionTextNode])) {
        throw new Error('InsertionTextNode: InsertionTextNode not registered on Editor');
    }
    if(!editor.hasNodes([DeletionTextNode])) {
        throw new Error('DeletionTextNode: DeletionTextNode not registered on Editor');
    }

    const nodeMap = useRef({});
    const focusOffset = useRef();
    const anchorOffset = useRef();

    const isSingleCharacterEntry = (node) => {
        if(node.__text.length === nodeMap.current[node.__key].text.length + 1) {
            if(!focusOffset.current && !anchorOffset.current) {
                return true;
            }
            if(focusOffset.current && anchorOffset.current && focusOffset.current.isEqual(anchorOffset.current)) {
                return true;
            }
            return true;
        }
        return false;
    }



    editor.registerNodeTransform(TextNode, (textNode) => {
        const currentNode = nodeMap.current[textNode.__key];
        if(currentNode) {
            console.log("here");
            if(isSingleCharacterEntry(textNode)) {
                if((!focusOffset.current && !anchorOffset.current) || focusOffset.current.offset === 0) {
                    textNode.__text = currentNode.text
                }
                console.log("insert one character?")
            }
        } else {
            const newNodeText = textNode.__text;
            if(newNodeText.length > 0) {
                textNode.__text = '';
                editor.update(() => {
                    const [paragraph] = $getRoot().getChildren();   
                    
                    if(!$isParagraphNode(paragraph)) {
                        return;
                    }
                    const textNode = $createInsertionTextNode(newNodeText);
                    paragraph.append(textNode);
                    const selection = $createRangeSelection();
                    selection.anchor.key = textNode.__key;
                    selection.anchor.offset = 1;
                    selection.anchor.type = 'text';
                    selection.focus.key = textNode.__key;
                    selection.focus.offset = 1;
                    selection.focus.type = 'text';
                    console.log(selection);
                    $setSelection(selection);
                })
            }
        }
        nodeMap.current[textNode.__key] = new NodeState(textNode);
        
        
    });

    editor.registerNodeTransform(InsertionTextNode, (textNode) => {
        nodeMap.current[textNode.__key] = new NodeState(textNode);
    });

    editor.registerNodeTransform(DeletionTextNode, (textNode) => {
        if(nodeMap.current[textNode.__key]) {
            console.log("here");
            if(isSingleCharacterEntry(textNode)) {
                textNode.__text = nodeMap.current[textNode.__key].text;
            }
        }
        nodeMap.current[textNode.__key] = new NodeState(textNode);
    });

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            anchorOffset.current = new SelState(editorState._selection.anchor)
            focusOffset.current = new SelState(editorState._selection.focus);
            console.log(anchorOffset.current);
        });
        
    }, [editor]);


    const onClick = () => {
        editor.update(() => {
            const [paragraph] = $getRoot().getChildren();   
            
            if(!$isParagraphNode(paragraph)) {
                return;
            }
            const textNode = $createInsertionTextNode("Hello World");
           paragraph.append(textNode);

        })
    }

    const onClickDelete = () => {
        editor.update(() => {
            const [paragraph] = $getRoot().getChildren();   
            
            if(!$isParagraphNode(paragraph)) {
                return;
            }
            const textNode = $createDeletionTextNode("Hello World");
            paragraph.append(textNode);
            

        })
    }

    return <div><button onClick={onClick}>Insertion Text</button><button onClick={onClickDelete}>Delete</button></div>
    

}

class NodeState {
    constructor(node) {
        this.key = node.__key;
        this.parent = node.__parent;
        this.type = node.__type;
        this.text = node.__text;
    }
}

class SelState {
    constructor(sel) {
        this.key = sel.key;
        this.offset = sel.offset;
    }

    isEqual(sel) {
        return this.key === sel.key && this.offset === sel.offset
    }
}
