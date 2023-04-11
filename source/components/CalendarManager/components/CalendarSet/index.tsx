import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import { uploadFileByTask } from '@/services/cos'
import styled from '@emotion/styled'
import {
  getCalendarConfig,
  updateCalendarConfig,
} from '@store/calendar/calendar.thunk'
import { useDispatch, useSelector } from '@store/index'
import { Checkbox, message, Select, Space, Tooltip, Upload } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useEffect, useState } from 'react'

const CalendarSetWrap = styled.div`
  padding: 20px 24px;
  background: var(--neutral-white-d4);
  height: 100%;
`

const CrumbsWrap = styled(Space)`
  display: flex;
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 12px;
  .ant-space-item {
    line-height: 32px;
  }
  .main {
    color: var(--neutral-n1-d1);
  }
  .sub {
    color: var(--neutral-n3);
  }
`

const ContentWrap = styled.div`
  padding: 0 56px;
  height: calc(100% - 60px);
  overflow: auto;
`

const TitleIcon = styled(IconFont)`
  font-size: 16px;
  color: var(--neutral-n3) !important;
  cursor: pointer;
  margin-left: 8px;
  margin-right: 16px;
  font-family: SiYuanRegular;
`

const Title = styled.div`
  margin-top: 48px;
  display: flex;
  align-items: center;
  .name {
    font-family: SiYuanMedium;
    font-size: 16px;
    color: var(--neutral-n1-d1);
  }
`

const CheckBoxWrap = styled(Checkbox.Group)`
  margin-top: 8px;
  .ant-checkbox-group-item {
    margin-right: 56px;
  }
`

const CheckBoxViewWrap = styled(Space)`
  margin-top: 8px;
  .ant-checkbox-group-item {
    margin-right: 56px;
  }
`

const Label = styled.div`
  font-size: 14px;
  color: var(--neutral-n1-d1);
  margin-bottom: 8px;
`

const ScheduleColorWrap = styled(Space)`
  display: flex;
  align-items: center;
  margin-top: 8px;
  .box {
    display: flex;
    flex-direction: column;
    min-width: 142px;
    cursor: pointer;
    .colorBox {
      height: 60px;
      border-radius: 4px;
      padding: 4px 8px;
      display: flex;
      flex-direction: column;
      span {
        font-size: 12px;
      }
    }
    .radio {
      margin-top: 8px;
      display: flex;
      align-items: center;
      .name {
        margin-left: 8px;
        font-size: 14px;
        color: var(--neutral-n1-d1);
      }
      .normal {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 1px solid var(--neutral-n4);
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: transparent;
        }
      }
      .active {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 1px solid var(--primary-d1);
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary-d1);
        }
      }
    }
  }
`

const LineForm = styled(Space)`
  display: flex;
  align-items: center;
  margin: 8px 0 24px 0;
`

const NotificationWrap = styled.div`
  display: flex;
  flex-direction: column;
`

const ImportBox = styled.div`
  margin-top: 8px;
  width: 640px;
  border-radius: 6px;
  background: var(--neutral-n8);
  padding: 16px;
`

const ImportItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .name {
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: var(--neutral-n2);
    font-size: 14px;
  }
  .icon {
    font-size: 16px;
    color: var(--neutral-n3);
    cursor: pointer;
    visibility: hidden;
  }
  &:hover {
    .icon {
      visibility: visible;
    }
  }
`

const CalendarSet = () => {
  const dispatch = useDispatch()
  const { menuList, routerMenu, calendarConfig, relateConfig } = useSelector(
    store => store.calendar,
  )
  // 配置选项默认值
  const [formParams, setFormParams] = useState<any>({
    view_options: {
      hide_reject_schedule: 2,
      reduce_finish_schedule_light: 2,
      show_lunar_calendar: 2,
    },
    schedule_configs: {},
    notification_configs: {},
  })
  // 默认导入的日历
  const [importCalendar, setImportCalendar] = useState(0)
  // 导出的日历
  const [exportIds, setExportIds] = useState<CheckboxValueType[]>([])
  // 导入的日历数组
  const [importList, setImportList] = useState<
    { name: string; id: string | number }[]
  >([])

  // 视图选项
  const options = [
    { label: '隐藏已拒绝的日程', value: 0, key: 'hide_reject_schedule' },
    {
      label: '降低已结束的日程的亮度',
      value: 1,
      key: 'reduce_finish_schedule_light',
    },
    { label: '显示农历', value: 2, key: 'show_lunar_calendar' },
  ]

  // 一周的第一天
  const timeOption = [
    { label: '星期日', value: 0 },
    { label: '星期六', value: 6 },
    { label: '星期一', value: 1 },
  ]

  // 日程颜色
  const colorList = [
    {
      name: '现代（彩色文字）',
      value: 1,
      background: 'var(--function-tag5)',
      color: 'var(--neutral-n1-d1)',
    },
    {
      name: '经典（白色文字）',
      value: 2,
      background: 'var(--primary-d1)',
      color: 'var(--neutral-white-d7)',
    },
  ]

  // 可导出的日历列表
  const exportList = [
    { label: '2222日历', value: 0 },
    { label: '33333日历', value: 1 },
    { label: '4444日历', value: 2 },
    { label: '5555日历', value: 3 },
    { label: '6666日历', value: 4 },
  ]

  // 修改配置 key： 表单对应的key, value：修改的值 outKey: 最外层的key
  const onChangeSet = (value: number, key: string, outKey: string) => {
    const params = formParams[outKey]
    params[key] = value
    setFormParams({ ...formParams, ...{ [outKey]: params } })
  }

  const onCustomRequest = async (file: any) => {
    if (
      !(file.file.type?.includes('iCal') || file.file.type?.includes('VCS'))
    ) {
      message.warning('支持iCal 或 VCS (MS Outlook) 格式的活动信息')
      return
    }
    const data = await uploadFileByTask(
      file.file,
      file.name,
      `richEditorFiles_${new Date().getTime()}`,
    )
    setImportList([...importList, ...[{ name: data.name, id: data.id }]])
  }

  // 删除的导入的日历
  const onDeleteImport = (id: number | string) => {
    const resultList = importList.filter(
      (i: { name: string; id: number | string }) => i.id !== id,
    )
    setImportList(resultList)
  }

  // 设置默认值
  const getNormalForm = () => {
    // setFormParams(calendarConfig)
  }

  useEffect(() => {
    getNormalForm()
    // 获取日历列表
  }, [calendarConfig])

  useEffect(() => {
    // console.log(formParams, '=formParamsformParams')
    dispatch(updateCalendarConfig(formParams))
  }, [formParams])

  useEffect(() => {
    if (routerMenu.key) {
      const dom = document.getElementById(`calendar-${routerMenu.key}`)
      dom?.scrollIntoView({
        behavior: 'smooth',
      })
    }
    dispatch(getCalendarConfig())
  }, [routerMenu])

  return (
    <CalendarSetWrap>
      <CrumbsWrap size={4}>
        <div className="main">日程</div>
        <IconFont className="main" type="right" style={{ fontSize: 14 }} />
        <div className="sub">
          {
            menuList.filter(
              (i: Model.Calendar.RouterMenu) => i.key === routerMenu.key,
            )[0].name
          }
        </div>
      </CrumbsWrap>
      <ContentWrap>
        <div id="calendar-view">
          <Title>
            <div className="name">视图选项</div>
          </Title>
          <CheckBoxViewWrap>
            {options.map((i: any) => (
              <Checkbox
                key={i.key}
                checked={formParams.view_options[i.key] === 1}
                onChange={e =>
                  onChangeSet(e.target.checked ? 1 : 2, i.key, 'view_options')
                }
              >
                {i.label}
              </Checkbox>
            ))}
          </CheckBoxViewWrap>
          <Label style={{ marginTop: 24 }}>一周的第一天</Label>
          <Select
            onChange={time =>
              onChangeSet(time, 'week_first_day', 'view_options')
            }
            value={formParams.view_options.week_first_day}
            options={timeOption}
            style={{ width: 320 }}
            getPopupContainer={n => n}
          />
        </div>
        <div id="calendar-schedule">
          <Title>
            <div className="name">日程设置</div>
          </Title>
          <Label style={{ marginTop: 8 }}>日程颜色</Label>
          <ScheduleColorWrap size={56}>
            {colorList.map(
              (i: {
                name: string
                value: number
                background: string
                color: string
              }) => (
                <div
                  className="box"
                  key={i.value}
                  onClick={() =>
                    onChangeSet(i.value, 'schedule_color', 'schedule_configs')
                  }
                >
                  <div
                    className="colorBox"
                    style={{ background: i.background, color: i.color }}
                  >
                    <span>会议</span>
                    <span>10:00-12:00</span>
                  </div>
                  <div className="radio">
                    <div
                      className={
                        formParams.schedule_configs.schedule_color === i.value
                          ? 'active'
                          : 'normal'
                      }
                    >
                      <div />
                    </div>
                    <div className="name">现代（彩色文字）</div>
                  </div>
                </div>
              ),
            )}
          </ScheduleColorWrap>
          <Label style={{ marginTop: 24 }}>日程默认时长</Label>
          <Select
            onChange={normalValue =>
              onChangeSet(
                normalValue,
                'schedule_default_duration',
                'schedule_configs',
              )
            }
            value={formParams.schedule_configs.schedule_default_duration}
            options={relateConfig.schedule.default_duration}
            style={{ width: 320 }}
            getPopupContainer={n => n}
          />
        </div>
        <div id="calendar-notice">
          <Title>
            <div className="name">通知设置</div>
          </Title>
          <LineForm size={56}>
            <NotificationWrap>
              <Label>非全天日程默认提醒时间</Label>
              <Select
                onChange={partialDayValue =>
                  onChangeSet(
                    partialDayValue,
                    'not_all_day_remind',
                    'notification_configs',
                  )
                }
                value={formParams.notification_configs.not_all_day_remind}
                options={relateConfig.schedule.remind_types}
                style={{ width: 320 }}
                getPopupContainer={n => n}
              />
            </NotificationWrap>
            <NotificationWrap>
              <Label>全天日程默认提醒时间</Label>
              <Select
                onChange={allDayValue =>
                  onChangeSet(
                    allDayValue,
                    'all_day_remind',
                    'notification_configs',
                  )
                }
                value={formParams.notification_configs.all_day_remind}
                options={relateConfig.schedule.all_day_remind}
                style={{ width: 320 }}
                getPopupContainer={n => n}
              />
            </NotificationWrap>
          </LineForm>
          <Checkbox
            checked={formParams.notification_configs.only_remind_accept === 1}
            onChange={e =>
              onChangeSet(
                e.target.checked ? 1 : 2,
                'only_remind_accept',
                'notification_configs',
              )
            }
          >
            仅提醒我已接受的日程
          </Checkbox>
        </div>
        <div id="calendar-import">
          <Title>
            <div className="name">日历导入</div>
            <Tooltip title="您可以导入 iCal 或 VCS (MS Outlook) 格式的活动信息。">
              <TitleIcon className="icon" type="question" />
            </Tooltip>
            <Upload fileList={[]} customRequest={onCustomRequest}>
              <CommonButton type="primaryText">导入</CommonButton>
            </Upload>
          </Title>
          <Label style={{ marginTop: 8 }}>添加至日历</Label>
          <Select
            getPopupContainer={n => n}
            onChange={setImportCalendar}
            value={importCalendar}
            options={exportList}
            style={{ width: 320 }}
          />
          {importList.length > 0 && (
            <ImportBox>
              {importList.map((i: { name: string; id: string | number }) => (
                <ImportItem key={i.id}>
                  <Tooltip
                    title={i.name}
                    placement="topLeft"
                    getPopupContainer={n => n}
                  >
                    <div className="name">{i.name}</div>
                  </Tooltip>
                  <IconFont
                    onClick={() => onDeleteImport(i.id)}
                    className="icon"
                    type="close"
                  />
                </ImportItem>
              ))}
            </ImportBox>
          )}
        </div>
        <div id="calendar-export">
          <Title>
            <div className="name" style={{ marginRight: 16 }}>
              日历导出
            </div>
            <CommonButton type="primaryText">导出</CommonButton>
          </Title>
          <Label style={{ marginTop: 8 }}>选择导出日历</Label>
          <CheckBoxWrap
            style={{ margin: 0 }}
            value={exportIds}
            options={exportList}
            onChange={setExportIds}
          />
        </div>
      </ContentWrap>
    </CalendarSetWrap>
  )
}

export default CalendarSet
