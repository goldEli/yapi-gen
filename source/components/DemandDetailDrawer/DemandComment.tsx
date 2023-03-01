import { Label } from './style'

interface Props {
  detail?: any
  isOpen?: boolean
}

const DemandComment = (props: Props) => {
  return (
    <div>
      <Label>需求评论</Label>
    </div>
  )
}

export default DemandComment
