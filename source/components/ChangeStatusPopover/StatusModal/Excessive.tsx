import StateTag from '@/components/StateTag'
import {
  ExcessiveBox,
  ExcessiveLine,
  ExcessiveProvider,
  PopoverStatusWrap,
} from '../style'

interface Props {
  checkStatusItem: any
}

const Excessive = (props: Props) => {
  const { checkStatusItem } = props

  return (
    <ExcessiveBox>
      <PopoverStatusWrap
        state={
          checkStatusItem?.formIsStart === 1 && checkStatusItem?.formIsEnd === 2
            ? 1
            : checkStatusItem?.formIsEnd === 1 &&
              checkStatusItem?.formIsStart === 2
            ? 2
            : checkStatusItem?.formIsEnd === 2 &&
              checkStatusItem?.formIsStart === 2
            ? 3
            : 0
        }
      >
        {checkStatusItem.formContent}
      </PopoverStatusWrap>
      <ExcessiveLine>
        <ExcessiveProvider>
          <span>流转名称</span>
        </ExcessiveProvider>
        <div className="circle" />
      </ExcessiveLine>
      <PopoverStatusWrap
        state={
          checkStatusItem?.is_start === 1 && checkStatusItem?.is_end === 2
            ? 1
            : checkStatusItem?.is_end === 1 && checkStatusItem?.is_start === 2
            ? 2
            : checkStatusItem?.is_start === 2 && checkStatusItem?.is_end === 2
            ? 3
            : 0
        }
      >
        {checkStatusItem.content}
      </PopoverStatusWrap>
    </ExcessiveBox>
  )
}

export default Excessive
