import { useEffect, useState } from 'react';
import { buildCodeFromString, startWasmService } from '../services/WasmService';

const App = () => {
  // State
  const [initializing, setInitializing] = useState(true);
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  // Lifecycle
  useEffect(() => {
    startWasmService().then(() => setInitializing(false));
  }, []);

  async function handleSubmissionClick() {
    const buildResult = await buildCodeFromString(input);
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
      <iframe src='https://zachayers.io' title='code-output' />
    </div>
  );
};

export default App;
