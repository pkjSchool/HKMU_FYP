# React + TypeScript + Vite Project

A modern web development setup using React, TypeScript, and Vite with hot module replacement (HMR).

## Features

- React 18
- TypeScript
- Vite build tool
- ESLint configuration
- Hot Module Replacement (HMR)

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm run dev
```
4. Visit `http://localhost:5173`

## Development

### Available Vite Plugins

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) - Uses Babel
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) - Uses SWC

### ESLint Setup

1. Configure parser options:
```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

2. Update ESLint config with React support:
```js
import react from 'eslint-plugin-react'

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Production Build

Generate production build:
```bash
npm run build
```

Output will be in the `dist` directory.
