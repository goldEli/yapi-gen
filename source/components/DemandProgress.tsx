import { Progress, Popover } from 'antd'
import { ProgressWrap, SliderWrap } from '@/components/StyleCommon'

interface Props {
  value: number
  row?: any
}

const DemandProgress = (props: Props) => {
  return (
    <Popover
      trigger={['click']}
      content={
        <ProgressWrap>
          <SliderWrap
            style={{ width: 246 }}
            defaultValue={30}
            tipFormatter={(value: any) => `${value}%`}
          />
        </ProgressWrap>
      }
      getPopupContainer={node => node}
      getTooltipContainer={node => node}
    >
      <Progress
        strokeColor="#43BA9A"
        style={{ color: '#43BA9A' }}
        width={38}
        type="circle"
        strokeLinecap="butt"
        percent={props?.value}
        format={percent => percent === 100 ? '100%' : `${percent}%`}
        strokeWidth={8}
      />
    </Popover>
  )
}

export default DemandProgress
