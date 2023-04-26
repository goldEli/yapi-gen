// 需求详情-左侧

/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/no-danger */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import DemandStatus from '../../components/DemandStatus'
import UploadAttach from '@/components/UploadAttach'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { AddWrap } from '@/components/StyleCommon'
import {
  addInfoDemand,
  deleteInfoDemand,
  getDemandInfo,
} from '@/services/demand'
import DeleteConfirm from '@/components/DeleteConfirm'
import { message } from 'antd'
import { setDemandInfo } from '@store/demand'
import { useDispatch, useSelector } from '@store/index'
import TagComponent from '@/components/TagComponent'
import { Editor } from '@xyfe/uikit'
import { getMessage } from '@/components/Message'
import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'

const WrapLeft = styled.div({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  padding: '0 20px 24px 0',
})

const InfoItem = styled.div<{ activeState?: any }>({
  display: 'flex',
  marginTop: 14,
  position: 'relative',
  flexDirection: 'column',
})

const Label = styled.div({
  color: 'var(--neutral-n1-d1)',
  fontSize: 14,
  minWidth: 120,
  height: 32,
  lineHeight: '32px',
  fontFamily: 'SiYuanMedium',
})

const TextWrap = styled.div({
  color: 'var(--neutral-n1-d1)',
  fontSize: 14,
  display: 'flex',

  flexDirection: 'column',
  img: {
    maxWidth: '20%',
  },
})

const WrapLeftBox = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const { projectInfo } = useSelector(store => store.project)
  const { demandInfo } = useSelector(store => store.demand)
  const [tagList, setTagList] = useState<any>([])
  const LeftDom = useRef<HTMLInputElement>(null)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [files, setFiles] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    setTagList(
      demandInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
  }, [demandInfo])

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  const onAddInfoAttach = async (data: any) => {
    const obj = {
      url: data.data.url,
      name: data.data.files.name,
      size: data.data.files.size,
      ext: data.data.files.suffix,
      ctime: data.data.files.time,
    }

    try {
      await addInfoDemand({
        projectId,
        demandId,
        type: 'attachment',
        targetId: [obj],
      })
      const result = await getDemandInfo({ projectId, id: demandId })
      dispatch(setDemandInfo(result))
      onBottom?.()
    } catch (error) {
      //
    }
  }

  const onDeleteInfoAttach = async (file: any) => {
    setIsDelVisible(true)
    setFiles(file)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteInfoDemand({
        projectId,
        demandId,
        type: 'attachment',
        targetId: files,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      const result = await getDemandInfo({ projectId, id: demandId })
      dispatch(setDemandInfo(result))
      onBottom?.()
    } catch (error) {
      //
    }

    setIsDelVisible(false)
  }

  return (
    <DragMoveContainer
      max="65vw"
      min="30vw"
      width="65vw"
      height="calc(100vh - 242px)"
    >
      <WrapLeft ref={LeftDom}>
        <InfoItem
          style={{
            marginTop: '0px',
          }}
          activeState
        >
          <Label>{t('mine.demandInfo')}</Label>
          {demandInfo?.info ? (
            <Editor
              value={demandInfo?.info}
              getSuggestions={() => []}
              readonly
            />
          ) : (
            // <div dangerouslySetInnerHTML={{ __html: demandInfo?.info }} />
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
          <div>
            {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length > 0 && (
              <UploadAttach
                onBottom={onBottom}
                defaultList={demandInfo?.attachment?.map((i: any) => ({
                  url: i.attachment.path,
                  id: i.id,
                  size: i.attachment.size,
                  time: i.created_at,
                  name: i.attachment.name,
                  suffix: i.attachment.ext,
                  username: i.user_name ?? '--',
                }))}
                canUpdate
                onC
                del={onDeleteInfoAttach}
                add={onAddInfoAttach}
                addWrap={
                  <AddWrap
                    hasColor
                    style={{
                      marginBottom: '10px',
                      color: 'var(--primary-d2)F',
                    }}
                  >
                    <IconFont
                      style={{
                        color: 'var(--primary-d2)',
                      }}
                      type="plus"
                    />
                    <div
                      style={{
                        color: 'var(--primary-d2)',
                      }}
                    >
                      {t('p2.addAdjunct')}
                    </div>
                  </AddWrap>
                }
              />
            )}
            {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length <= 0 && <span>--</span>}
          </div>
        </InfoItem>
        <DeleteConfirm
          text={t('p2.del')}
          isVisible={isDelVisible}
          onChangeVisible={() => setIsDelVisible(!isDelVisible)}
          onConfirm={onDeleteConfirm}
        />
        <InfoItem>
          <Label>{t('new_p1.a3')}</Label>
          <DemandStatus pid={projectId} sid={demandId} />
        </InfoItem>
      </WrapLeft>
    </DragMoveContainer>
  )
}

export default WrapLeftBox
