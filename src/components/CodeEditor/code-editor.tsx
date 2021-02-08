/* eslint-disable implicit-arrow-linebreak,function-paren-newline,react/prop-types */
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import React, { useRef } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';
import './code-editor.styles.css';
import _ from 'lodash';
import { WasmService } from '../../hooks/useWasmService';

interface CodeEditorProps {
  wasmService: WasmService;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  wasmService: { setInput, input },
}) => {
  // Refs
  const editorRef = useRef<any>();
  const debouncedSetInput = _.debounce(setInput, 100);

  const handleEditorMount: OnMount = (editor, _monaco) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => debouncedSetInput(editor.getValue()));

    editor.getModel()?.updateOptions({ tabSize: 2 });

    // JSX Syntax Highlighting
    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      editor,
    );

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}, // Customize error message output
    );
  };

  const handleFormatClick = () => {
    const unformattedCode = editorRef.current.getValue();
    const formatted = prettier
      .format(unformattedCode, {
        parser: 'babel',
        plugins: [parser],
        semi: true,
        singleQuote: true,
        useTabs: false,
      })
      .replace(/\n$/, '');

    editorRef.current.setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        type='button'
        onClick={handleFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onMount={handleEditorMount}
        height='100%'
        language='javascript'
        theme='vs-dark'
        value={input}
        options={{
          automaticLayout: true,
          folding: true,
          lineNumbersMinChars: 3,
          minimap: {
            enabled: false,
          },
          padding: { bottom: 10, top: 20 },
          scrollBeyondLastLine: false,
          showUnused: false,
          smoothScrolling: true,
          wordWrap: 'wordWrapColumn',
          wordWrapColumn: 80,
        }}
      />
    </div>
  );
};

export default CodeEditor;
