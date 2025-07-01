import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/sdk.js',  // Output file
      format: 'iife',      // Immediately Invoked Function Expression
      name: 'YouVersionPlatform',  // Name of the global variable
      sourcemap: false,
      globals: {
        'window': 'window'
      }
    },
    {
      file: 'dist/sdk.esm.js',  // ES module version
      format: 'esm',
      sourcemap: false
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    terser()  // Minification
  ],
  // Ensure window is treated as external
  external: ['window'],
  // This makes sure our IIFE has access to the window object
  context: 'window'
};
