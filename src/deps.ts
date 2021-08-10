// Standard library dependencies
export * as log from 'https://deno.land/std@0.102.0/log/mod.ts';

// Third party library dependencies
export { 
    Router, 
    Status, 
    Application,
} from 'https://deno.land/x/oak@v8.0.0/mod.ts';
export { 
    DOMParser, 
    HTMLDocument 
} from 'https://deno.land/x/deno_dom@v0.1.13-alpha/deno-dom-wasm.ts';