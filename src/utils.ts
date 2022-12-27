import { Monaco } from "./types.ts"

export function getOrCreateModel(monaco:Monaco, value:string, language:string, path:string) {
  return getModel(monaco, path) || createModel(monaco, value, language, path);
}

function getModel(monaco:Monaco, path:string) {
  return monaco.editor.getModel(createModelUri(monaco, path));
}

function createModel(monaco:Monaco, value:string, language:string, path:string) {
  return monaco.editor.createModel(value, language, createModelUri(monaco, path));
}

function createModelUri(monaco:Monaco, path:string) {
  return monaco.Uri.parse(path);
}