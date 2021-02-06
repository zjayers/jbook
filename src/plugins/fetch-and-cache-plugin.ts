/* eslint-disable operator-linebreak,implicit-arrow-linebreak,function-paren-newline */
import * as esbuild from 'esbuild-wasm';
import { fetchAndCacheContents, fetchFromCache } from '../cache';

export const fetchAndCachePlugin = (input: string) => ({
  name: 'fetch-and-cache-plugin',

  setup(build: esbuild.PluginBuild) {
    // Handle root entry file of index.js
    build.onLoad({ filter: /(^index\.js$)/ }, () => ({
      contents: input,
      loader: 'jsx',
    }));

    // Handle Cache Fetching for all files
    build.onLoad(
      { filter: /.*/ },
      async ({ path }: any) => (await fetchFromCache(path)) || null,
    );

    // Handle CSS Files
    build.onLoad({ filter: /(.css$)/ }, async ({ path }: any) =>
      fetchAndCacheContents(path, true),
    );

    // Handle all other files
    build.onLoad({ filter: /.*/ }, async ({ path }: any) =>
      fetchAndCacheContents(path),
    );
  },
});
