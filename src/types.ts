/// <reference path="https://esm.sh/monaco-editor@0.34.1/monaco.d.ts" />
import { JSX } from "https://esm.sh/preact@10.10.6"
import { MutableRef} from "https://esm.sh/preact@10.10.6/hooks"

// default themes
type Theme =
  | 'vs-dark'
  | 'light';

// monaco
export type Monaco = typeof monaco;

export type CodeEditor = monaco.editor.IStandaloneCodeEditor
export type CodeDiffEditor = monaco.editor.IStandaloneDiffEditor

// Editor
export type OnMount =(
    (
      editor: monaco.editor.IStandaloneCodeEditor,
      monaco: Monaco,
    ) => void
  ) | (
    () => void
  )

export type BeforeMount =(
    ( monaco: Monaco ) => void
  )|(
    () => void
  )

export type OnChange = (
    value: string | undefined,
    ev: monaco.editor.IModelContentChangedEvent,
  ) => void

export type OnValidate = (
    (
      markers: monaco.editor.IMarker[],
    ) => void
  ) | (
    () => void
  )

export interface EditorProps {
  /**
   * Default value of the current model
   */
  defaultValue?: string;

  /**
   * Default language of the current model
   */
  defaultLanguage?: string;

  /**
   * Default path of the current model
   * Will be passed as the third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(defaultPath))`
   */
  defaultPath?: string;

  /**
   * Value of the current model
   */
  value?: string;

  /**
   * Language of the current model
   */
  language?: string;

  /**
   * Path of the current model
   * Will be passed as the third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(defaultPath))`
   */
  path?: string;

  /**
   * The theme for the monaco
   * Available options "vs-dark" | "light"
   * Define new themes by `monaco.editor.defineTheme`
   * Defaults to "light"
   */
  theme?: Theme | string;

  /**
   * The line to jump on it
   */
  line?: number;

  /**
   * The loading screen before the editor will be mounted
   * Defaults to 'loading...'
   */
  loading?: JSX.Element | string;

  /**
   * IStandaloneEditorConstructionOptions
   */
  options?: monaco.editor.IStandaloneEditorConstructionOptions;

  /**
   * IEditorOverrideServices
   */
  overrideServices?: monaco.editor.IEditorOverrideServices;

  /**
   * Indicator whether to save the models' view states between model changes or not
   * Defaults to true
   */
  saveViewState?: boolean;

  /**
   * Indicator whether to dispose the current model when the Editor is unmounted or not
   * Defaults to false
   */
  keepCurrentModel?: boolean;

  /**
   * Width of the editor wrapper
   * Defaults to 100%
   */
  width?: number | string;

  /**
   * Height of the editor wrapper
   * Defaults to 100%
   */
  height?: number | string;

  /**
   * Class name for the editor container
   */
  className?: string;

  /**
   * Props applied to the wrapper element
   */
  wrapperProps?: Record<string, unknown>;

  /**
   * Signature: function(monaco: Monaco) => void
   * An event is emitted before the editor is mounted
   * It gets the monaco instance as a first argument
   * Defaults to "() => void"
   */
  beforeMount?: BeforeMount;

  /**
   * Signature: function(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void
   * An event is emitted when the editor is mounted
   * It gets the editor instance as a first argument and the monaco instance as a second
   * Defaults to "() => void"
   */
  onMount?: OnMount;

  /**
   * Signature: function(value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => void
   * An event is emitted when the content of the current model is changed
   */
  onChange?: OnChange;

  /**
   * Signature: function(markers: monaco.editor.IMarker[]) => void
   * An event is emitted when the content of the current model is changed
   * and tthe current model markers are ready
   * Defaults to "() => void"
   */
  onValidate?: OnValidate;
}



// Diff Editor

export type DiffOnMount = (
    (
      editor: monaco.editor.IStandaloneDiffEditor,
      monaco: Monaco,
    ) => void
  ) | (
    () => void
  )

export type DiffBeforeMount = (
  (
    monaco: Monaco,
  ) => void
) | (
  () => void
)

export interface DiffEditorProps {
  /**
   * The original source (left one) value
   */
  original?: string;

  /**
   * The modified source (right one) value
   */
  modified?: string;

  /**
   * Language for the both models - original and modified
   */
  language?: string;

  /**
   * This prop gives you the opportunity to specify the language of the
   * original source separately, otherwise, it will get the value of the language property
   */
  originalLanguage?: string;

  /**
   * This prop gives you the opportunity to specify the language of the
   * modified source separately, otherwise, it will get the value of language property
   */
  modifiedLanguage?: string;

  /**
   * Path for the "original" model
   * Will be passed as a third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(originalModelPath))`
   */
  originalModelPath?: string;

  /**
   * Path for the "modified" model
   * Will be passed as a third argument to `.createModel` method
   * `monaco.editor.createModel(..., ..., monaco.Uri.parse(modifiedModelPath))`
   */
  modifiedModelPath?: string;

  /**
   * Indicator whether to dispose the current original model when the DiffEditor is unmounted or not
   */
  keepCurrentOriginalModel?: boolean;

  /**
   * Indicator whether to dispose the current modified model when the DiffEditor is unmounted or not
   */
  keepCurrentModifiedModel?: boolean;

  /**
   * The theme for the monaco
   * Available options "vs-dark" | "light"
   * Define new themes by `monaco.editor.defineTheme`
   * Defaults to "light"
   */
  theme?: Theme | string;

  /**
   * The loading screen before the editor will be mounted
   * Defaults to 'loading...'
   */
  loading?: JSX.Element | string;

  /**
   * IDiffEditorConstructionOptions
   */
  options?: monaco.editor.IDiffEditorConstructionOptions;

  /**
   * Width of the editor wrapper
   * Defaults to 100%
   */
  width?: number | string;

  /**
   * Height of the editor wrapper
   * Defaults to 100%
   */
  height?: number | string;

  /**
   * Class name for the editor container
   */
  className?: string;

  /**
   * Props applied to the wrapper element
   */
  wrapperProps?: Record<string, unknown>;

  /**
   * Signature: function(monaco: Monaco) => void
   * An event is emitted before the editor is mounted
   * It gets the monaco instance as a first argument
   * Defaults to "() => void"
   */
  beforeMount?: DiffBeforeMount;

  /**
   * Signature: function(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => void
   * An event is emitted when the editor is mounted
   * It gets the editor instance as a first argument and the monaco instance as a second
   * Defaults to "() => void"
   */
  onMount?: DiffOnMount;
}


// container

export type ContainerProps = {
  width: number | string,
  height: number | string,
  loading: JSX.Element | string,
  isEditorReady: boolean,  
  _ref?: MutableRef<HTMLDivElement|null>,
  className?: string,
  wrapperProps?: Record<string, unknown>,
}


// loader

// TODO (Suren): import loader namespace from @monaco-editor/loader
interface CancelablePromise<T> extends Promise<T> {
  cancel: () => void;
}

declare namespace loader {
  function init(): CancelablePromise<Monaco>;
  function config(params: {
    paths?: {
      vs?: string,
    },
    'vs/nls'?: {
      availableLanguages?: Record<string, unknown>,
    },
    monaco?: Monaco,
  }): void;
  function __getMonacoInstance(): Monaco | null;
}

export type Loader = typeof loader