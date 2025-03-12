declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}
{
  "compilerOptions": {
    // ... your other options
    "typeRoots": ["./node_modules/@types", "./"]
  },
  "include": ["src", "Custom.d.ts"]
}