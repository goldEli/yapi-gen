// 需求进度

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { Progress, Popover } from 'antd'
import { ProgressWrap, SliderWrap } from '@/components/StyleCommon'
import { useState } from 'react'
import { updateTableParams } from '@/services/demand'

interface Props {
  value: number
  row?: any
  onUpdate(): void
  index?: any
  isCard?: any
}

const DemandProgress = (props: Props) => {
  const [schedule, setSchedule] = useState(props?.row?.schedule)

  const onChangeSchedule = async () => {
    const obj = {
      projectId: props?.row?.project_id,
      id: props?.row?.id,
      otherParams: { schedule },
    }
    try {
      await updateTableParams(obj)
      props?.onUpdate()
    } catch (error) {
      //
    }
  }

  return (
    <Popover
      trigger={['click']}
      content={
        <ProgressWrap onMouseUp={onChangeSchedule}>
          <SliderWrap
            isDisabled
            style={{ width: 246 }}
            value={schedule}
            tipFormatter={(value: any) => `${value}%`}
            onChange={val => setSchedule(val)}
          />
        </ProgressWrap>
      }
      getPopupContainer={node => (props.isCard ? document.body : node)}
      getTooltipContainer={node => (props.isCard ? document.body : node)}
    >
      <Progress
        strokeColor="var(--function-success)"
        style={{ color: 'var(--function-success)' }}
        width={props.isCard ? 38 : 42}
        type={props.isCard ? 'circle' : 'line'}
        percent={props?.value}
        format={percent => (percent === 100 ? '100%' : `${percent}%`)}
        strokeWidth={props.isCard ? 8 : 4}
      />
    </Popover>
  )
}

export default DemandProgress
