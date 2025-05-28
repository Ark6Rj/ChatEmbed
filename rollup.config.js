import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import html from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy';
import image from '@rollup/plugin-image'

const extensions = ['.ts', '.tsx', '.svg', '.png'];

const indexConfig = {
  plugins: [
    image(),
    resolve({ extensions, browser: true }),
    commonjs(),
    uglify(),
    json(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['solid', '@babel/preset-typescript'],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
    copy({
      targets: [
        {
          src: 'src/assets/**/*',
          dest: 'dist/assets'
        }
      ],
      hook: 'writeBundle'
    }),
    terser({ output: { comments: false } }),
    /* If you want to see the live app*/
    html({
      title: 'My App',
      fileName: 'index.html',
      template: () => `<!DOCTYPE html>
                        <html lang="en">
                          <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Document</title>
                          </head>
                          <body>
                          <div>444</div>
                          <script type="module">
       import Chatbot from './web.js';
             Chatbot.init({
    chatflowid: '91e9c803-5169-4db9-8207-3c0915d71c5f',
    apiHost: 'http://localhost:3000',
    theme: {
      tooltip: {
        showTooltip: true,
        tooltipMessage: 'Hi There 👋!',
        tooltipBackgroundColor: 'black',
        tooltipTextColor: 'white',
        tooltipFontSize: 16,
      },
      chatWindow: {
      title: 'Bot',
        textInput: {
          enableMarkdown:true
        },
          userMessage: {
          showAvatar: true,
          avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png',
        },
          botMessage: {
          showAvatar: true,
          avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png',
        },
      },
    },
  });
                                </script>
                          </body>
                        </html>`
    }),
    serve({
      open: false,
      onListening(server) {
        console.log(`Dev server: http://localhost:${server.address().port}`);
      },
      verbose: true,
      contentBase: ["dist"],
      host: "localhost",
      port: 5678,
    }),
    livereload({
      watch: "dist",
      clientUrl: 'http://localhost:35729/livereload.js?snipver=1',
      verbose: true
    }),
  ],
};

const configs = [
  {
    ...indexConfig,
    input: './src/web.ts',
    output: {
      file: 'dist/web.js',
      format: 'es',
      assetFileNames: 'assets/[name][extname]'
    },
  },
];

export default configs;
