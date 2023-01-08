/** @jsxRuntime classic */
/** @jsx h */
import { h } from "https://esm.sh/preact@10.10.6"
import { useState, useRef, useCallback, useEffect } from 'https://esm.sh/preact@10.10.6/hooks'
import { loader } from '../mod.ts'

import { MonacoContainer } from '../MonacoContainer/MonacoContainer.tsx'
import { useMount } from '../hooks/useMount.ts'
import { useUpdate } from '../hooks/useUpdate.ts'
import { getOrCreateModel } from '../utils.ts'

import { DiffEditorProps, Monaco, CodeDiffEditor } from "../types.ts"

export function DiffEditor ({
  original,
  modified,
  language,
  originalLanguage,
  modifiedLanguage,
  /* === */
  originalModelPath,
  modifiedModelPath,
  keepCurrentOriginalModel,
  keepCurrentModifiedModel,
  theme,
  loading,
  options,
  /* === */
  height,
  width,
  className,
  wrapperProps,
  /* === */
  beforeMount,
  onMount,
}:DiffEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMonacoMounting, setIsMonacoMounting] = useState(true);
  const editorRef = useRef<CodeDiffEditor|null>(null);
  const monacoRef = useRef<Monaco|null>(null);
  const containerRef = useRef<HTMLDivElement|null>(null);
  const onMountRef = useRef(onMount);
  const beforeMountRef = useRef(beforeMount);

  useMount(() => {
    const cancelable = loader.init();

    cancelable
      .then(monaco => ((monacoRef.current = monaco) && setIsMonacoMounting(false)))
      .catch(error => error?.type !== 'cancelation' &&
        console.error('Monaco initialization: error:', error));

    return () => editorRef.current ? disposeEditor() : cancelable.cancel();
  });

  useUpdate(() => {
    const modifiedEditor = editorRef.current!.getModifiedEditor();
    if (modifiedEditor.getOption(monacoRef.current!.editor.EditorOption.readOnly)) {
      modifiedEditor.setValue(modified!);
    } else {
      if (modified !== modifiedEditor.getValue()) {
        modifiedEditor.executeEdits('', [{
          range: modifiedEditor!.getModel()!.getFullModelRange(),
          text: modified!,
          forceMoveMarkers: true,
        }]);

        modifiedEditor.pushUndoStop();
      }
    }
  }, [modified], isEditorReady);

  useUpdate(() => {
    editorRef.current!.getModel()!.original.setValue(original!);
  }, [original], isEditorReady);

  useUpdate(() => {
    const { original, modified } = editorRef.current!.getModel()!;

    monacoRef.current!.editor.setModelLanguage(original, originalLanguage || language!);
    monacoRef.current!.editor.setModelLanguage(modified, modifiedLanguage || language!);
  }, [language, originalLanguage, modifiedLanguage], isEditorReady);

  useUpdate(() => {
    monacoRef.current!.editor.setTheme(theme!);
  }, [theme], isEditorReady);

  useUpdate(() => {
    editorRef.current!.updateOptions(options!);
  }, [options], isEditorReady);

  const setModels = useCallback(() => {
    beforeMountRef.current!(monacoRef.current!);
    const originalModel = getOrCreateModel(
      monacoRef.current!,
      original!,
      originalLanguage || language!,
      originalModelPath!,
    );

    const modifiedModel = getOrCreateModel(
      monacoRef.current!,
      modified!,
      modifiedLanguage || language!,
      modifiedModelPath!,
    );

    editorRef.current!.setModel({ original: originalModel, modified: modifiedModel });
  }, [language, modified, modifiedLanguage, original, originalLanguage, originalModelPath, modifiedModelPath]);

  const createEditor = useCallback(() => {
    editorRef.current = monacoRef.current!.editor.createDiffEditor(containerRef.current!, {
      automaticLayout: true,
      ...options,
    });

    setModels();

    monacoRef.current!.editor.setTheme(theme!);

    setIsEditorReady(true);
  }, [options, theme, setModels]);

  useEffect(() => {
    if (isEditorReady) {
      onMountRef.current!(
        editorRef.current!,
        monacoRef.current!,
      );
    }
  }, [isEditorReady]);

  useEffect(() => {
    !isMonacoMounting && !isEditorReady && createEditor();
  }, [isMonacoMounting, isEditorReady, createEditor]);

  function disposeEditor() {
    const models = editorRef.current!.getModel()!;

    if (!keepCurrentOriginalModel) {
      models.original?.dispose();
    }

    if (!keepCurrentModifiedModel) {
      models.modified?.dispose();
    }

    editorRef.current!.dispose();
  }

  return (
    <MonacoContainer
      width={width!}
      height={height!}
      isEditorReady={isEditorReady}
      loading={loading!}
      _ref={containerRef}
      className={className}
      wrapperProps={wrapperProps}
    />
  );
}


DiffEditor.defaultProps = {
  theme: 'light',
  loading: 'Loading...',
  options: {},
  keepCurrentOriginalModel: false,
  keepCurrentModifiedModel: false,
  /* === */
  width: '100%',
  height: '100%',
  wrapperProps: {},
  /* === */
  beforeMount: () => {},
  onMount: () => {},
} as DiffEditorProps