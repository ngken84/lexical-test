import React, { useEffect } from 'react';

import './Editor.scss';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext'
import { InsertionTextNode, InsertionTextPlugin } from '../lexical-plugin/InsertionTextPlugin';


const Editor = () => {

    const theme = {
        insertion: 'insertionText'
    }

    const onError = (error) => {
        console.log(error);
    }

    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [
            InsertionTextNode
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
            <RichTextPlugin
                contentEditable={<ContentEditable className="contentEditable"/>}
                placeholder={<div>Enter some text...</div>}
                ErrorBoundary={LexicalErrorBoundary}/>
            <HistoryPlugin/>
            <InsertionTextPlugin/>
            <MyOnChangePlugin onChange={onChange}/>
        </LexicalComposer>
        </>
    )
}

export default Editor;