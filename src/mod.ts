//import loader from 'https://esm.sh/@monaco-editor/loader@1.3.2'
import { Loader } from "./types.ts"
/** @ts-ignore */
const loader =  await import('https://esm.sh/@monaco-editor/loader@1.3.2') as Loader

import { DiffEditor } from './DiffEditor/DiffEditor.tsx'
import { Editor } from './Editor/Editor.tsx'
import { useMonaco } from './hooks/useMonaco.ts'

export { Editor, DiffEditor, useMonaco, loader }