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
import { AddWrap } from '@/components/StyleCommon'
import EditorInfoReview from '@/components/EditorInfoReview'
import { addInfoDemand, deleteInfoDemand } from '@/services/project/demand'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useSelector } from '../../../../../../../store'
import { message } from 'antd'

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
  color: '#323233',
  fontSize: 14,
  minWidth: 120,
  height: 32,
  lineHeight: '32px',
  fontWeight: 'bold',
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
  const { demandInfo, getDemandInfo } = useModel('demand')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { demandId } = paramsData
  const { projectInfo } = useModel('project')
  const [tagList, setTagList] = useState<any>([])
  const LeftDom = useRef<HTMLInputElement>(null)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [files, setFiles] = useState()
  const { value: modalState } = useSelector(store => store.modal)
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

      getDemandInfo({ projectId, id: demandId })
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
      message.success(t('common.deleteSuccess'))
      getDemandInfo({ projectId, id: demandId })
      onBottom?.()
    } catch (error) {
      //
    }

    setIsDelVisible(false)
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
          <InfoItem
            style={{
              marginTop: '0px',
            }}
            activeState
          >
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
                        color: '#2877FF',
                      }}
                    >
                      <IconFont
                        style={{
                          color: '#2877FF',
                        }}
                        type="plus"
                      />
                      <div>{t('p2.addAdjunct')}</div>
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
      </div>
    </div>
  )
}

export default WrapLeftBox
