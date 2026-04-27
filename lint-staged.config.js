export default {
  '*.{ts,tsx}': ['eslint --fix'],
  '**/*.{ts,tsx}': () => 'tsc --noEmit',
};
