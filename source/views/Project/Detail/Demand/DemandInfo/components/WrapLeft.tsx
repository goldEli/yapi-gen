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
import { Progress } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getParamsData } from '@/tools'
import { SliderWrap } from '@/components/StyleCommon'
import Viewer from 'react-viewer'

const WrapLeft = styled.div({
  width: 'calc(100% - 472px)',
  overflow: 'auto',
  paddingBottom: 24,
})

const TextWrapEditor = styled.div({
  color: '#323233',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  img: {
    maxWidth: '20%',
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

const AddWrap = styled.div<{ hasColor?: boolean; hasDash?: boolean }>(
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

const ProgressWrap = styled(Progress)({
  '.ant-progress-status-exception .ant-progress-bg': {
    backgroundColor: '#ff5c5e',
    height: '2px !important',
  },
  '.ant-progress-status-exception .ant-progress-text': {
    color: '#ff5c5e',
  },
  '.ant-progress-success-bg .ant-progress-bg': {
    backgroundColor: '#2877ff',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-bg': {
    backgroundColor: '#43ba9a',
    height: '2px !important',
  },
  '.ant-progress-status-success .ant-progress-text': {
    color: '#43ba9a',
  },
  '.ant-progress-inner': {
    height: '2px !important',
    minWidth: 200,
  },
  '.ant-progress-small.ant-progress-line,.ant-progress-small.ant-progress-line .ant-progress-text .anticon':
    {
      fontSize: 10,
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
  const [schedule, setSchedule] = useState(demandInfo?.schedule)
  const [tagList, setTagList] = useState<any>([])
  const textWrapEditor = useRef<HTMLInputElement>(null)
  const [isVisible, setIsVisible] = useState(false)
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
    return textWrapEditor?.current?.removeEventListener('click', e => onGetViewPicture(e))
  }, [])

  useEffect(() => {
    setTagList(
      demandInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
  }, [demandInfo])

  const onChangeSchedule = async () => {
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

  const Children = (item: any) => {
    return (
      <ProgressWrap
        status={uploadStatus}
        percent={percentVal}
        size="small"
        style={{ display: percentShow ? 'block' : 'none' }}
      />
    )
  }

  return (
    <WrapLeft>
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
            style={{ width: 320 }}
            value={schedule}
            tipFormatter={(value: any) => `${value}%`}
            onChange={value => setSchedule(value)}
          />
          <span style={{ color: '#646566', marginLeft: 8, fontSize: 14 }}>
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
        )
          : <TextWrap>--</TextWrap>
        }
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
      <InfoItem
        activeState
        hidden={
          !projectInfo?.projectPermissions?.filter(
            (i: any) => i.name === '附件上传',
          ).length
        }
      >
        <Label>{t('common.attachment')}</Label>
        <UploadAttach
          defaultList={demandInfo?.attachment?.map((i: any) => ({
            path: i.attachment.path,
            id: i.id,
          }))}
          canUpdate
          addWrap={
            <AddWrap>
              <IconFont type="plus" />
              <div>{t('common.add23')}</div>
            </AddWrap>
          }
          child={isShowProgress ? null : <Children />}
        />
      </InfoItem>
    </WrapLeft>
  )
}

export default WrapLeftBox
