import { useEffect } from 'react';
import CodeEditor from '../CodeEditor/code-editor';
import Preview from '../Preview/preview';
import useWasmService from '../../hooks/useWasmService';
import Resizable from '../Resizable/resizable';

const CodeCell = () => {
  const wasmService = useWasmService(100);

  const { bundleCode } = wasmService;

  useEffect(() => {
    bundleCode();
  }, [bundleCode]);

  return (
    <Resizable direction='vertical'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}
      >
        <Resizable direction='horizontal'>
          <CodeEditor wasmService={wasmService} />
        </Resizable>
        <Preview wasmService={wasmService} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
