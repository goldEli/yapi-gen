// 需求详情-左侧

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import TagComponent from '../../components/TagComponent'
import DemandStatus from '../../components/DemandStatus'
import UploadAttach from '../../components/UploadAttach'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import {
  SliderWrap,
  ProgressWrapUpload,
  AddWrap,
} from '@/components/StyleCommon'
import EditorInfoReview from '@/components/EditorInfoReview'
import { addInfoDemand, deleteInfoDemand } from '@/services/project/demand'
import { off } from 'process'

const WrapLeft = styled.div({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  padding: '0 20px 24px 0',
})

const InfoItem = styled.div<{ activeState?: any }>(
  {
    display: 'flex',
    alignItems: 'center',
    marginTop: 14,
    position: 'relative',
  },
  ({ activeState }) => ({
    alignItems: activeState ? 'flex-start' : 'center',
  }),
)

const Label = styled.div({
  color: '#969799',
  fontSize: 14,
  fontWeight: 400,
  minWidth: 120,
  height: 32,
  lineHeight: '32px',
})

const TextWrap = styled.div({
  color: '#323233',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  img: {
    maxWidth: '20%',
  },
})

const WrapLeftBox = () => {
  const [t] = useTranslation()
  const {
    demandInfo,
    isShowProgress,
    percentShow,
    percentVal,
    uploadStatus,
    getDemandInfo,
    updateTableParams,
  } = useModel('demand')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const { projectInfo } = useModel('project')
  const { userInfo } = useModel('user')
  const [schedule, setSchedule] = useState(demandInfo?.schedule)
  const [tagList, setTagList] = useState<any>([])
  const LeftDom = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTagList(
      demandInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
    setSchedule(demandInfo?.schedule)
  }, [demandInfo])

  const onChangeSchedule = async () => {
    if (
      demandInfo?.user?.map((i: any) => i.user.id)?.includes(userInfo?.id) &&
      demandInfo.status.is_start !== 1 &&
      demandInfo.status.is_end !== 1
    ) {
      const obj = {
        projectId,
        id: demandInfo?.id,
        otherParams: { schedule },
      }
      try {
        await updateTableParams(obj)
        getDemandInfo({ projectId, id: demandInfo?.id })
      } catch (error) {
        //
      }
    }
  }

  const Children = (item: any) => {
    return (
      <ProgressWrapUpload
        status={uploadStatus}
        percent={percentVal}
        size="small"
        style={{ display: percentShow ? 'block' : 'none' }}
      />
    )
  }

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  const onAddInfoAttach = async (url: any) => {
    try {
      await addInfoDemand({
        projectId,
        demandId,
        type: 'attachment',
        targetId: url,
      })

      getDemandInfo({ projectId, id: demandId })
      onBottom?.()
    } catch (error) {
      //
    }
  }

  const onDeleteInfoAttach = async (file: any) => {
    try {
      await deleteInfoDemand({
        projectId,
        demandId,
        type: 'attachment',
        targetId: file,
      })

      getDemandInfo({ projectId, id: demandId })
      onBottom?.()
    } catch (error) {
      //
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 242px)',
        margin: '16px 0',
      }}
    >
      <div className="resize_bar2" />
      <div className="resize_line" />
      <div className="resize_save2">
        <WrapLeft ref={LeftDom}>
          <InfoItem>
            <Label>{t('project.demandStatus')}</Label>
            <DemandStatus pid={projectId} sid={demandId} />
          </InfoItem>
          <InfoItem>
            <Label>{t('newlyAdd.demandProgress')}</Label>
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              onMouseUp={onChangeSchedule}
            >
              <SliderWrap
                isDisabled={
                  demandInfo?.user
                    ?.map((i: any) => i.user.id)
                    ?.includes(userInfo?.id) &&
                  demandInfo.status.is_start !== 1 &&
                  demandInfo.status.is_end !== 1
                }
                style={{ width: 260 }}
                value={schedule}
                tipFormatter={(value: any) => `${value}%`}
                onChange={value => setSchedule(value)}
                tooltipVisible={false}
                disabled={
                  !(
                    demandInfo?.user
                      ?.map((i: any) => i.user.id)
                      ?.includes(userInfo?.id) &&
                    demandInfo.status.is_start !== 1 &&
                    demandInfo.status.is_end !== 1
                  )
                }
              />
              <span style={{ color: '#646566', marginLeft: 16, fontSize: 14 }}>
                {schedule}%
              </span>
            </div>
          </InfoItem>
          <InfoItem activeState>
            <Label>{t('mine.demandInfo')}</Label>
            {demandInfo?.info ? (
              <EditorInfoReview info={demandInfo?.info} />
            ) : (
              <TextWrap>--</TextWrap>
            )}
          </InfoItem>
          <InfoItem>
            <Label>{t('common.tag')}</Label>
            <TagComponent
              defaultList={tagList}
              canAdd
              addWrap={
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              }
            />
          </InfoItem>
          <InfoItem activeState>
            <Label>{t('common.attachment')}</Label>
            <div style={{ width: 'calc(100% - 120px)' }}>
              <UploadAttach
                onBottom={onBottom}
                defaultList={demandInfo?.attachment?.map((i: any) => ({
                  url: i.attachment.path,
                  id: i.id,
                  time: i.attachment.created_at,
                }))}
                canUpdate
                onC
                del={onDeleteInfoAttach}
                add={onAddInfoAttach}
                addWrap={
                  projectInfo?.projectPermissions?.filter(
                    (i: any) => i.name === '附件上传',
                  ).length > 0 ? (
                    <AddWrap>
                      <IconFont type="plus" />
                      <div>{t('common.add23')}</div>
                    </AddWrap>
                  ) : (
                    (null as any)
                  )
                }
              />
            </div>
          </InfoItem>
        </WrapLeft>
      </div>
    </div>
  )
}

export default WrapLeftBox
