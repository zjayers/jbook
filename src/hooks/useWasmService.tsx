import React, { useEffect, useState } from 'react';
import _, { DebouncedFunc } from 'lodash';
import { buildCodeFromString, startWasmService } from '../services/WasmService';

export interface WasmService {
  bundleCode: DebouncedFunc<() => void>;
  code: string;
  error: string;
  initializing: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const useWasmService = (debounceTime: number = 1000): WasmService => {
  const [initializing, setInitializing] = useState(true);
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [input, setInput] = useState<string>('// Insert Code Here\n');

  // Lifecycle
  useEffect(() => {
    startWasmService().then(() => setInitializing(false));
  }, []);

  const bundleCode = _.debounce(() => {
    buildCodeFromString(input).then((buildResult) => {
      setError(buildResult.error);
      setCode(buildResult.code);
    });
  }, debounceTime);

  return { bundleCode, code, error, initializing, input, setInput };
};

export default useWasmService;
