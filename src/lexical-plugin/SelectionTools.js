export const isSelectionAtEndofNode = (node, selection) => {
    return node.__key === selection.key && node.__text.length == selection.offset;
}

export const getCollapsedSelection = (anchor, focus) => {
    if(anchor.key=== focus.key && anchor.offset === focus.offset) {
        return anchor;
    }
}