/** @jsx h */
/// <reference path="https://esm.sh/monaco-editor@0.34.1/monaco.d.ts" />

import { JSX, h } from "preact"
import { useState, useEffect, useRef, useCallback } from 'preact/hooks'
import loader from 'https://esm.sh/@monaco-editor/loader@1.3.2'
//import * as Mona from "https://esm.sh/monaco-editor@0.34.1"

import { MonacoContainer } from '../MonacoContainer/MonacoContainer.tsx';
import { useUpdate } from '../hooks/useUpdate.ts';
import usePrevious from '../hooks/usePrevious';
import { getOrCreateModel } from '../utils.ts';


type Monaco = typeof monaco
type Editor = monaco.editor.IEditor

const viewStates = new Map();

type EditorProps = {
  defaultValue: string,
  defaultPath: string,
  defaultLanguage: string,
  value: string,
  language: string,
  path: string,
  /* === */
  theme: string,
  line: number,
  loading: JSX.Element | string,
  options: Record<string, unknown>,
  overrideServices: Record<string, unknown>,
  saveViewState: boolean,
  keepCurrentModel: boolean,
  /* === */
  width: number | string,
  height: number | string,
  className: string,
  wrapperProps: Record<string, unknown>,
  /* === */
  beforeMount: ()=>void,
  onMount: ()=>void,
  onChange: ()=>void,
  onValidate: ()=>void,
}

function Editor({
  defaultValue,
  defaultLanguage,
  defaultPath,
  value,
  language,
  path,
  /* === */
  theme,
  line,
  loading,
  options,
  overrideServices,
  saveViewState,
  keepCurrentModel,
  /* === */
  width,
  height,
  className,
  wrapperProps,
  /* === */
  beforeMount,
  onMount,
  onChange,
  onValidate,
}:EditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMonacoMounting, setIsMonacoMounting] = useState(true);
  const monacoRef = useRef<Monaco|null>(null);
  const editorRef = useRef<Editor|null>(null);
  const containerRef = useRef(null);
  const onMountRef = useRef(onMount);
  const beforeMountRef = useRef(beforeMount);
  const subscriptionRef = useRef(null);
  const valueRef = useRef(value);
  const previousPath = usePrevious(path);
  const preventCreation = useRef(false);

  // after mouted 
  useEffect(() => {
    const cancelable = loader.init()

    cancelable.then((monaco:Monaco) => ((monacoRef.current = monaco) && setIsMonacoMounting(false)))
              .catch(error => error?.type !== 'cancelation' &&
                console.error('Monaco initialization: error:', error)
              )

    return () => editorRef.current ? disposeEditor() : cancelable.cancel();
  }, []);

  useUpdate(() => {
    const model = getOrCreateModel(
      monacoRef.current,
      defaultValue || value,
      defaultLanguage || language,
      path,
    );

    if (editorRef.current && model !== editorRef.current.getModel()) {
      saveViewState && viewStates.set(previousPath, editorRef.current.saveViewState());
      editorRef.current.setModel(model);
      saveViewState && editorRef.current.restoreViewState(viewStates.get(path));
    }
  }, [path], isEditorReady);

  useUpdate(() => {
    editorRef.current.updateOptions(options);
  }, [options], isEditorReady);

  useUpdate(() => {
    if (editorRef.current.getOption(monacoRef.current.editor.EditorOption.readOnly)) {
      editorRef.current.setValue(value);
    } else {
      if (value !== editorRef.current.getValue()) {
        editorRef.current.executeEdits('', [{
          range: editorRef.current.getModel().getFullModelRange(),
          text: value,
          forceMoveMarkers: true,
        }]);

        editorRef.current.pushUndoStop();
      }
    }
  }, [value], isEditorReady);

  useUpdate(() => {
    monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), language);
  }, [language], isEditorReady);

  useUpdate(() => {
    // reason for undefined check: https://github.com/suren-atoyan/monaco-react/pull/188
    if(!isUndefined(line)) {
      editorRef.current.revealLine(line);
    }
  }, [line], isEditorReady);

  useUpdate(() => {
    monacoRef.current.editor.setTheme(theme);
  }, [theme], isEditorReady);

  const createEditor = useCallback(() => {
    if (!preventCreation.current) {
      beforeMountRef.current(monacoRef.current);
      const autoCreatedModelPath = path || defaultPath;

      const defaultModel = getOrCreateModel(
        monacoRef.current,
        value || defaultValue,
        defaultLanguage || language,
        autoCreatedModelPath,
      );

      editorRef.current = monacoRef.current.editor.create(containerRef.current, {
        model: defaultModel,
        automaticLayout: true,
        ...options,
      }, overrideServices);

      saveViewState && editorRef.current.restoreViewState(viewStates.get(autoCreatedModelPath));

      monacoRef.current.editor.setTheme(theme);

      setIsEditorReady(true);
      preventCreation.current = true;
    }
  }, [
    defaultValue,
    defaultLanguage,
    defaultPath,
    value,
    language,
    path,
    options,
    overrideServices,
    saveViewState,
    theme,
  ]);

  useEffect(() => {
    if (isEditorReady) {
      onMountRef.current(
        editorRef.current,
        monacoRef.current,
      );
    }
  }, [isEditorReady]);

  useEffect(() => {
    !isMonacoMounting && !isEditorReady && createEditor();
  }, [isMonacoMounting, isEditorReady, createEditor]);

  // subscription
  // to avoid unnecessary updates (attach - dispose listener) in subscription
  valueRef.current = value;

  // onChange
  useEffect(() => {
    if (isEditorReady && onChange) {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = editorRef.current?.onDidChangeModelContent(event => {
        onChange(editorRef.current.getValue(), event);
      });
    }
  }, [isEditorReady, onChange]);

  // onValidate
  useEffect(() => {
    if (isEditorReady) {
      const changeMarkersListener = monacoRef.current.editor.onDidChangeMarkers(uris => {
        const editorUri = editorRef.current.getModel()?.uri;

        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find((uri) => uri.path === editorUri.path);
          if (currentEditorHasMarkerChanges) {
            const markers = monacoRef.current.editor.getModelMarkers({ resource: editorUri });
            onValidate?.(markers);
          }
        }
      });
   
      return () => {
        changeMarkersListener?.dispose();
      };
    }
  }, [isEditorReady, onValidate]);

  function disposeEditor() {
    subscriptionRef.current?.dispose();

    if (keepCurrentModel) {
      saveViewState && viewStates.set(path, editorRef.current.saveViewState());
    } else {
      editorRef.current.getModel()?.dispose();
    }

    editorRef.current.dispose();
  }

  return (
    <MonacoContainer
      width={width}
      height={height}
      isEditorReady={isEditorReady}
      loading={loading}
      _ref={containerRef}
      className={className}
      wrapperProps={wrapperProps}
    />
  );
}



Editor.defaultProps = {
  theme: 'light',
  loading: 'Loading...',
  options: {},
  overrideServices: {},
  saveViewState: true,
  keepCurrentModel: false,
  /* === */
  width: '100%',
  height: '100%',
  wrapperProps: {},
  /* === */
  beforeMount: noop,
  onMount: noop,
  onValidate: noop,
};

export default Editor;
