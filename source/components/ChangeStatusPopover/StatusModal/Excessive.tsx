import {
  ExcessiveBox,
  ExcessiveLine,
  ExcessiveProvider,
  PopoverStatusWrap,
} from '../style'

interface Props {
  checkStatusItem: Model.Project.CheckStatusItem
}

const Excessive = (props: Props) => {
  const { checkStatusItem } = props

  return (
    <ExcessiveBox>
      <PopoverStatusWrap
        state={
          checkStatusItem?.fromIsStart === 1 && checkStatusItem?.fromIsEnd === 2
            ? 1
            : checkStatusItem?.fromIsEnd === 1 &&
              checkStatusItem?.fromIsStart === 2
            ? 2
            : checkStatusItem?.fromIsEnd === 2 &&
              checkStatusItem?.fromIsStart === 2
            ? 3
            : 0
        }
      >
        {checkStatusItem.fromContent}
      </PopoverStatusWrap>
      <ExcessiveLine>
        <ExcessiveProvider>
          <span>{props.checkStatusItem?.statusName}</span>
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
