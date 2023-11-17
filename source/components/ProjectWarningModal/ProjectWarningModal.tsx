import { Checkbox, Modal, Skeleton, Spin, Tabs, Tooltip } from 'antd'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Header, Footer, text, ListBox, SmallTag, text2 } from './style'
import { useSelector, useDispatch } from '@store/index'
import frnIcon from '/iconfrn.png'
import { useTranslation } from 'react-i18next'
import {
  getWarnLlist,
  getWarnSave,
  getWarnStatistics,
} from '@/services/forewarn'
import NoData from '@/components/NoData'
import { produce } from 'immer'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommonButton from '../CommonButton'
import IconFont from '../IconFont'
import { setProjectWarningModal } from '@store/project'
import { encryptPhp } from '@/tools/cryptoPhp'
import { css } from '@emotion/css'
import NewLoadingTransition from '../NewLoadingTransition'

const text3 = css`
  display: inline-block;
  max-width: 580px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ProjectWarningModal = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [dis, setDis] = useState(false)
  const [nowKey, setNowKey] = useState<any>()
  const [time, setTime] = useState<any>()
  const [first, setFirst] = useState(false)
  const [datas, setDatas] = useState<any>()
  const pid = useSelector(store => store.project.projectInfo.id)
  const { projectWarningModal } = useSelector(store => store.project)
  const timeRef = useRef<NodeJS.Timeout>()
  const [loading, setLoading] = useState(false)
  const onChange2 = (key: string) => {
    setNowKey(key)
  }
  const onChange = (e: any) => {
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
  const getAll = async (update?: boolean) => {
    setLoading(true)
    const res = await getWarnStatistics({
      project_id: projectWarningModal?.id ?? pid,
    }).finally(() => {
      setLoading(false)
    })
    setTime(res.update_at)
    const tabs = Object.keys(res.warning_count).map(key => {
      return {
        label: `${format(key)}  (${res.warning_count[key]})`,
        key: key,
        lang: res.warning_count[key],
        list: void 0,
        last_id: void 0,
      }
    })

    setDatas(tabs)
    if (update) {
      init(true)
    } else {
      setNowKey(tabs[0].key)
    }
  }

  const init = async (update?: boolean) => {
    if (twoData?.list?.length > 0 && !update) {
      return
    }
    setLoading(true)
    const res = await getWarnLlist({
      warning_type: nowKey,
      project_id: projectWarningModal?.id ?? pid,
    }).finally(() => {
      setLoading(false)
    })

    setDatas(
      produce((draft: any) => {
        draft?.forEach((item: any) => {
          if (item.key === nowKey) {
            item.list = (item.list ?? []).concat(res.list)
            item.last_id = res.list[res.list.length - 1]?.id
          }
        })
      }),
    )
  }

  const fetchMoreData = async () => {
    setLoading(true)
    const res = await getWarnLlist({
      warning_type: nowKey,
      project_id: projectWarningModal?.id ?? pid,
      last_id: twoData.last_id,
    }).finally(() => {
      setLoading(false)
    })
    setDatas(
      produce((draft: any) => {
        draft?.forEach((item: any) => {
          if (item.key === nowKey && res.list) {
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
    if (projectWarningModal?.visible) {
      getAll()
    } else {
      setNowKey('')
      setDatas([])
      setDis(false)
    }
  }, [projectWarningModal?.visible])

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
    let now = new Date()
    let formattedDate =
      now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()

    console.log(formattedDate)
    let date1 = new Date(dateStr2)
    let date2 = new Date(formattedDate)

    if (date1 >= date2) {
      return t('remaining')
    } else if (date1 < date2) {
      return t('overdue')
    }
  }

  const confirm = async () => {
    const res = await getWarnSave({
      project_id: projectWarningModal?.id ?? pid,
      updated_at: time,
    })

    if (res.code === 0) {
      dispatch(setProjectWarningModal({ visible: false }))
    }
  }

  // 点击跳转任务
  const onToDetail = (item: any) => {
    let params: any = {
      id: item.project_id,
      detailId: item.id,
      isOpenScreenDetail: true,
    }
    let url
    if (item.project_type === 1 && item.is_bug === 1) {
      params.specialType = 2
      url = 'ProjectManagement/Defect'
    } else if (item.project_type === 1 && item.is_bug !== 1) {
      params.specialType = 3
      url = 'ProjectManagement/Demand'
    } else {
      params.specialType = 1
      url = 'SprintProjectManagement/Affair'
    }

    if (params.specialType) {
      const resultParams = encryptPhp(JSON.stringify(params))
      window.open(
        `${window.origin}${
          import.meta.env.__URL_HASH__
        }${url}?data=${resultParams}}`,
      )
    }
  }

  const updateRefresh = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current)
    }
    timeRef.current = setTimeout(() => {
      getAll(true)
    }, 400)
  }

  return (
    <Modal
      centered
      bodyStyle={{ padding: 0 }}
      width={790}
      title={null}
      closable={false}
      footer={null}
      open={projectWarningModal?.visible}
      maskClosable={false}
      keyboard={false}
    >
      <Spin spinning={loading} indicator={<NewLoadingTransition />}>
        <div>
          <Header>
            <img
              src={frnIcon}
              style={{ width: '64px', height: '62px', marginRight: '24px' }}
              alt=""
            />
            {t('yourProjectIsAtPleaseAskRelevantPersonnelToHandleItPromptly')}
          </Header>
          <div style={{ padding: '0px 24px' }}>
            <Tabs activeKey={nowKey} onChange={onChange2} items={datas} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#969799', fontSize: 12 }}>
                {t('updatedOn')}
                {time}
              </span>
              <span onClick={updateRefresh} className={text2}>
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
              {twoData?.list?.map?.((item: any, index: any) => {
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
                      <span
                        className={`tit  ${text}`}
                        onClick={() => onToDetail(item)}
                      >
                        {item.name}
                      </span>
                      {Number(item.day) !== 0 && (
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
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        className={text3}
                        style={{ fontSize: 12, color: '#969799' }}
                      >
                        {t('handler')}：
                        {item.user_info.length > 0
                          ? item.user_info.map((o: any) => o.name).join('、')
                          : '--'}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#969799',
                          whiteSpace: 'nowrap',
                          marginLeft: 12,
                        }}
                      >
                        {t('expectedToEnd')}：
                        {item.expected_end_at ? item.expected_end_at : '--'}
                      </span>
                    </div>
                  </ListBox>
                )
              })}
              {twoData?.list?.length < 1 && (
                <NoData subText={format2(nowKey)} />
              )}
            </InfiniteScroll>
          </div>
          <Footer>
            <Tooltip
              arrowPointAtCenter
              open={first && !dis}
              placement="topLeft"
              title={t('pleaseCheckTheBoxesToKnowFirst')}
            >
              <Checkbox checked={dis} onChange={onChange}>
                <span style={{ fontSize: '12px', color: '#646566' }}>
                  {t(
                    'iAmAwareOfTheAboveProjectStatusAndWillSynchronizeOrHandleRelatedMattersInATimelyManner',
                  )}
                </span>
              </Checkbox>
            </Tooltip>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <CommonButton isDisable={!dis} onClick={confirm} type="primary">
                {t('alreadyKnown')}
              </CommonButton>
            </div>
          </Footer>
        </div>
      </Spin>
    </Modal>
  )
}

export default ProjectWarningModal