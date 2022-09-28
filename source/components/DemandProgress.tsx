/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { Progress, Popover } from 'antd'
import { ProgressWrap, SliderWrap } from '@/components/StyleCommon'
import { useModel } from '@/models'
import { useState } from 'react'

interface Props {
  value: number
  row?: any
  onUpdate(): void
}

const DemandProgress = (props: Props) => {
  const [schedule, setSchedule] = useState(props?.row?.schedule)
  const { updateTableParams } = useModel('demand')

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
            style={{ width: 246 }}
            value={schedule}
            tipFormatter={(value: any) => `${value}%`}
            onChange={val => setSchedule(val)}
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
