import { useEffect } from 'https://esm.sh/preact@10.10.6/hooks'

export function useMount(effect:() => void) {
  useEffect(effect, []);
}