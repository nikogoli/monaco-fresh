import { useEffect, useRef } from 'https://esm.sh/preact@10.11.0/hooks'

export function usePrevious<T>(value:T) {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}