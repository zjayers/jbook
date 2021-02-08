import React, { useEffect, useState } from 'react';
import { buildCodeFromString, startWasmService } from '../services/WasmService';
import { debounce } from '../utils/debounce';

export interface WasmService {
  bundleCode: () => Promise<void>;
  code: string;
  initializing: boolean;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const useWasmService = (debounceTime: number = 1000): WasmService => {
  const [initializing, setInitializing] = useState(true);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('// Insert Code Here\n');

  // Lifecycle
  useEffect(() => {
    startWasmService().then(() => setInitializing(false));
  }, []);

  const debouncedBuildCode = debounce(async () => {
    const buildResult = await buildCodeFromString(input);
    setCode(buildResult);
  }, debounceTime);

  const bundleCode = async () => debouncedBuildCode();

  return { bundleCode, code, initializing, input, setInput };
};

export default useWasmService;
