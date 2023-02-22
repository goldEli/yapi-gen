// 公用弹窗

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-no-useless-fragment */
import { Input, Modal, Space } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useTranslation } from 'react-i18next'
import { CloseWrap } from '@/components/StyleCommon'
import CommonButton from '@/components/CommonButton'
import { useState } from 'react'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import CommonUserAvatar from '@/components/CommonUserAvatar'
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: var(--neutral-n1-d1);
  font-weight: 500;
  height: 56px;
  padding: 0 13px 0 24px;
`

const ModalFooter = styled(Space)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: 80,
  padding: '0 20px 0 24px',
})
const ModalStyle = styled(Modal)`
  .ant-modal-body {
    background-color: var(--neutral-white-d5);
    border-radius: 6px;
    box-shadow: 0px 0px 15px 6px rgba(0, 0, 0, 0.12);
  }
`
// 添加成员弹窗
const CreatePerson = styled.div`
  width: 100%;
  display: flex;
  height: 448px;
`
const LeftWrap = styled.div`
  width: 264px;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
  border-right: 1px solid var(--neutral-n6-d1);
`
const Tabs = styled.div`
  width: 216px;
  height: 24px;
  background-color: var(--neutral-n7);
  border-radius: 4px;
  margin: 16px 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--neutral-n3);
  span {
    display: inline-block;
    text-align: center;
    height: 24px;
    line-height: 24px;
    width: 108px;
  }
  &:hover {
    cursor: pointer;
    color: var(--neutral-n1-d1);
  }
  .tabsActive {
    background-color: var(--neutral-white-d6);
    color: var(--neutral-n1-d1);
  }
`
const InputStyle = styled(Input)`
  width: 216;
  height: 32px;
  position: relative;
  background: var(--neutral-white-d4);
  border: 1px solid var(--neutral-n6-d1);
  color: var(--neutral-n1-d1);
  input {
    background: var(--neutral-white-d4);
    color: var(--neutral-n1-d1);
  }
`
const Row = styled.div`
  width: 216px;
  height: 44px;
  display: flex;
  align-items: center;
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: var(--primary-d1);
    border-color: var(--primary-d1);
  }
  span {
    color: var(--neutral-n2);
  }
`
const RightPerson = styled.div`
  width: 264px;
  height: 100%;
  padding-left: 24px;
`
const Header = styled.div`
  width: 216px;
  display: flex;
  height: 36px;
  background: var(--neutral-n7);
  border-radius: 4px 4px 4px 4px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  & span:first-child {
    color: var(--neutral-n1-d1);
  }
  & span:last-child {
    color: var(--primary-d2);
  }
`
const ListItem = styled.div`
  width: 216px;
  height: 36px;
  line-height: 36px;
  border-radius: 6px;
  & span:first-child {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fffeb2a1;
    color: var(--primary-d2);
  }
  & span:last-child {
    color: var(--primary-d2);
  }
  &:hover {
    background: var(--hover-d2);
  }
`
interface ModalProps {
  width?: number
  isVisible: boolean
  title?: string
  onClose?(): void
  children?: any
  onConfirm?(): void
  confirmText?: string
  hasFooter?: any
  isShowFooter?: boolean
  hasTop?: any
}

const CommonModal = (props: ModalProps) => {
  const [t] = useTranslation()
  const tabs = [
    {
      label: '部门',
    },
    {
      label: '团队',
    },
  ]
  const [tabsActive, setTabsActive] = useState(0)
  return (
    <ModalStyle
      footer={false}
      visible={props?.isVisible}
      title={false}
      closable={false}
      bodyStyle={{ padding: '0 4px 0 0' }}
      width={props?.width || 528}
      maskClosable={false}
      destroyOnClose
      keyboard={false}
      wrapClassName="vertical-center-modal"
      focusTriggerAfterClose={false}
    >
      <ModalHeader>
        <span>{props?.title}</span>
        <Space size={4}>
          {props.hasTop}
          <CloseWrap onClick={props?.onClose} width={32} height={32}>
            <IconFont
              style={{ fontSize: 20, color: 'var(--neutral-n2)' }}
              type="close"
            />
          </CloseWrap>
        </Space>
      </ModalHeader>
      {/* body */}
      <CreatePerson>
        <LeftWrap>
          <InputStyle
            value={''}
            onBlur={(e: any) => 123}
            onChange={(e: any) => 123}
            onPressEnter={(e: any) => 123}
            placeholder="请输入昵称姓名邮箱电话"
            suffix={
              <IconFont
                type="search"
                style={{ color: `var(--neutral-n4)`, fontSize: 16 }}
              />
            }
          />
          <Tabs>
            {tabs.map((el, index) => (
              <span
                className={tabsActive === index ? 'tabsActive' : ''}
                onClick={() => {
                  setTabsActive(index)
                }}
                key={el.label}
              >
                {el.label}
              </span>
            ))}
          </Tabs>
          <Row>
            <Checkbox>全选</Checkbox>
          </Row>
        </LeftWrap>
        <RightPerson>
          <Header>
            <span>已选3/30</span>
            <span>清空</span>
          </Header>
          <ListItem>
            <CommonUserAvatar name="1" />
            {/* <span></span>
            <span>李三</span> */}
          </ListItem>
        </RightPerson>
      </CreatePerson>
      <ModalFooter size={16}>
        <CommonButton type="secondary" onClick={props?.onClose}>
          {t('common.cancel')}
        </CommonButton>
        <CommonButton type="primary" onClick={props?.onConfirm}>
          {t('common.confirm')}
        </CommonButton>
      </ModalFooter>
    </ModalStyle>
  )
}

export default CommonModal
