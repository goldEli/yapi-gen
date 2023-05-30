import { produce, enableMapSet } from 'immer'
import React, { useState } from 'react'

enableMapSet()
const useCloseMap = () => {
  const [closeMap, setCloseMap] = useState<Map<number, boolean>>(new Map())

  const onChange = (id: number) => {
    setCloseMap(
      produce(draft => {
        draft?.set(id, !draft.get(id))
      }),
    )
  }

  return {
    closeMap,
    onChange,
  }
}

export default useCloseMap
