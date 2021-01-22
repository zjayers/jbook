import { useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';

const App = () => {
  // Refs
  const ref = useRef<any>();

  // State
  const [initializing, setInitializing] = useState(true);
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  // Lifecycle
  useEffect(() => {
    startWasmService().then(() => setInitializing(false));
  }, []);

  async function startWasmService() {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  }

  async function handleSubmissionClick() {
    if (!ref.current) return;

    const buildResult = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    setCode(buildResult.outputFiles[0].text);
  }

  return (
    <div>
      <textarea
        disabled={initializing}
        name='entry'
        id='entry'
        cols={30}
        rows={10}
        value={initializing ? 'Initializing...' : input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div>
        <button
          disabled={initializing}
          type='button'
          onClick={handleSubmissionClick}
        >
          Submit
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
