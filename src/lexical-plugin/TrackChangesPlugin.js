import { TextNode, createCommand, COMMAND_PRIORITY_LOW, $getSelection, $getNodeByKey, $isRangeSelection, $getRoot, ParagraphNode, $isParagraphNode, $createRangeSelection, $setSelection, $createTextNode  } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useEffect, useRef } from 'react';
import { findDeltaCharPositionInString, getSubstringInRange } from './TextTools';
import { getAnchorOffsetFromEditor, getFocusOffsetFromEditor, isCollapsedSelectionInsert, getNodeByKey, getNodePositionInsideParent } from './EditorTools';
import { getCollapsedSelection } from './SelectionTools';


export const TYPE_INSERTION = "insertionText";
export const TYPE_DELETION = "deletionText";

export class InsertionTextNode extends TextNode {
    
    constructor(text, key) {
        super(text, key);
    }

    static getType() {
        return TYPE_INSERTION;
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
        return TYPE_DELETION;
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
    const isTextInsertion = useRef(false);

    editor.registerNodeTransform(TextNode, (textNode) => {
        if(isTextInsertion.current) {
            isTextInsertion.current = false;
            return;
        }
        console.log(nodeMap.current);
        console.log('editor', editor);
        const anchorOffset = getAnchorOffsetFromEditor(editor);
        const focusOffset = getFocusOffsetFromEditor(editor);
        console.log('anchor', anchorOffset);
        console.log("focus", focusOffset);
        const currentNode = nodeMap.current[textNode.__key];
        console.log(currentNode);
        const collapsedSel = getCollapsedSelection(anchorOffset, focusOffset);
        console.log("selection", collapsedSel);
        if(currentNode) {
            // node exists in history
            if(collapsedSel) {
                // previous selection was a single selection
                const change = isCollapsedSelectionInsert(currentNode.text, textNode.__text, collapsedSel.offset)
                console.log(change);
                if(change) {
                    if(collapsedSel.offset !== 0) {
                        textNode.__text = change.start;
                        editor.update(() => {
                            insertNewNodesPostSplit(textNode, change.newChar, change.end, false);
                        });
                    }
                }
                
            }
        
        }
        nodeMap.current[textNode.__key] = new NodeState(textNode);
    });

    const insertNewNodesPostSplit = (node, insertNodeText, postSplitText, isDeletion = false) => {
        const parent = $getNodeByKey(node.__parent);
        const newNode = $createInsertionTextNode(insertNodeText);
        nodeMap.current[newNode.__key] = new NodeState(newNode);
        if(postSplitText.length > 0) {
            const newTextNode = isDeletion ? $createDeletionTextNode(postSplitText) : $createTextNode(postSplitText);
            nodeMap.current[newTextNode.__key] = new NodeState(newTextNode);
            parent.splice(getNodePositionInsideParent(parent, node.__key) + 1, 0, [newNode, newTextNode]);
        } else {
            parent.splice(getNodePositionInsideParent(parent, node.__key) + 1, 0, [newNode]);
        }
        const selection = $getSelection();
        selection.anchor.key = newNode.__key
        selection.anchor.offset = insertNodeText.length;
        selection.focus.key = newNode.__key;
        selection.focus.offset = insertNodeText.length;
        $setSelection(selection);
    }

    editor.registerNodeTransform(InsertionTextNode, (textNode) => {
        console.log("insertion Text Node transform");
        nodeMap.current[textNode.__key] = new NodeState(textNode);
    });

    editor.registerNodeTransform(DeletionTextNode, (textNode) => {
        console.log(nodeMap.current);
        console.log('editor', editor);
        const anchorOffset = getAnchorOffsetFromEditor(editor);
        const focusOffset = getFocusOffsetFromEditor(editor);
        console.log('anchor', anchorOffset);
        console.log("focus", focusOffset);
        const currentNode = nodeMap.current[textNode.__key];
        console.log(currentNode);
        const collapsedSel = getCollapsedSelection(anchorOffset, focusOffset);
        console.log("selection", collapsedSel);
        if(currentNode) {
            // node exists in history
            if(collapsedSel) {
                // previous selection was a single selection
                const change = isCollapsedSelectionInsert(currentNode.text, textNode.__text, collapsedSel.offset)
                console.log(change);
                if(change) {
                    if(collapsedSel.offset !== 0) {
                        textNode.__text = change.start;
                        editor.update(() => {
                            insertNewNodesPostSplit(textNode, change.newChar, change.end, true);
                        });
                    }
                }
                
            }
        
        }
        nodeMap.current[textNode.__key] = new NodeState(textNode);
    });

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            console.log(editorState);
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

    const onClickText = () => {
        editor.update(() => {
            const [paragraph] = $getRoot().getChildren();
            isTextInsertion.current = true;
            if(!$isParagraphNode(paragraph)) {
                return;
            }
            console.log("1")
            const textNode = $createTextNode("arou");
            console.log(textNode);
            console.log("2");
            paragraph.append(textNode);
        })
    }

    const onClickDelete = () => {
        editor.update(() => {
            const [paragraph] = $getRoot().getChildren();   
            
            if(!$isParagraphNode(paragraph)) {
                return;
            }
            const textNode = $createDeletionTextNode("Champio");
            paragraph.append(textNode);
            

        })
    }

    return <div><button onClick={onClickText}>text</button><button onClick={onClick}>Insertion Text</button><button onClick={onClickDelete}>Delete</button></div>
    

}

class NodeState {
    constructor(node) {
        this.key = node.__key;
        this.parent = node.__parent;
        this.type = node.__type;
        this.text = node.__text;
    }
}
