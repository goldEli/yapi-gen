import styled from '@emotion/styled'
import { css } from '@emotion/css'
import { useSelector, useDispatch } from '@store/index'
import { setScheduleModal } from '@store/calendar'
import { setScheduleInfoDropdown } from '@store/calendarPanle'
import {
  Dropdown,
  Checkbox,
  Radio,
  type RadioChangeEvent,
  Select,
  message,
} from 'antd'
import React, { useState, useEffect } from 'react'
import ScheduleInfoIcon from './../ScheduleInfoIcon'
import DeleteConfirm from '@/components/DeleteConfirm'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import CommonModal from '@/components/CommonModal'
import {
  scheduleInfoTransfer,
  scheduleInfoDelete,
  refreshCalendarPanelScheduleList,
} from '@store/schedule/schedule.thunk'
import {
  setScheduleListModal,
  setScheduleInfoDelete,
  setScheduleInfoTransfer,
} from '@store/schedule/index'
import { useTranslation } from 'react-i18next'
dayjs.extend(weekday)
const { Option } = Select
interface ScheduleInfoDropdownProps {}
const ScheduleInfoHeader = styled.div`
  height: 136px;
  background-color: var(--primary-d1);
  padding: 16px;
  box-sizing: border-box;
  border-radius: 6px 6px 0 0;
`
const ScheduleInfoHeaderBtn = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  cursor: pointer;
`
const ScheduleInfoHeaderContent = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font14);
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  margin-bottom: 8px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
`
const ScheduleInfoHeaderDate = styled.div`
  color: var(--neutral-white-d7);
  font-size: var(--font12);
`
const statusClass = css`
  width: 40px;
  height: 22px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px 16px 16px 16px;
  opacity: 1;
  text-align: center;
  color: var(--neutral-white-d7);
  font-size: var(--font12);
  line-height: 22px;
`
const iconBox = css`
  display: flex;
  position: relative;
  span {
    margin-left: 6px;
    color: var(--neutral-white-d6);
  }
  .moreOperate {
    position: relative;
    top: -4px;
    margin-left: 6px;
    color: var(--neutral-white-d6);
  }
`
const BoxTip = styled.div`
  width: 120px;
  height: 72px;
  background: #ffffff;
  box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  border-radius: 6px 6px 6px 6px;
  opacity: 1;
  position: absolute;
  top: 24px;
  right: 0px;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  padding-top: 12px;
  box-sizing: border-box;
  font-weight: 400;
  span {
    color: var(--neutral-n2);
    font-size: var(--font14);
    margin-bottom: 6px;
  }
`
const confirmText = css`
  color: var(--neutral-n2);
  font-size: var(--font14);
  margin-bottom: 8px;
`
const confirmSure = css`
  color: var(--neutral-n2);
  font-size: var(--font14);
  margin-left: 8px;
`
const ModalChildren = styled.div`
  box-sizing: border-box;
  padding: 0px 18px;
  height: 100px;
  .ant-radio-group {
    margin-top: 12px;
  }
  .ant-radio-wrapper {
    color: var(--neutral-n1-d1) !important;
    font-size: var(--font14) !important;
    font-weight: 400 !important;
  }
`
const ScheduleInfoHeaderBox: React.FC<ScheduleInfoDropdownProps> = props => {
  const [isVisible, setIsVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showTipBox, setShowTipBox] = useState(false)
  const [isExit, setIsExit] = useState(true)
  const [userId, setUserId] = useState<number>()
  const { scheduleInfo } = useSelector(state => state.schedule)
  const [t] = useTranslation()
  const disPatch = useDispatch()
  const onChangeVisible = () => {
    setIsVisible(false)
  }
  // useEffect(()=>{
  //   if(!scheduleInfoTransferStatus) return
  //   setModalVisible(false)
  //   setShowTipBox(false);
  //   disPatch(setScheduleInfoDropdown({ visible: false }))
  //   disPatch(setScheduleListModal({visible:false}))
  //   disPatch(setScheduleInfoTransfer(''))
  // },[scheduleInfoTransferStatus])
  // useEffect(()=>{
  //   if(!scheduleInfoDeleteStatus) return
  //   setIsVisible(false)
  //   disPatch(setScheduleInfoDropdown({ visible: false }))
  //   disPatch(setScheduleListModal({visible:false}))
  //   disPatch(setScheduleInfoDelete(''))
  // },[scheduleInfoDeleteStatus])
  return (
    <ScheduleInfoHeader>
      <ScheduleInfoHeaderBtn>
        <span className={statusClass}>
          {scheduleInfo?.is_busy === 1 ? '忙碌' : '空闲'}
        </span>
        <div className={iconBox}>
          <span
            onClick={() => {
              disPatch(
                setScheduleModal({
                  visible: true,
                  params: { id: scheduleInfo?.id ?? 0 },
                }),
              )
            }}
          >
            <ScheduleInfoIcon type="edit" />
          </span>
          <span
            onClick={() => {
              setIsVisible(true)
            }}
          >
            <ScheduleInfoIcon type="delete" />
          </span>
          <div className="moreOperate">
            <label onClick={() => setShowTipBox(!showTipBox)}>...</label>
            {showTipBox ? (
              <BoxTip>
                <span onClick={() => {}}>复制日程</span>
                <span
                  onClick={() => {
                    setModalVisible(true)
                  }}
                >
                  转让日程
                </span>
              </BoxTip>
            ) : null}
          </div>
          <span
            onClick={() => {
              disPatch(setScheduleInfoDropdown({ visible: false }))
            }}
          >
            <ScheduleInfoIcon type="close" />
          </span>
        </div>
      </ScheduleInfoHeaderBtn>
      <ScheduleInfoHeaderContent>
        {scheduleInfo?.subject}
      </ScheduleInfoHeaderContent>
      <ScheduleInfoHeaderDate>{scheduleInfo?.title}</ScheduleInfoHeaderDate>
      <DeleteConfirm
        isVisible={isVisible}
        onConfirm={() => {
          console.log(checked)
          let params = {
            id: scheduleInfo?.id ? String(scheduleInfo?.id) : '',
            is_remind: checked,
          }
          setIsVisible(false)
          disPatch(scheduleInfoDelete(params))
          disPatch(refreshCalendarPanelScheduleList())
          message.success(t('common.deleteSuccess'))
        }}
        onChangeVisible={onChangeVisible}
        title="删除日程"
      >
        <div className={confirmText}>
          日程将删除，该日程同时会从参与者日历中移除
        </div>
        <div>
          <Checkbox
            onChange={e => {
              setChecked(e.target.checked)
            }}
          ></Checkbox>
          <span className={confirmSure}>删除后通知参与者</span>
        </div>
      </DeleteConfirm>
      <CommonModal
        isVisible={modalVisible}
        title="转让日程"
        width={528}
        onClose={() => {
          setModalVisible(false)
        }}
        onConfirm={() => {
          let params = {
            is_exit: isExit,
            user_id: userId ?? 0,
            id: scheduleInfo?.id ? String(scheduleInfo?.id) : '',
          }
          disPatch(scheduleInfoTransfer(params))
        }}
      >
        <ModalChildren>
          <Select
            style={{ width: '100%' }}
            placeholder="搜索新的所有者"
            optionLabelProp="label"
            showSearch={true}
            onSelect={value => {
              setUserId(value)
            }}
          >
            {scheduleInfo?.members?.map(ele => (
              <Option
                key={ele.user_id}
                value={ele.user_id}
                label={ele.user.name}
              >
                {ele.user.name}
              </Option>
            ))}
          </Select>
          <Radio.Group
            onChange={(e: RadioChangeEvent) => setIsExit(e.target.value)}
            value={isExit}
          >
            <Radio value={true}>转让我退出该日程</Radio>
            <Radio value={false}>转让我变为参与者</Radio>
          </Radio.Group>
        </ModalChildren>
      </CommonModal>
    </ScheduleInfoHeader>
  )
}

export default ScheduleInfoHeaderBox
