import { $isParagraphNode } from "lexical";

export const getAnchorOffsetFromEditor = (editor) => {
    return  editor._editorState._selection.anchor._selection.anchor;
}

export const getFocusOffsetFromEditor = (editor) => {
    return editor._editorState._selection.focus._selection.anchor;
}

export const isCollapsedSelectionInsert = (oldText, newText, offset) => {
    if(newText.length < oldText.length) {
        return;
    }
    const diff = newText.length - oldText.length;
    const start = newText.substring(0, offset);
    const end = newText.substring(offset + diff);
    if(start !== oldText.substring(0, offset) ||
        oldText.substring(offset) !== end    
    ) {
        return;
    }
    return {
        start,
        end,
        newChar: newText.substring(offset, offset + diff)
    }
}

export const isCollapsedSelectionDelete = (oldText, newText, offset) => {
    if(offset === 0) {
        return;
    }
    if(newText.length !== oldText.length - 1) {
        return;
    }
    const start = oldText.substring(0, offset - 1);
    console.log(start);
    const end = oldText.substring(offset);
    console.log(end);
    if(start !== newText.substring(0, offset - 1) ||
        newText.substring(offset - 1) !== end    
    ) {
        console.log('2')
        return;
    }
    return {
        start,
        end,
        deletedChar: oldText.substring(offset - 1, offset)
    }
}

export const getNodeByKey = (editorState, key) => {
    for(let [k, value] of editorState._nodeMap) {
        if(k === key) {
            return value;
        }
    }
}

export const getNodePositionInsideParent = (parent, key) => {
    for(let i = 0; i < parent.getChildren().length; ++i) {
        if(parent.getChildren()[i].__key === key) {
            return i;
        }
    }
    return -1;
}