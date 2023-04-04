import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import { uploadFileByTask } from '@/services/cos'
import styled from '@emotion/styled'
import { useSelector } from '@store/index'
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
  div {
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
  const { menuList, routerMenu } = useSelector(store => store.calendar)
  // 配置选项默认值
  const [formParams, setFormParams] = useState<any>({
    // 视图选项
    views: null,
    // 一周的第一天 - 星期日
    time: [0],
    // 日程颜色 - 现代
    color: 0,
    // 日程默认时长 - 30
    normalValue: 1,
    // 非全天日程默认提醒时间 -- 提前5分钟
    partialDayValue: 1,
    // 全天日程默认提醒时间 -- 当天08：00
    allDayValue: 0,
    // 仅提醒我已接受的日程
    remindMeAccepted: true,
    // 导出的日历
    exportIds: [],
    // 默认导入的日历
    importCalendar: 0,
  })
  // 导入的日历数组
  const [importList, setImportList] = useState<
    { name: string; id: string | number }[]
  >([])

  // 视图选项
  const options = [
    { label: '隐藏已拒绝的日程', value: 0 },
    { label: '降低已结束的日程的亮度', value: 1 },
    { label: '显示农历', value: 2 },
  ]

  // 一周的第一天
  const timeOption = [
    { label: '星期日', value: 0 },
    { label: '星期六', value: 1 },
    { label: '星期一', value: 2 },
  ]

  // 日程颜色
  const colorList = [
    {
      name: '现代（彩色文字）',
      value: 0,
      background: 'var(--function-tag5)',
      color: 'var(--neutral-n1-d1)',
    },
    {
      name: '经典（白色文字）',
      value: 1,
      background: 'var(--primary-d1)',
      color: 'var(--neutral-white-d7)',
    },
  ]

  // 日程默认时长
  const normalTimeOption = [
    { label: '15分钟', value: 0 },
    { label: '30分钟', value: 1 },
    { label: '45分钟', value: 2 },
    { label: '60分钟', value: 3 },
    { label: '90分钟', value: 4 },
    { label: '120分钟', value: 5 },
  ]

  // 非全天日程默认提醒时间
  const partialDayTimeOption = [
    { label: '日程开始时', value: 0 },
    { label: '提前5分钟', value: 1 },
    { label: '提前15分钟', value: 2 },
    { label: '提前30分钟', value: 3 },
    { label: '提前1小时', value: 4 },
    { label: '提前2小时', value: 5 },
    { label: '提前3小时', value: 6 },
    { label: '提前1天', value: 7 },
    { label: '提前2天', value: 8 },
    { label: '提前1周', value: 9 },
  ]

  // 全天日程默认提醒时间
  const allDayTimeOption = [
    { label: '当天08：00', value: 0 },
    { label: '当天09：00', value: 1 },
    { label: '当天10：00', value: 2 },
    { label: '提前1天08：00', value: 3 },
    { label: '提前1天09：00', value: 4 },
    { label: '提前1天10：00', value: 5 },
    { label: '提前2天08：00', value: 6 },
    { label: '提前2天09：00', value: 7 },
    { label: '提前2天10：00', value: 8 },
    { label: '提前3天08：00', value: 9 },
    { label: '提前3天09：00', value: 10 },
    { label: '提前3天10：00', value: 11 },
    { label: '提前1周08：00', value: 12 },
    { label: '提前1周09：00', value: 13 },
    { label: '提前1周10：00', value: 14 },
  ]

  // 可导出的日历列表
  const exportList = [
    { label: '2222日历', value: 0 },
    { label: '33333日历', value: 1 },
    { label: '4444日历', value: 2 },
    { label: '5555日历', value: 3 },
    { label: '6666日历', value: 4 },
  ]

  // 修改配置 key： 表单对应的key, value：修改的值
  const onChangeSet = (
    key: string,
    value: number | string | CheckboxValueType[] | boolean,
  ) => {
    setFormParams({ ...formParams, ...{ [key]: value } })
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

  useEffect(() => {
    if (routerMenu.key) {
      const dom = document.getElementById(routerMenu.key)
      dom?.scrollIntoView({
        behavior: 'smooth',
      })
    }
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
        <Title id="view">
          <div>视图选项</div>
        </Title>
        <CheckBoxWrap
          value={formParams.views}
          options={options}
          onChange={checkedValues => onChangeSet('views', checkedValues)}
        />
        <Label style={{ marginTop: 24 }}>一周的第一天</Label>
        <Select
          onChange={time => onChangeSet('time', time)}
          value={formParams.time}
          options={timeOption}
          style={{ width: 320 }}
          getPopupContainer={n => n}
        />
        <Title id="schedule">
          <div>日程设置</div>
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
                onClick={() => onChangeSet('color', i.value)}
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
                      formParams.color === i.value ? 'active' : 'normal'
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
          onChange={normalValue => onChangeSet('normalValue', normalValue)}
          value={formParams.normalValue}
          options={normalTimeOption}
          style={{ width: 320 }}
          getPopupContainer={n => n}
        />
        <Title id="notice">
          <div>通知设置</div>
        </Title>
        <LineForm size={56}>
          <NotificationWrap>
            <Label>非全天日程默认提醒时间</Label>
            <Select
              onChange={partialDayValue =>
                onChangeSet('partialDayValue', partialDayValue)
              }
              value={formParams.partialDayValue}
              options={partialDayTimeOption}
              style={{ width: 320 }}
              getPopupContainer={n => n}
            />
          </NotificationWrap>
          <NotificationWrap>
            <Label>全天日程默认提醒时间</Label>
            <Select
              onChange={allDayValue => onChangeSet('allDayValue', allDayValue)}
              value={formParams.allDayValue}
              options={allDayTimeOption}
              style={{ width: 320 }}
              getPopupContainer={n => n}
            />
          </NotificationWrap>
        </LineForm>
        <Checkbox
          checked={formParams.remindMeAccepted}
          onChange={e => onChangeSet('remindMeAccepted', e.target.checked)}
        >
          仅提醒我已接受的日程
        </Checkbox>
        <Title id="import">
          <div>日历导入</div>
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
          onChange={importCalendar =>
            onChangeSet('importCalendar', importCalendar)
          }
          value={formParams.importCalendar}
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
        <Title id="export">
          <div style={{ marginRight: 16 }}>日历导出</div>
          <CommonButton type="primaryText">导出</CommonButton>
        </Title>
        <Label style={{ marginTop: 8 }}>选择导出日历</Label>
        <CheckBoxWrap
          style={{ margin: 0 }}
          value={formParams.exportIds}
          options={exportList}
          onChange={exportIds => onChangeSet('exportIds', exportIds)}
        />
      </ContentWrap>
    </CalendarSetWrap>
  )
}

export default CalendarSet
