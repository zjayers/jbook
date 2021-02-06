import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => ({
  name: 'unpkg-path-plugin',

  setup(build: esbuild.PluginBuild) {
    // Handle root entry file of index.js
    build.onResolve({ filter: /(^index\.js$)/ }, (args: any) => ({
      namespace: 'a',
      path: 'index.js',
    }));

    // Handle relative paths in a module (./ or ../)
    build.onResolve({ filter: /^\.+\// }, (args: any) => ({
      namespace: 'a',
      path: new URL(args.path, `https://unpkg.com/${args.resolveDir}/`).href,
    }));

    // Handle main file of a module
    build.onResolve({ filter: /.*/ }, async (args: any) => ({
      namespace: 'a',
      path: `https://unpkg.com/${args.path}`,
    }));
  },
});
