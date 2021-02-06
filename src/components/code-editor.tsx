import MonacoEditor from '@monaco-editor/react';
import React from 'react';
import PropTypes from 'prop-types';

interface CodeEditorProps {
  initialValue: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue }) => (
  <MonacoEditor
    height='500px'
    language='javascript'
    theme='vs-dark'
    value={initialValue}
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
);

CodeEditor.propTypes = {
  initialValue: PropTypes.string.isRequired,
};

export default CodeEditor;
