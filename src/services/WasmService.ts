/* eslint-disable implicit-arrow-linebreak */
import * as esbuild from 'esbuild-wasm';
import { ESBUILD_WASM_URL } from '../constants/constants';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';
import { fetchAndCachePlugin } from '../plugins/fetch-and-cache-plugin';

let WASM_SERVICE: any = null;

export const startWasmService = async () => {
  WASM_SERVICE = await esbuild.startService({
    worker: true,
    wasmURL: ESBUILD_WASM_URL,
  });
};

export const buildCodeFromString = async (input: string) =>
  WASM_SERVICE.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchAndCachePlugin(input)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });
