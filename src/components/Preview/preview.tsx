import React, { useEffect, useRef } from 'react';
import { WasmService } from '../../hooks/useWasmService';
import './preview.styles.css';

interface PreviewProps {
  wasmService: WasmService;
}

const iFrameHtml = `
  <html lang="en">
  <head>
    <title>Code Runner</title>
    <style>html {background-color: white}</style>
  </head>
  <body>
  <div id="root"></div>
  <script>
    const handleError = (error) => {
      const root = document.getElementById('root');
      root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
      console.error(error);
    }
    
    // Handle Uncaught Errors
    window.addEventListener('error', event => {
      event.preventDefault();
      handleError(event.error);
    })
  
    // Handle Code Execution
    window.addEventListener('message', event => {
      try {
        eval(event.data);
      } catch (error) {
        handleError(error);
      }
    }, false)
  </script>
  </body>
  </html>`;

const Preview: React.FC<PreviewProps> = ({ wasmService: { code, error } }) => {
  // Refs
  const iFrame = useRef<any>();

  useEffect(() => {
    if (error) {
      throw Error(error);
    }

    if (iFrame) {
      // iFrame.current.srcdoc = iFrameHtml;

      setTimeout(() => {
        iFrame.current.contentWindow.postMessage(code, '*');
      }, 100);
    }
  }, [code, error]);

  return (
    <div className='preview-wrapper'>
      <iframe
        srcDoc={iFrameHtml}
        ref={iFrame}
        title='preview'
        sandbox='allow-scripts'
      />
    </div>
  );
};

export default Preview;
