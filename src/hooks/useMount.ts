import { useEffect } from 'https://esm.sh/preact@10.11.0/hooks'

export function useMount(effect:() => void) {
  useEffect(effect, []);
}