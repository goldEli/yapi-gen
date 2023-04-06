import styled from '@emotion/styled'
import React, { useEffect, useMemo } from 'react'
import classnames from 'classnames'
import { css } from '@emotion/css'
import useMaxWidth from '../hooks/useMaxWidth'
import { useDispatch, useSelector } from '@store/index'
import { setQuickCreateScheduleModel } from '@store/calendarPanle'
import useAllDayMoreTitleShowInfo from '../hooks/useAllDayMoreTitleShowInfoList'

interface WeekHeaderProps {}

const Table = styled.table`
  width: 100%;
  height: 100%;
  position: relative;
  .firstTd {
    width: 58px;
  }
  tr {
    box-sizing: border-box;
    /* all: unset; */
  }
  td {
    box-sizing: border-box;
    /* all: unset; */
    overflow: hidden;
    position: relative;
  }
  .borderTop {
    border-top: 1px solid var(--neutral-n6-d1);
  }
  .borderRight {
    border-right: 1px solid var(--neutral-n6-d1);
  }
`
const activeColor = css`
  background-color: var(--neutral-n6-d1);
`
const Title = styled.div<{ left: number }>`
  color: var(--primary-d1);
  width: calc((100% - 58px) / 7);
  font-size: 12px;
  font-weight: 400;
  background: var(--function-tag5);
  height: 22px;
  position: absolute;
  left: ${props => props.left + 'px'};
  top: 0;
  display: flex;
  align-items: center;
  z-index: 100;
`
const MoreTitle = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
  display: flex;
  height: 20px;
  overflow: hidden;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 8px;
`

const TimeScale: React.FC<WeekHeaderProps> = props => {
  const [current, setCurrent] = React.useState<number | null>(null)
  const { quickCreateScheduleModel } = useSelector(store => store.calendarPanel)
  const dispatch = useDispatch()
  const { showInfoList } = useAllDayMoreTitleShowInfo()
  const { maxWidth } = useMaxWidth()
  const left = useMemo(() => {
    return 58 + maxWidth * ((current ?? 0) - 1)
  }, [current, maxWidth])
  useEffect(() => {
    if (!quickCreateScheduleModel.visible) {
      setCurrent(null)
    }
  }, [quickCreateScheduleModel])
  const onCreate = (idx: number) => {
    setCurrent(idx)
    dispatch(
      setQuickCreateScheduleModel({
        visible: true,
        x: 58 + maxWidth * (idx - 1),
        y: 0,
      }),
    )
  }
  const renderMoreTitle = (idx: number) => {
    if (idx === 0) {
      return <></>
    }
    const showInfo = showInfoList[idx - 1]
    return (
      showInfo?.show && (
        <MoreTitle
          onClick={e => {
            e.stopPropagation()
          }}
        >{`还有${showInfo.hiddenNum}项目...`}</MoreTitle>
      )
    )
  }
  return (
    <Table>
      {Array(1)
        .fill(0)
        .map((_, index) => {
          return (
            <tr key={index}>
              {Array(8)
                .fill(0)
                .map((item, idx) => {
                  return (
                    <td
                      onClick={() => onCreate(idx)}
                      className={classnames(
                        'borderRight',
                        { [activeColor]: idx === current },
                        { borderTop: index === 0 && idx !== 0 },
                        {
                          firstTd: idx === 0,
                        },
                      )}
                      key={idx}
                    >
                      {renderMoreTitle(idx)}
                    </td>
                  )
                })}
            </tr>
          )
        })}
      {current !== null && <Title left={left}>新建日程</Title>}
    </Table>
  )
}

export default TimeScale
