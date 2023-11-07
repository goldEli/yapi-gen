import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { changeWaterForewarnStatus } from '@store/Forewarn'
import { store, useDispatch } from '@store/index'
import { Checkbox, Modal, Tabs } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import frnIcon from '/iconfrn.png'

const Footer = styled.div`
  height: 80px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Header = styled.div`
  height: 100px;
  background: linear-gradient(
    27deg,
    rgba(220, 145, 78, 0) 0%,
    rgba(221, 145, 78, 0.2) 100%
  );
  font-size: 18px;
  font-family: SiYuanMedium;
  color: #323233;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ListBox = styled.div`
  display: flex;

  flex-direction: column;
  justify-content: center;
  padding: 12px;
  :hover {
    background-color: #f6f7f9;
  }
`
const SmallTag = styled.span`
  display: flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding: 2px 8px;
  background-color: rgba(67, 186, 154, 0.2);
  border: 1px solid #43ba9a;
  border-radius: 6px 6px 6px 6px;
  margin-right: 8px;
`
const text = css`
  display: inline-block;
  width: 580px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const useForewarnModal = () => {
  const [visible, setVisible] = useState(false)

  const [t] = useTranslation()
  const openForewarnModal = (options: any) => {
    setVisible(options.visible)
  }
  const onChange2 = (key: string) => {
    console.log(key)
  }
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
  }
  const ForewarnModal = (
    <Modal
      centered
      bodyStyle={{ padding: 0 }}
      width={790}
      title={null}
      closable={false}
      footer={null}
      open={visible}
      onCancel={() => {
        setVisible(false)
      }}
    >
      <div>
        <Header>
          <img
            src={frnIcon}
            style={{ width: '64px', height: '62px', marginRight: '24px' }}
            alt=""
          />{' '}
          {t('yourProjectIsAtPleaseAskRelevantPersonnelToHandleItPromptly')}
        </Header>
        <div style={{ padding: '16px 24px' }}>
          <Tabs
            defaultActiveKey="1"
            onChange={onChange2}
            items={[
              {
                label: `${t('taskIsOverdue')}(0)`,
                key: '1',
              },
              {
                label: `${t('bugOverdue')}(0)`,
                key: '2',
              },
              {
                label: `${t('taskIsAboutToExpire')}(0)`,
                key: '3',
              },
              {
                label: `${t('bugIsAboutToExpire')}(0)`,
                key: '4',
              },
              {
                label: `${t('tooManyBugs')}(0)`,
                key: '5',
              },
            ]}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#969799', fontSize: 12 }}>
              更新于2023-08-08 11:08:08
            </span>
            <span>
              <IconFont style={{ color: '#969799' }} type="sync" />
              <span style={{ color: '#969799', fontSize: 12 }}>
                {t('toRefresh')}
              </span>
            </span>
          </div>
          {/* ---------------------------------- */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              maxHeight: 'calc(100vh - 400px)',
              overflow: 'scroll',
              marginTop: '12px',
            }}
          >
            {Array(5)
              .fill(1)
              .map((item: any) => {
                return (
                  <ListBox key={item}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <SmallTag>进行中</SmallTag>
                      <span className={text}>
                        对已完成设计，优化交互流程和对已完成设计，对已完成设计，对已完成设计，对已完成设...对已完成设计，优化交互流程和对已完成设计，对已完成设计，对已完成设计，对已完成设...对已完成设计，优化交互流程和对已完成设计，对已完成设计，对已完成设计，对已完成设...
                      </span>
                      <span
                        style={{
                          color: '#FF5C5E',
                          marginLeft: '12px',
                        }}
                      >
                        逾期1天
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 12, color: '#969799' }}>
                        处理人：张三、李四、王二
                      </span>
                      <span style={{ fontSize: 12, color: '#969799' }}>
                        预计结束：2021-09-09
                      </span>
                    </div>
                  </ListBox>
                )
              })}
          </div>
        </div>
        <Footer>
          <Checkbox onChange={onChange}>
            <span style={{ fontSize: '12px', color: '#646566' }}>
              {t(
                'iAmAwareOfTheAboveProjectStatusAndWillSynchronizeOrHandleRelatedMattersInATimelyManner',
              )}
            </span>
          </Checkbox>
          <CommonButton type="primary">{t('alreadyKnown')}</CommonButton>
        </Footer>
      </div>
    </Modal>
  )

  return { ForewarnModal, openForewarnModal }
}

export default useForewarnModal
