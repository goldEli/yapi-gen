import CommonModal from '@/components/CommonModal'
import EditTable from './EditTable'
import { WorkTimeWrap } from './style'
import { Checkbox, TimePicker } from 'antd'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { getMessage } from '@/components/Message'
import { useDispatch, useSelector } from '@store/index'

type WorkTimeModalProps = {
  isVisible?: boolean
  projectId?: number
}

const SetWorkTimeModal = (props: any) => {
  const dispatch = useDispatch()
  const [timeData, setTimeData] = useState<any>({
    config: {},
    day_config: {},
  })
  const [totalHour, setTotalHour] = useState<number>(0)
  const options = [
    { label: '周一', value: 0 },
    { label: '周二', value: 1 },
    { label: '周三', value: 2 },
    { label: '周四', value: 3 },
    { label: '周五', value: 4 },
    { label: '周六', value: 5 },
    { label: '周日', value: 6 },
  ]

  const getTimeData = async () => {
    // const result = await findWorkTimeConfig({
    //   project_id: projectId,
    // })
    // if (result && result.data) {
    //   setTimeData(result.data)
    //   setTotalHour(result.data?.task_time_hours ?? 0)
    // }
  }

  const totalWorkHours = (arr1: string[], arr2: string[], arr3: string[]) => {
    // 定义一个函数来计算给定时间段的总工时
    const calculateWorkHours = (start: any, end: any) => {
      const totalHours =
        Number(end.split(':')[0]) -
        Number(start.split(':')[0]) +
        Number(end.split(':')[1] / 60 - start.split(':')[1] / 60)
      return totalHours
    }

    // 计算每个时间段的工时
    const hours1 = calculateWorkHours(arr1[0], arr1[1])
    const hours2 = calculateWorkHours(arr2[0], arr2[1])
    const hours3 = calculateWorkHours(arr3[0], arr3[1])
    if (hours3) {
      return Number(String(hours1 + hours2 + hours3).slice(0, 4))
    }
    return Number(String(hours1 + hours2).slice(0, 4))
  }

  const onConfirm = async () => {
    // const result = await updateWorkTimeConfig({
    //   project_id: projectId,
    //   config: timeData.config,
    //   day_config: timeData.day_config,
    //   id: timeData.id,
    // })
    // if (result && result.data) {
    //   getMessage({
    //     msg: '更改成功',
    //     type: 'success',
    //   })
    // }
  }

  // useEffect(() => {
  //   if (isVisible) {
  //     getTimeData()
  //   }
  // }, [isVisible])

  const getDisableTime = () => {
    const arr = []
    for (let i = 1; i < 60; i++) {
      arr.push(i)
    }
    return arr
  }

  return (
    <WorkTimeWrap>
      <Checkbox
        checked={timeData?.config?.is_holiday === 1}
        onChange={(e: any) => {
          setTimeData({
            ...timeData,
            config: {
              ...timeData.config,
              is_holiday: e?.target?.checked ? 1 : 2,
            },
          })
        }}
      >
        跟随中国法定节假日自动调整
      </Checkbox>
      <div className="group">
        <Checkbox.Group
          options={options}
          value={timeData?.config?.day}
          onChange={(val: any) => {
            setTimeData({
              ...timeData,
              config: {
                ...timeData.config,
                day: val,
              },
            })
          }}
        />
      </div>
      <div className="timeBox">
        <span className="total">共计 {totalHour ?? 0} 工时</span>
        <div className="timeList">
          <div className="item">
            <span>上午</span>
            <TimePicker.RangePicker
              onChange={(time: any, timeString: string[]) => {
                if (timeString[0] === timeString[1]) {
                  return
                }
                setTimeData({
                  ...timeData,
                  day_config: {
                    ...timeData?.day_config,
                    morning: {
                      begin: timeString[0],
                      end: timeString[1],
                    },
                  },
                })
                setTotalHour(
                  totalWorkHours(
                    timeString,
                    [
                      timeData.day_config?.afternoon?.begin,
                      timeData.day_config?.afternoon?.end,
                    ],
                    timeData.day_config?.night?.begin
                      ? [
                          timeData.day_config?.night?.begin,
                          timeData.day_config?.night?.end,
                        ]
                      : [],
                  ),
                )
              }}
              disabledTime={() => {
                return {
                  disabledHours: () => [
                    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                  ],
                  disabledMinutes: hours => {
                    if (hours === 12) {
                      return getDisableTime()
                    }
                    return []
                  },
                }
              }}
              value={
                timeData?.day_config?.morning?.begin
                  ? [
                      moment(timeData?.day_config?.morning?.begin, 'HH:mm'),
                      moment(timeData?.day_config?.morning?.end, 'HH:mm'),
                    ]
                  : null
              }
              format="HH:mm"
            />
          </div>
          <div className="item">
            <span>下午</span>
            <TimePicker.RangePicker
              onChange={(time: any, timeString: string[]) => {
                if (timeString[0] === timeString[1]) {
                  return
                }
                setTimeData({
                  ...timeData,
                  day_config: {
                    ...timeData?.day_config,
                    afternoon: {
                      begin: timeString[0],
                      end: timeString[1],
                    },
                  },
                })
                setTotalHour(
                  totalWorkHours(
                    [
                      timeData.day_config?.morning?.begin,
                      timeData.day_config?.morning?.end,
                    ],
                    timeString,
                    timeData.day_config?.night?.begin
                      ? [
                          timeData.day_config?.night?.begin,
                          timeData.day_config?.night?.end,
                        ]
                      : [],
                  ),
                )
              }}
              disabledTime={() => {
                return {
                  disabledHours: () => [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 22, 23,
                  ],
                  disabledMinutes: hours => {
                    if (hours === 12) {
                      return [0]
                    }
                    if (hours === 20) {
                      return getDisableTime()
                    }
                    return []
                  },
                }
              }}
              value={
                timeData?.day_config?.afternoon?.begin
                  ? [
                      moment(timeData?.day_config?.afternoon?.begin, 'HH:mm'),
                      moment(timeData?.day_config?.afternoon?.end, 'HH:mm'),
                    ]
                  : null
              }
              format="HH:mm"
            />
          </div>
          <div className="item">
            <span>晚上</span>
            <TimePicker.RangePicker
              onChange={(time: any, timeString: string[]) => {
                if (
                  timeString[0] === timeString[1] &&
                  timeString[0] &&
                  timeString[1]
                ) {
                  return
                }
                setTimeData({
                  ...timeData,
                  day_config: {
                    ...timeData?.day_config,
                    night: {
                      begin: timeString[0],
                      end: timeString[1],
                    },
                  },
                })
                setTotalHour(
                  totalWorkHours(
                    [
                      timeData.day_config?.morning?.begin,
                      timeData.day_config?.morning?.end,
                    ],
                    [
                      timeData.day_config?.afternoon?.begin,
                      timeData.day_config?.afternoon?.end,
                    ],
                    timeString,
                  ),
                )
              }}
              disabledTime={() => {
                return {
                  disabledHours: () => [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19,
                  ],
                  disabledMinutes: hours => {
                    if (hours === 20) {
                      return [0]
                    }
                    return []
                  },
                }
              }}
              value={
                timeData?.day_config?.night?.begin
                  ? [
                      moment(timeData?.day_config?.night?.begin, 'HH:mm'),
                      moment(timeData?.day_config?.night?.end, 'HH:mm'),
                    ]
                  : null
              }
              format="HH:mm"
            />
          </div>
        </div>
      </div>
      <div className="tableBox">
        <div className="title">例外日期</div>
        <EditTable />
      </div>
    </WorkTimeWrap>
  )
}
export default SetWorkTimeModal
