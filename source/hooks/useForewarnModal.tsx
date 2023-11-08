import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { changeWaterForewarnStatus } from '@store/Forewarn'
import { store, useDispatch } from '@store/index'
import { Checkbox, Divider, Modal, Skeleton, Tabs, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import frnIcon from '/iconfrn.png'
import InfiniteScroll from 'react-infinite-scroll-component'
import { init } from 'i18next'
import { produce } from 'immer'

const Footer = styled.div`
  height: 80px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Header = styled.div`
  height: 80px;
  background: linear-gradient(
    0deg,
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
const text = css`
  display: inline-block;
  width: 580px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const ListBox = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  padding: 12px;
  :hover {
    background-color: #f6f7f9;
  }
  :hover .tit {
    /* background-color: #f6f7f9; */
    text-decoration: underline;
    color: #6688ff;
    cursor: pointer;
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

const text2 = css`
  color: #969799;
  :hover {
    color: #6688ff;
    cursor: pointer;
  }
`

const useForewarnModal = () => {
  const [t] = useTranslation()
  const [visible, setVisible] = useState(false)
  const [dis, setDis] = useState(false)
  const [nowKey, setNowKey] = useState('1')

  const [datas, setDatas] = useState<any>([
    {
      label: `${t('taskIsOverdue')}  (0)`,
      key: '1',
      lang: 100,
      list: [],
    },
    {
      label: `${t('bugOverdue')}  (0)`,
      key: '2',
      lang: 100,
      list: [],
    },
    {
      label: `${t('taskIsAboutToExpire')}  (0)`,
      key: '3',
      lang: 100,
      list: [],
    },
    {
      label: `${t('bugIsAboutToExpire')}  (0)`,
      key: '4',
      lang: 100,
      list: [],
    },
    {
      label: `${t('tooManyBugs')}  (0)`,
      key: '5',
      lang: 100,
      list: [],
    },
  ])

  const openForewarnModal = (options: any) => {
    setVisible(options.visible)
  }
  const onChange2 = (key: string) => {
    console.log(key)
    setNowKey(key)
  }
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
    setDis(e.target.checked)
  }

  const init = () => {
    setDatas(
      produce((draft: any) => {
        draft?.forEach((item: any) => {
          if (item.key === nowKey) {
            item.list = item.list.concat(Array(2).fill(0))
          }
        })
      }),
    )
  }

  const fetchMoreData = () => {
    setDatas(
      produce((draft: any) => {
        draft?.forEach((item: any) => {
          if (item.key === nowKey) {
            item.list = item.list.concat(Array(2).fill(0))
          }
        })
      }),
    )
  }
  const twoData = useMemo(() => {
    return datas.find((l: any) => l.key === nowKey)
  }, [datas, nowKey])

  useEffect(() => {
    init()
  }, [nowKey])
  console.log(datas, 'datas数据源')

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
        <div style={{ padding: '0px 24px' }}>
          <Tabs defaultActiveKey="1" onChange={onChange2} items={datas} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#969799', fontSize: 12 }}>
              更新于2023-08-08 11:08:08
            </span>
            <span className={text2}>
              <IconFont type="sync" />
              <span style={{ fontSize: 12, marginLeft: '4px' }}>
                {t('toRefresh')}
              </span>
            </span>
          </div>
          {/* ---------------------------------- */}
          <InfiniteScroll
            dataLength={twoData.list?.length}
            next={() => fetchMoreData()}
            style={{
              overflow: 'auto',
              maxHeight: 'calc(100vh - 400px)',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '12px',
            }}
            height={document.body.clientHeight - 400}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDiv"
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            hasMore={twoData.list?.length < twoData?.lang}
          >
            {twoData.list?.map((item: any, index: any) => {
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
                    <span className={`tit  ${text}`}>
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
                      {t('handler')}：张三、李四、王二
                    </span>
                    <span style={{ fontSize: 12, color: '#969799' }}>
                      {t('expectedToEnd')}：2021-09-09
                    </span>
                  </div>
                </ListBox>
              )
            })}
          </InfiniteScroll>
        </div>
        <Footer>
          <Tooltip
            placement="topLeft"
            title={t('pleaseCheckTheBoxesToKnowFirst')}
          >
            <Checkbox onChange={onChange}>
              <span style={{ fontSize: '12px', color: '#646566' }}>
                {t(
                  'iAmAwareOfTheAboveProjectStatusAndWillSynchronizeOrHandleRelatedMattersInATimelyManner',
                )}
              </span>
            </Checkbox>
          </Tooltip>

          <CommonButton isDisable={!dis} type="primary">
            {t('alreadyKnown')}
          </CommonButton>
        </Footer>
      </div>
    </Modal>
  )

  return { ForewarnModal, openForewarnModal }
}

export default useForewarnModal
