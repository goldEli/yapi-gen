/* eslint-disable no-undefined */
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommonUserAvatar from '../CommonUserAvatar'
import { getScheduleLogList } from '@/services/project'
import NoData from '../NoData'
import UploadAttach from '../UploadAttach'
import CommonIconFont from '../CommonIconFont'

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
`

const RecordItem = styled.div<{ isDrawer?: boolean }>`
  padding: ${props => (props.isDrawer ? 0 : 16)}px;
  margin-bottom: ${props => (props.isDrawer ? 24 : 0)}px;
  border-bottom: ${props =>
    props.isDrawer ? 'none' : '1px solid var(--neutral-n6-d1)'};
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
}

const ScheduleRecord = (props: ScheduleRecordProps) => {
  const [t] = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [listData, setListData] = useState<any>({
    list: undefined,
  })

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
    if (props.detailId && props.projectId) {
      getScheduleLogData()
    }
  }, [props.detailId, props.projectId])

  return (
    <Wrap>
      {!!listData?.list &&
        (listData?.list?.length > 0 ? (
          <div>
            {listData?.list?.map((i: any) => (
              <RecordItem key={i.id} isDrawer={props.isDrawer}>
                <ItemAvatar>
                  <CommonUserAvatar avatar={i.userInfo?.avatar} />
                </ItemAvatar>
                <ItemContent>
                  <div className="title">
                    <div>
                      {i.userInfo?.name}（{i.userInfo?.position?.name}）
                    </div>
                    <span>
                      更新了进度{i.before_schedule}%{' '}
                      <CommonIconFont type="swap-right" /> {i.after_schedule}%
                    </span>
                  </div>
                  <InfoRow>达成日期：{i.created_at}</InfoRow>
                  <InfoRow>
                    工时花费：本次{Math.floor((i.task_time / 60) * 100) / 100}h
                  </InfoRow>
                  <InfoRow>更新说明：{i.remark}</InfoRow>
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
                展开更多
              </ShowLabel>
            )}
          </div>
        ) : (
          <NoData />
        ))}
    </Wrap>
  )
}

export default ScheduleRecord
