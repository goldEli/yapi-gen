/* eslint-disable max-lines */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable multiline-ternary */
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
import { SliderWrap, ProgressWrapUpload } from '@/components/StyleCommon'
import Viewer from 'react-viewer'

const WrapLeft = styled.div({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  paddingBottom: 24,
})

const TextWrapEditor = styled.div({
  color: '#323233',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  img: {
    maxWidth: '100%',
    height: 'auto!important',
    cursor: 'pointer',
  },
  p: {
    marginBottom: '0px!important',
  },
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

export const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    height: 26,
    boxSizing: 'border-box',
    cursor: 'pointer',
    borderRadius: 6,
    width: 'fit-content',
    '.anticon': {
      fontSize: 16,
      alignItems: 'center',
      svg: {
        margin: 0,
      },
    },
    div: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  ({ hasColor, hasDash }) => ({
    padding: hasColor || hasDash ? '0 4px' : 0,
    color: hasColor ? '#2877FF' : '#969799',
    border: hasColor
      ? '1px solid #2877FF'
      : hasDash
      ? '1px dashed #969799'
      : '1px solid white',
    '.anticon > svg': {
      color: hasColor ? '#2877FF' : '#969799',
    },
    '.anticon ': {
      marginRight: hasDash ? 0 : 4,
    },
    '&: hover': {
      border: hasDash ? '1px dashed #2877ff' : '',
      '.anticon': {
        svg: {
          color: '#2877ff',
        },
      },
      div: {
        color: '#2877ff',
      },
    },
  }),
)

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
  const textWrapEditor = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const LeftDom = useRef<HTMLInputElement>(null)
  const [pictureList, setPictureList] = useState({
    imageArray: [],
    index: 0,
  })

  const onGetViewPicture = (e: any) => {
    if (e.path[0].nodeName === 'IMG') {
      const params: any = {}
      const oPics = textWrapEditor?.current?.getElementsByTagName('img')
      params.imageArray = []
      if (oPics) {
        for (const element of oPics) {
          params.imageArray.push({ src: element.src })
        }
        for (let i = 0; i < oPics.length; i++) {
          if (e.path[0].src === params.imageArray[i].src) {
            params.index = i
          }
        }
      }
      setIsVisible(true)
      setPictureList(params)
    }
  }

  useEffect(() => {
    textWrapEditor?.current?.addEventListener('click', e => onGetViewPicture(e))
    return textWrapEditor?.current?.removeEventListener('click', e =>
      onGetViewPicture(e),
    )
  }, [])

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

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 250px)',
      }}
    >
      <div className="resize_bar2" />
      <div className="resize_line" />
      <div className="resize_save2">
        <WrapLeft ref={LeftDom}>
          {isVisible ? (
            <Viewer
              zIndex={99}
              visible={isVisible}
              images={pictureList?.imageArray}
              activeIndex={pictureList?.index}
              onClose={() => setIsVisible(false)}
            />
          ) : null}

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
                style={{ width: 260 }}
                value={schedule}
                tipFormatter={(value: any) => `${value}%`}
                onChange={value => setSchedule(value)}
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
              <TextWrapEditor
                ref={textWrapEditor}
                dangerouslySetInnerHTML={{ __html: demandInfo?.info }}
              />
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
            <UploadAttach
              onBottom={onBottom}
              defaultList={demandInfo?.attachment?.map((i: any) => ({
                path: i.attachment.path,
                id: i.id,
              }))}
              canUpdate
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
              child={isShowProgress ? null : <Children />}
            />
          </InfoItem>
        </WrapLeft>
      </div>
    </div>
  )
}

export default WrapLeftBox
