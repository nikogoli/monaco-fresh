import { useEffect, useRef } from 'https://esm.sh/preact@10.11.0/hooks'

export function useUpdate(effect:()=>void, deps:Array<unknown>, applyChanges = true) {
  const isInitialMount = useRef(true);

  useEffect(
    isInitialMount.current || !applyChanges
      ? () => { isInitialMount.current = false }
      : effect,
    deps
  );
}
