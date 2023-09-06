/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonUserAvatar from '../CommonUserAvatar'
import {
  getScheduleLogList,
  updateFlawPerception,
  updateTransactionPerception,
  updateStoryPerception,
} from '@/services/project'
import NoData from '../NoData'
import UploadAttach from '../UploadAttach'
import CommonIconFont from '../CommonIconFont'
import EditPerceptionModal from './EditPerceptionModal'
import { useSelector } from '@store/index'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`

const RecordItem = styled.div<{
  isDrawer?: boolean
  notPadding?: boolean
  noBorder?: boolean
}>`
  padding: ${props => (props.isDrawer || props.notPadding ? 0 : 16)}px;
  margin-bottom: ${props => (props.isDrawer || props.notPadding ? 24 : 0)}px;
  border-bottom: ${props =>
    props.isDrawer || props.notPadding || props.noBorder
      ? 'none'
      : '1px solid var(--neutral-n6-d1)'};
  display: flex;
  align-items: flex-start;
`

const ItemAvatar = styled.div`
  width: 24px;
  margin-right: 12px;
`

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  .icons {
    display: none;
  }
  &:hover .icons {
    display: inline-block;
  }
  .edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      font-size: 16px;
      color: var(--neutral-n2);
    }
  }
  .remark {
    font-size: 14px;
    color: var(--neutral-n2);
    margin-right: 16px;
  }
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 14px;
    div {
      font-family: SiYuanMedium;
      margin-right: 16px;
      color: var(--neutral-n1-d1);
    }
    span {
      color: var(--neutral-n2);
    }
  }
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  font-size: 12px;
  color: var(--neutral-n3);
  span {
    color: var(--neutral-n2);
  }
`

export const ShowLabel = styled.div`
  cursor: pointer;
  font-size: 14px;
  color: var(--primary-d2);
`

interface ScheduleRecordProps {
  // 详情id
  detailId: number
  // 项目id
  projectId: number
  //  是否是浮层
  isDrawer?: boolean
  // 不需要padding
  notPadding?: boolean
  // 是否打开
  isOpen?: boolean
  // 全屏详情需要高度滚动
  height?: any
  noBorder?: boolean
  isBug: boolean
}

const ScheduleRecord = (props: ScheduleRecordProps) => {
  const [t] = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [listData, setListData] = useState<any>({
    list: undefined,
  })
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const { userInfo } = useSelector(store => store.user)
  const projectInfo = useSelector(state => state.project.projectInfo)

  // 获取进度日志列表数据
  const getScheduleLogData = async (pageNumber?: number) => {
    const response = await getScheduleLogList({
      story_id: props.detailId,
      project_id: props.projectId,
      pagesize: 10,
      page: pageNumber ?? page,
    })
    setTotal(response.pager.total)
    setListData({
      list: pageNumber ? [...listData.list, ...response.list] : response.list,
    })
  }

  useEffect(() => {
    if ((props.detailId && props.projectId) || props.isOpen) {
      getScheduleLogData()
    }
  }, [props.detailId, props.projectId, props.isOpen])

  const conform = async (value: string) => {
    let result = null
    try {
      if (projectInfo.projectType === 2) {
        result = await updateTransactionPerception({
          project_id: props?.projectId,
          story_id: props?.detailId,
          log_id: editData?.id,
          perception: value,
        })
      }

      if (projectInfo.projectType === 1 && !props.isBug) {
        result = await updateStoryPerception({
          project_id: props?.projectId,
          story_id: props?.detailId,
          log_id: editData?.id,
          perception: value,
        })
      }
      if (projectInfo.projectType === 1 && props.isBug) {
        result = await updateFlawPerception({
          project_id: props?.projectId,
          story_id: props?.detailId,
          log_id: editData?.id,
          perception: value,
        })
      }
      if (result) {
        setVisible(false)
        getScheduleLogData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Wrap style={{ height: props.height, overflow: 'auto' }}>
      {listData?.list && listData?.list?.length > 0 && (
        <div>
          {listData?.list?.map((i: any) => (
            <RecordItem
              key={i.id}
              isDrawer={props.isDrawer}
              notPadding={props.notPadding}
              noBorder={props.noBorder}
            >
              <ItemAvatar>
                <CommonUserAvatar avatar={i.userInfo?.avatar} />
              </ItemAvatar>
              <ItemContent>
                <div className="edit">
                  <div className="title">
                    <div>
                      {i.userInfo?.name}（{i.userInfo?.position?.name || '--'}）
                    </div>
                    <span className="remark">{i.remark}</span>
                    <span>
                      {t('updated_progress')}
                      {i.before_schedule}%
                      <CommonIconFont type="swap-right" /> {i.after_schedule}%
                    </span>
                  </div>
                  {userInfo?.id === i?.userInfo?.id && (
                    <div className="icons">
                      <CommonIconFont
                        type="edit"
                        onClick={() => {
                          setVisible(true)
                          setEditData(i)
                        }}
                      />
                    </div>
                  )}
                </div>
                <InfoRow>
                  {t('reportingDate')}：<span>{i.report_date}</span>
                </InfoRow>
                <InfoRow>
                  {t('adjustDate')}：<span>{i.created_at}</span>
                </InfoRow>
                <InfoRow>
                  {t('labor_cost_this_time')}
                  <span>{t('thisTime')}</span>
                  <span>{i.task_time < 0 ? t('reduce') : t('increase')}</span>
                  <span>
                    {Math.abs(Math.floor((i.task_time / 3600) * 100) / 100)}h
                  </span>
                </InfoRow>
                <InfoRow>
                  {t('releaseNotes')}：<span>{i.perception || '--'}</span>
                </InfoRow>
                {i.attachment?.length > 0 && (
                  <UploadAttach
                    defaultList={i.attachment?.map((k: any) => ({
                      url: k.url,
                      id: i.id,
                      size: k.size,
                      time: k.ctime,
                      name: k.name,
                      suffix: k.ext,
                      username: i.userInfo.name ?? '--',
                    }))}
                    canUpdate
                    onC
                    isIteration
                  />
                )}
              </ItemContent>
            </RecordItem>
          ))}
          {total > listData?.list?.length && (
            <ShowLabel
              onClick={() => {
                setPage(page + 1)
                getScheduleLogData(page + 1)
              }}
            >
              {t('open_more')}
            </ShowLabel>
          )}
        </div>
      )}
      {!listData.list && <NoData />}
      <EditPerceptionModal
        visible={visible}
        onClose={() => {
          setVisible(false)
          setEditData(null)
        }}
        onConfirm={conform}
        perception={editData?.perception}
      />
    </Wrap>
  )
}

export default ScheduleRecord
