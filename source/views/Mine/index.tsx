import RichEditor from '@/components/RichEditor'
import { useRef } from 'react'

const Mine = () => {
  const myEd = useRef<any>()

  return (
    <div>
      <RichEditor ref={myEd} />
    </div>
  )
}

export default Mine
