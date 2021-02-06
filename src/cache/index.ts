/* eslint-disable implicit-arrow-linebreak */
import { OnLoadResult } from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'fileCache',
});

export const fetchFromCache = async (path: string) =>
  fileCache.getItem<OnLoadResult>(path);

export const cacheAndReturnContents = async (
  fileData: string,
  url: string,
  path: string,
) => {
  const fileContents: OnLoadResult = {
    contents: fileData,
    loader: 'jsx',
    resolveDir: new URL('./', url).pathname,
  };

  await fileCache.setItem(path, fileContents);

  return fileContents;
};

export const escapeCSSContents = (data: any) => {
  const escapedData = data
    .replace(/\n/g, '')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

  // language=JavaScript
  return `const style = document.createElement('style');
  style.innerText = '${escapedData}';
  document.head.appendChild(style);`;
};

export const fetchAndCacheContents = async (
  path: string,
  escapeContents: boolean = false,
) => {
  const { data, request } = await axios.get(path);
  return cacheAndReturnContents(
    escapeContents ? escapeCSSContents(data) : data,
    request.responseURL,
    path,
  );
};
