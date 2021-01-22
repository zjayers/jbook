import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',

  setup(build: esbuild.PluginBuild) {
    // Handle root entry file of index.js
    build.onResolve({ filter: /(^index\.js$)/ }, (args: any) => ({
      path: 'index.js',
      namespace: 'a',
    }));

    // Handle relative paths in a module (./ or ../)
    build.onResolve({ filter: /^\.+\// }, (args: any) => ({
      path: new URL(args.path, `https://unpkg.com/${args.resolveDir}/`).href,
      namespace: 'a',
    }));

    // Handle main file of a module
    build.onResolve({ filter: /.*/ }, async (args: any) => ({
      path: `https://unpkg.com/${args.path}`,
      namespace: 'a',
    }));
  },
});
