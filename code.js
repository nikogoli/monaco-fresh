// @deno-types="https://esm.sh/monaco-editor@0.34.1/monaco.d.ts"
import loader from 'https://esm.sh/@monaco-editor/loader@1.3.2'


loader.init().then(mona => {
    console.log({mona})
    console.log({editor: mona.editor})
})