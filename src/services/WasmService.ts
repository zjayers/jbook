/* eslint-disable implicit-arrow-linebreak */
import * as esbuild from 'esbuild-wasm';
import { ESBUILD_WASM_URL } from '../constants/constants';
import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin';
import { fetchAndCachePlugin } from '../plugins/fetch-and-cache-plugin';

let WASM_SERVICE: any = null;

export const startWasmService = async () => {
  if (!WASM_SERVICE) {
    WASM_SERVICE = await esbuild.startService({
      wasmURL: ESBUILD_WASM_URL,
      worker: true,
    });
  }
};

export const buildCodeFromString = async (rawCode: string): Promise<string> => {
  const buildResult = await WASM_SERVICE.build({
    bundle: true,
    define: {
      global: 'window',
      'process.env.NODE_ENV': '"production"',
    },
    entryPoints: ['index.js'],
    plugins: [unpkgPathPlugin(), fetchAndCachePlugin(rawCode)],
    write: false,
  });
  return buildResult.outputFiles[0].text;
};
