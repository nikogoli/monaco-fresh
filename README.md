# monaco-editor for fresh (deno)
> forked from [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)

Monaco Editor for Deno; use the monaco-editor in any fresh application.

#### Usage
Just import components in `YourFreshProject/islands/xxx.tsx`.
```ts
import { Editor } from "https://pax.deno.dev/nikogoli/monaco-fresh/src/mod.ts"

export default function Monaco() {
  return (
    <>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={"function hello() {\n\talert('Hello world!');\n}"}
      />
    </>
  )
}
```
**CAUTION**: Do not import the components in `./routes/xxx.tsx` directly, because they need to use `useEffect`.

### More Information
Please read [@monaco-editor/react's document](https://github.com/suren-atoyan/monaco-react/blob/master/README.md).
