/* eslint-disable camelcase */
/* eslint-disable no-empty-function */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-len */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { LevelContent } from '@/components/Level'
import Popconfirm from '@/components/Popconfirm'
import TagComponent from '../../components/TagComponent'
import DemandStatus from '../../components/DemandStatus'
import ParentDemand from '../../components/ParentDemand'
import UploadAttach from '../../components/UploadAttach'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const WrapLeft = styled.div({
  width: 'calc(100% - 472px)',
})

const InfoItem = styled.div({
  display: 'flex',
  marginTop: 24,
  position: 'relative',
})

const Label = styled.div({
  color: '#646566',
  fontSize: 14,
  fontWeight: 400,
  minWidth: 120,
  height: 22,
  lineHeight: '22px',
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
  }),
)

const DownPriority = styled.div({
  marginLeft: 8,
  '.icon': {
    marginLeft: 8,
    visibility: 'hidden',
    fontSize: 16,
    color: '#2877ff',
  },
  '&: hover': {
    '.icon': {
      visibility: 'visible',
    },
  },
})

const WrapLeftBox = (props: { onUpdate?(): void }) => {
  const [t] = useTranslation()
  const { demandInfo, updatePriority } = useModel('demand')
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const { projectInfo } = useModel('project')
  const [tagList, setTagList] = useState<any>([])

  const onChangeState = async (item: any) => {
    try {
      await updatePriority({ demandId, priorityId: item.priorityId })
      message.success(t('common.prioritySuccess'))
      props.onUpdate?.()
    } catch (error) {

      //
    }
  }

  useEffect(() => {
    setTagList(
      demandInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
  }, [demandInfo])

  return (
    <WrapLeft>
      <InfoItem>
        <Label>{t('project.demandStatus')}</Label>
        <DemandStatus />
      </InfoItem>
      <InfoItem>
        <Label>{t('mine.demandInfo')}</Label>
        <TextWrap dangerouslySetInnerHTML={{ __html: demandInfo?.info }} />
      </InfoItem>
      <InfoItem>
        <Label>{t('common.dealName')}</Label>
        <TextWrap>
          {demandInfo?.user?.map((i: any) => i.user.name).join('、')}
        </TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.createName')}</Label>
        <TextWrap>{demandInfo?.userName}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.createTime')}</Label>
        <TextWrap>{demandInfo?.createdTime}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.finishTime')}</Label>
        <TextWrap>{demandInfo?.finishTime || '--'}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.parentDemand')}</Label>
        <ParentDemand
          addWrap={
            <AddWrap>
              <IconFont type="plus" />
              <div>{t('common.add23')}</div>
            </AddWrap>
          }
        />
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
        />
      </InfoItem>
      <InfoItem>
        <Label>{t('common.iterate')}</Label>
        <TextWrap>{demandInfo?.iterateName}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.priority')}</Label>
        <Popconfirm
          content={({ onHide }: { onHide(): void }) => {
            return (
              <LevelContent
                onTap={item => onChangeState(item)}
                onHide={onHide}
                record={{
                  id: demandId,
                  project_id: projectId,
                }}
              />
            )
          }}
        >
          <div
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <IconFont
              style={{ fontSize: 16, color: demandInfo?.priority?.color }}
              type={demandInfo?.priority?.icon}
            />
            <DownPriority>
              <span>{demandInfo?.priority?.content || '--'}</span>
              <IconFont className="icon" type="down-icon" />
            </DownPriority>
          </div>
        </Popconfirm>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.start')}</Label>
        <TextWrap>{demandInfo?.expectedStart}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.end')}</Label>
        <TextWrap>{demandInfo?.expectedEnd}</TextWrap>
      </InfoItem>
      <InfoItem>
        <Label>{t('common.copySend')}</Label>
        <TextWrap>
          {demandInfo?.copySend?.map((i: any) => i.copySend?.name).join('、')}
        </TextWrap>
      </InfoItem>
    </WrapLeft>
  )
}

export default WrapLeftBox
