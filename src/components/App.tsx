import { useEffect, useRef, useState } from 'react';
import { buildCodeFromString, startWasmService } from '../services/WasmService';
import CodeEditor from './code-editor';

// language=HTML
const iFrameHtml = `
  <html lang="en">
  <head>
    <title>Code Runner</title>
  </head>
  <body>
  <div id="root"></div>
  <script>
    window.addEventListener('message', event => {
      try {
        eval(event.data);
      } catch (error) {
        const root = document.getElementById('root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
        console.error(error);
      }
    }, false)
  </script>
  </body>
  </html>`;

const App = () => {
  // State
  const [initializing, setInitializing] = useState(true);
  const [input, setInput] = useState('');

  // Refs
  const iFrame = useRef<any>();

  // Lifecycle
  useEffect(() => {
    startWasmService().then(() => setInitializing(false));
  }, []);

  async function handleSubmissionClick() {
    iFrame.current.srcdoc = iFrameHtml;

    const buildResult = await buildCodeFromString(input);
    iFrame.current.contentWindow.postMessage(
      buildResult.outputFiles[0].text,
      '*',
    );
  }

  return (
    <div>
      <CodeEditor initialValue={"console.log('Hello World');"} />
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
      <iframe
        srcDoc={iFrameHtml}
        ref={iFrame}
        title='code-output'
        sandbox='allow-scripts'
      />
    </div>
  );
};

export default App;
