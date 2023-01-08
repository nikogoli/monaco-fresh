import { useState } from 'https://esm.sh/preact@10.11.0/hooks'
import { loader } from '../mod.ts'

import { useMount } from './useMount.ts'

export function useMonaco() {
  const [mona, setMonaco] = useState(loader.__getMonacoInstance())

  useMount(() => {
    if (!mona) {
      const cancelable = loader.init()
      cancelable.then(monaco => {
        setMonaco(monaco)
      })
      return () => cancelable.cancel()
    } else {
      return () => undefined
    }
  })

  return mona
}