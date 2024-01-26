import React, { useEffect } from 'react';

import './Editor.scss';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import {HeadingNode, $createHeadingNode} from '@lexical/rich-text';
import { $createTextNode, $getRoot, $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection'


const Editor = () => {

    const MyHeadingButton = () => {
        const [editor] = useLexicalComposerContext();
        const onClick = (e) => {
            editor.update(() => {
                const selection = $getSelection();
                console.log(selection);
                if($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode('h1'))
                }
            });
        }
        return <button onClick={onClick}>Heading</button>
    }

    const theme = {}

    const onError = (error) => {
        console.log(error);
    }

    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [
            HeadingNode
        ]
    }

    const MyOnChangePlugin = ({onChange}) => {

        const [editor] = useLexicalComposerContext();

        useEffect(() => {
            return editor.registerUpdateListener(({editorState}) => {
                onChange(editorState);
            });
        }, [onChange, editor]);
    }

    const onChange = (val) => {
        console.log(val);
    }

    return (
        <>
        <LexicalComposer initialConfig={initialConfig}>
            <MyHeadingButton/>
            <RichTextPlugin
                contentEditable={<ContentEditable className="contentEditable"/>}
                placeholder={<div>Enter some text...</div>}
                ErrorBoundary={LexicalErrorBoundary}/>
            <HistoryPlugin/>
            <MyHeadingButton/>
            <MyOnChangePlugin onChange={onChange}/>
        </LexicalComposer>
        </>
    )
}

export default Editor;