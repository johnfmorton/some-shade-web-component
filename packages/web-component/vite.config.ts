import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'SomeShade',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'some-shade.es.js';
        if (format === 'cjs') return 'some-shade.cjs.js';
        return 'some-shade.umd.js';
      },
    },
    rollupOptions: {
      external: (id) => id === 'lit' || id.startsWith('lit/'),
      output: {
        globals: {
          lit: 'Lit',
          'lit/decorators.js': 'LitDecorators',
        },
      },
    },
  },
});
