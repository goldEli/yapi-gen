/* eslint-disable no-undefined */
import CommonButton from '@/components/CommonButton'
import IconFont from '@/components/IconFont'
import { css } from '@emotion/css'
import styled from '@emotion/styled'
import { changeWaterForewarnStatus } from '@store/Forewarn'
import { store, useDispatch, useSelector } from '@store/index'
import {
  Checkbox,
  Divider,
  Modal,
  Skeleton,
  Tabs,
  Tooltip,
  message,
} from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import frnIcon from '/iconfrn.png'
import InfiniteScroll from 'react-infinite-scroll-component'
import { init } from 'i18next'
import { produce } from 'immer'
import {
  getWarnLlist,
  getWarnSave,
  getWarnStatistics,
} from '@/services/forewarn'
import NoData from '@/components/NoData'

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
  max-width: 580px;
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
const SmallTag = styled.span<{ is_end: number; is_start: number }>`
  display: flex;

  align-items: center;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding: 2px 8px;
  background-color: ${props =>
    props.is_end === 2 && props.is_start === 2
      ? 'rgba(67,186,154,0.2)'
      : props.is_end === 1 && props.is_start === 2
      ? 'rgba(102,136,255,0.2)'
      : 'rgba(161,118,251,0.2)'};
  border: 1px solid
    ${props =>
      props.is_end === 2 && props.is_start === 2
        ? '#43BA9A'
        : props.is_end === 1 && props.is_start === 2
        ? '#6688FF'
        : '#A176FB'};
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
  const visible = useSelector(store => store.Forewarn.value)
  const pid = useSelector(store => store.project.projectInfo.id)
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [dis, setDis] = useState(false)
  const [nowKey, setNowKey] = useState<any>()
  const [time, setTime] = useState<any>()
  const [first, setFirst] = useState(false)
  const [datas, setDatas] = useState<any>()

  const openForewarnModal = (options: any) => {
    dispatch(changeWaterForewarnStatus(true))
  }
  const onChange2 = (key: string) => {
    setNowKey(key)
  }
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
    setDis(e.target.checked)
  }
  const format = (key: string) => {
    let name
    switch (key) {
      case 'bug_expired':
        name = t('bugOverdue')
        break
      case 'bug_soon_expired':
        name = t('bugIsAboutToExpire')
        break
      case 'bug_too_many':
        name = t('tooManyBugs')
        break
      case 'task_expired':
        name = t('taskIsOverdue')
        break
      case 'task_soon_expired':
        name = t('taskIsAboutToExpire')
        break

      default:
        break
    }
    return name
  }
  const format2 = (key: string) => {
    let name
    switch (key) {
      case 'bug_expired':
        name = t('noRiskyBugYet')
        break
      case 'bug_soon_expired':
        name = t('thereAreNoBugsThatAreAboutToExpire')
        break
      case 'bug_too_many':
        name = t('theNumberOfRecentBugsHasNotExceededTheRiskValueYet')
        break
      case 'task_expired':
        name = t('noRiskyTasksYet')
        break
      case 'task_soon_expired':
        name = t('thereAreCurrentlyNoTasksThatAreOverdue')
        break

      default:
        break
    }
    return name
  }
  const getAll = async () => {
    const res = await getWarnStatistics({ project_id: pid })
    setTime(res.update_at)
    const tabs = Object.keys(res.warning_count).map(key => {
      return {
        label: `${format(key)}  (${res.warning_count[key]})`,
        key: key,
        lang: res.warning_count[key],
        list: [],
        last_id: undefined,
      }
    })

    setDatas(tabs)
    setNowKey(tabs[0].key)
  }

  const init = async () => {
    if (twoData?.list.length > 0) {
      return
    }

    const res = await getWarnLlist({
      warning_type: nowKey,
      project_id: pid,
    })

    setDatas(
      produce((draft: any) => {
        draft?.forEach((item: any) => {
          if (item.key === nowKey) {
            item.list = item.list.concat(res.list)
            item.last_id = res.list[res.list.length - 1]?.id
          }
        })
      }),
    )
  }

  const fetchMoreData = async () => {
    const res = await getWarnLlist({
      warning_type: nowKey,
      project_id: pid,
      last_id: twoData.last_id,
    })
    setDatas(
      produce((draft: any) => {
        draft?.forEach((item: any) => {
          if (item.key === nowKey) {
            item.list = item.list.concat(res.list)
            item.last_id = res.list[res.list.length - 1].id
          }
        })
      }),
    )
  }

  const twoData = useMemo(() => {
    return datas?.find((l: any) => l.key === nowKey)
  }, [datas, nowKey])

  useEffect(() => {
    if (visible) {
      console.log('飞机')
      getAll()
    } else {
      setNowKey('')
      setDatas([])
    }
  }, [visible])

  useEffect(() => {
    if (nowKey) {
      init()
    }
  }, [nowKey])

  const handleMouseEnter = () => {
    setFirst(true)
  }
  const handleMouseLeave = () => {
    setFirst(false)
  }

  const zhuan = (dateStr2: string) => {
    const dateStr = dateStr2
    const dateObj = new Date(dateStr)
    const timestamp = dateObj.getTime()

    // 获取当前时间戳
    const now = new Date()
    const nowTimestamp = now.getTime()

    // 比较两个时间戳
    if (timestamp > nowTimestamp) {
      return t('overdue')
    } else if (timestamp < nowTimestamp) {
      return t('remaining')
    }
  }
  const confirm = async () => {
    const res = await getWarnSave({
      project_id: pid,
      updated_at: time,
    })

    if (res.code === 0) {
      message.success(t('success'))
      dispatch(changeWaterForewarnStatus(false))
    }
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
        dispatch(changeWaterForewarnStatus(false))
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
              {t('updatedOn')}
              {time}
            </span>
            <span
              onClick={() => {
                setDatas([])
                setNowKey('')
                getAll()
              }}
              className={text2}
            >
              <IconFont type="sync" />
              <span style={{ fontSize: 12, marginLeft: '4px' }}>
                {t('toRefresh')}
              </span>
            </span>
          </div>
          {/* ---------------------------------- */}
          <InfiniteScroll
            dataLength={twoData?.list?.length || 0}
            next={() => fetchMoreData()}
            style={{
              overflow: 'auto',
              maxHeight: 'calc(100vh - 400px)',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              marginTop: '12px',
            }}
            height={document.body.clientHeight - 400}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            scrollableTarget="scrollableDiv"
            hasMore={twoData?.list?.length < twoData?.lang}
          >
            {twoData?.list?.map((item: any, index: any) => {
              return (
                <ListBox key={item}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <SmallTag is_end={item.is_end} is_start={item.is_start}>
                      {item.category_status.status.content}
                    </SmallTag>
                    <span className={`tit  ${text}`}>{item.name}</span>
                    <span
                      style={{
                        color: '#FF5C5E',
                        marginLeft: 'auto',
                        fontSize: 12,
                      }}
                    >
                      {zhuan(item.expected_end_at)}
                      {item.day}
                      {t('sky')}
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
                      {t('handler')}：
                      {item.user_info.length > 1
                        ? item.user_info.map((o: any) => o.name).join('、')
                        : '--'}
                    </span>
                    <span style={{ fontSize: 12, color: '#969799' }}>
                      {t('expectedToEnd')}：{item.expected_end_at}
                    </span>
                  </div>
                </ListBox>
              )
            })}
            {twoData?.list.length < 1 && <NoData subText={format2(nowKey)} />}
          </InfiniteScroll>
        </div>
        <Footer>
          <Tooltip
            arrowPointAtCenter
            open={first && !dis}
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
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <CommonButton isDisable={!dis} onClick={confirm} type="primary">
              {t('alreadyKnown')}
            </CommonButton>
          </div>
        </Footer>
      </div>
    </Modal>
  )

  return { ForewarnModal, openForewarnModal }
}

export default useForewarnModal
