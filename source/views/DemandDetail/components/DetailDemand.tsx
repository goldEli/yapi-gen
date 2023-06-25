import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
// import DemandStatus from '../../components/DemandStatus'
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
import { Editor } from '@xyfe/uikit'
import { getMessage } from '@/components/Message'
import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'
import DemandTag from '@/components/TagComponent/DemandTag'
import { InfoItem, Label, TextWrap, WrapLeft } from '../style'
import CommonButton from '@/components/CommonButton'
import DemandStatus from './DemandStatus'

const DetailDemand = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
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
        demandId: demandInfo.id,
        type: 'attachment',
        targetId: [obj],
      })
      const result = await getDemandInfo({ projectId, id: demandInfo.id })
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
        demandId: demandInfo.id,
        type: 'attachment',
        targetId: files,
      })
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
      const result = await getDemandInfo({ projectId, id: demandInfo.id })
      dispatch(setDemandInfo(result))
      onBottom?.()
    } catch (error) {
      //
    }

    setIsDelVisible(false)
  }
  return (
    <WrapLeft ref={LeftDom}>
      <InfoItem
        style={{
          marginTop: '0px',
        }}
      >
        <Label>{t('mine.demandInfo')}</Label>
        {demandInfo?.info ? (
          <Editor value={demandInfo?.info} getSuggestions={() => []} readonly />
        ) : (
          <TextWrap>--</TextWrap>
        )}
      </InfoItem>
      <InfoItem>
        <Label>{t('common.tag')}</Label>
        <DemandTag
          defaultList={tagList}
          canAdd
          addWrap={
            <AddWrap hasDash>
              <IconFont type="plus" />
            </AddWrap>
          }
        />
      </InfoItem>
      <InfoItem>
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
                <CommonButton type="primaryText" icon="plus">
                  添加附件
                </CommonButton>
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
      {demandInfo.id && (
        <InfoItem>
          <Label>{t('new_p1.a3')}</Label>
          <DemandStatus pid={projectId} sid={demandInfo.id} />
        </InfoItem>
      )}
    </WrapLeft>
  )
}

export default DetailDemand
