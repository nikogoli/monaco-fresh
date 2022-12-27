//import loader from 'https://esm.sh/@monaco-editor/loader@1.3.2'
import { Loader } from "./types.ts"

const { default:lod } = await import('https://esm.sh/@monaco-editor/loader@1.3.2')
const loader: Loader = lod

import { DiffEditor } from './DiffEditor/DiffEditor.tsx'
import { Editor } from './Editor/Editor.tsx'
import { useMonaco } from './hooks/useMonaco.ts'

export { Editor, DiffEditor, useMonaco, loader }