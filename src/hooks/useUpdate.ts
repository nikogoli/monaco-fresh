import { useEffect, useRef } from 'preact/hooks'

export function useUpdate(effect:()=>void, deps:Array<unknown>, applyChanges = true) {
  const isInitialMount = useRef(true);

  useEffect(
    isInitialMount.current || !applyChanges
      ? () => { isInitialMount.current = false }
      : effect,
    deps
  );
}
