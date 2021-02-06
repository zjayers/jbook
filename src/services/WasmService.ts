/* eslint-disable implicit-arrow-linebreak */
import * as esbuild from 'esbuild-wasm';
import { ESBUILD_WASM_URL } from '../constants/constants';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';
import { fetchAndCachePlugin } from '../plugins/fetch-and-cache-plugin';

let WASM_SERVICE: any = null;

export const startWasmService = async () => {
  WASM_SERVICE = await esbuild.startService({
    wasmURL: ESBUILD_WASM_URL,
    worker: true,
  });
};

export const buildCodeFromString = async (input: string) =>
  WASM_SERVICE.build({
    bundle: true,
    define: {
      global: 'window',
      'process.env.NODE_ENV': '"production"',
    },
    entryPoints: ['index.js'],
    plugins: [unpkgPathPlugin(), fetchAndCachePlugin(input)],
    write: false,
  });
