import EditTable from './EditTable'
import { HeaderWrap, OtherDateBox, SubtitleWrap, WorkTimeWrap } from './style'
import { Checkbox, TimePicker } from 'antd'
import { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { getMessage } from '@/components/Message'
import { useDispatch, useSelector } from '@store/index'
import CommonButton from '@/components/CommonButton'
import { getWorkTimeList, editWorkTime } from '@/services/map'
import useProjectId from '../KanBanSetting/hooks/useProjectId'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import _ from 'lodash'
type WorkTimeModalProps = {
  isVisible?: boolean
  projectId?: number
}

const WorkTimeConfig = (props: any) => {
  const dispatch = useDispatch()
  const { projectId } = useProjectId()
  const tableRef = useRef<any>()
  const [timeData, setTimeData] = useState<any>({
    config: {},
    day_config: {},
  })
  const { DeleteConfirmModal, open } = useDeleteConfirmModal()
  const [cacheData, setCacheData] = useState<any>()
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
    const result = await getWorkTimeList({
      project_id: projectId,
    })
    if (result && result.data) {
      const res = result.data
      res.config.day = res.config.day.map((item: any) => parseInt(item, 10))
      res.config.is_holiday = parseInt(res.config.is_holiday, 10)
      setTimeData(result.data)
      setCacheData(_.cloneDeep(result.data))
      setTotalHour(result.data?.task_time_hours ?? 0)
    }
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
    const result = await editWorkTime({
      project_id: projectId,
      config: timeData.config,
      day_config: timeData.day_config,
      id: timeData.id,
    })
    getTimeData()
    if (result && result.data) {
      getMessage({
        msg: '更改成功',
        type: 'success',
      })
    }
  }

  useEffect(() => {
    getTimeData()
  }, [])

  const getDisableTime = () => {
    const arr = []
    for (let i = 1; i < 60; i++) {
      arr.push(i)
    }
    return arr
  }
  return (
    <WorkTimeWrap>
      <HeaderWrap>
        <div>工作时间配置</div>
        <div className="btns">
          <CommonButton
            type="light"
            onClick={() => {
              if (!_.isEqual(cacheData, timeData)) {
                open({
                  title: '确认取消',
                  cancelText: '放弃保存',
                  children: <div>当前编辑内容还未保存是否保存？</div>,
                  onConfirm: async () => {
                    await onConfirm()
                  },
                  onChangeVisible: () => {
                    setTimeData(cacheData)
                  },
                })
              }
            }}
          >
            取消
          </CommonButton>
          <CommonButton type="primary" onClick={onConfirm}>
            保存
          </CommonButton>
        </div>
      </HeaderWrap>
      <SubtitleWrap>更改时间</SubtitleWrap>
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
      <OtherDateBox>
        <SubtitleWrap>例外日期</SubtitleWrap>
        <div>
          <CommonButton
            type="primaryText"
            icon="plus"
            onClick={() => {
              console.log(tableRef.current)
              tableRef.current?.handleAdd()
            }}
          >
            添加例外
          </CommonButton>
        </div>
      </OtherDateBox>
      <div className="tableBox">
        {/* <div className="title"></div> */}
        <EditTable ref={tableRef} />
      </div>
      <DeleteConfirmModal></DeleteConfirmModal>
    </WorkTimeWrap>
  )
}
export default WorkTimeConfig
