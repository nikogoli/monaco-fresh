import { useEffect } from 'preact/hooks'

export function useMount(effect:() => void) {
  useEffect(effect, []);
}