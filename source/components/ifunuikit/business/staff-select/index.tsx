/* eslint-disable max-lines */
/* eslint-disable arrow-body-style */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-extra-parens */
/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-literals */

/**
 * 员工选择组件，用于选择员工
 */
import React from 'react'
import { Modal } from 'antd'
import styled from '@emotion/styled'
import { useTranslation } from '../..'
import StaffSelectTransfer from './StaffSelectTransfer'
import { IDepartment, IStaffListAll, IUser } from './type'
import Icon from '../../assets/icons'

const StyledModal = styled(Modal)`
  position: relative;
  /* width: 480px !important; */

  /* .ant-modal-content {
    height: 534px;
  } */
  font-family: PingFang SC-Regular, PingFang SC;
  .ant-modal-header {
    border-bottom: none;
  }
  .ant-modal-close {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    position: absolute;
    top: 16px;
    right: 24px;
  }
  .ant-modal-close:hover {
    background: #f7f8fa;
    .ant-modal-close-x .anticon {
      color: #646566 !important
      ;
    }
  }
  /* .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #617ef2 !important;
  } */
  .ant-modal-close-x {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ant-modal-body {
    padding: 0 24px;
  }
  /* .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #617ef2 !important;
    border-color: #617ef2 !important;
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: #617ef2;
  } */
`

const CloseBtn = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(9px);
  &:hover {
    background: #f7f8fa;
    /* color: #646566 !important; */
  }
`

const HeaderWrap = styled.header`
  height: 56px;
  font-size: 16px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: #323233;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span[role='img'] {
    cursor: pointer;
  }
`
const ButtonWrap = styled.footer`
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`
const PlugArea = styled.div`
  position: absolute;
  left: 0px;
  bottom: 0px;
`

const CancelButton = styled.button`
  /* width: 60px; */
  padding: 0 16px;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: #646566;
  border: none;
  cursor: pointer;
  background: #f5f7fa;
  border-radius: 6px 6px 6px 6px;
`
const OkButton = styled.button`
  /* width: 74, */
  padding: 0 16px;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  border: none;
  cursor: pointer;
  background: #617ef2;
  border-radius: 6px 6px 6px 6px;
`

interface IStaffSelectProps {
  title: string
  visible: boolean
  onCancel: () => void
  onOk: () => void
  onChange: (value: any) => void
  value?: any
  staffListAll: IStaffListAll
  user: IUser
  departments: IDepartment[]
  plugArea?: JSX.Element
  // 控制节点不能选择
  disabledList?: string[]
  // 是否可以选自己
  isShowMe?: boolean
}

const StaffSelect = (props: IStaffSelectProps) => {
  const [t] = useTranslation()
  const { user, staffListAll, departments, disabledList } = props
  return (
    <StyledModal
      title={null}
      visible={props.visible}
      maskClosable={false}
      closable={false}
      footer={null}
      width={530}
      centered
      destroyOnClose
    >
      <div>
        <HeaderWrap>
          <span>{props.title}</span>
          <CloseBtn>
            <Icon
              style={{ fontSize: 20, color: '#646566' }}
              type="close"
              onClick={props?.onCancel}
            />
          </CloseBtn>
        </HeaderWrap>

        <div style={{ flexGrow: 1 }}>
          <StaffSelectTransfer
            user={user}
            staffListAll={staffListAll}
            departments={departments}
            value={props.value}
            onChange={props.onChange}
            disabledList={disabledList}
            isShowMe={props.isShowMe}
          />
        </div>

        <ButtonWrap>
          <CancelButton onClick={props.onCancel}>
            {t('staffSelect.cancel')}
          </CancelButton>
          <OkButton style={{ marginLeft: '16px' }} onClick={props.onOk}>
            {t('staffSelect.ok')}
          </OkButton>
          <PlugArea>{props.plugArea}</PlugArea>
        </ButtonWrap>
      </div>
    </StyledModal>
  )
}

export default StaffSelect
