import React from 'react'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import IconFont from '@/components/IconFont'
import { HoverIcon } from '../IssueCard/styled'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { useDispatch, useSelector } from '@store/index'
import { deleteStory } from '@store/kanBan/kanBan.thunk'
import { copyLink, getIsPermission, getProjectIdByUrl } from '@/tools'
import { setAddWorkItemModal } from '@store/project'
import useI18n from '@/hooks/useI18n'
import { encryptPhp } from '@/tools/cryptoPhp'

interface ThreeDotProps {
  story: Model.KanBan.Story
}

const Item = styled.div`
  width: 100%;
`

const ThreeDot: React.FC<ThreeDotProps> = props => {
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const dispatch = useDispatch()
  const { projectInfo } = useSelector(store => store.project)
  const { t } = useI18n()

  const hasDel = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/delete' : 'b/transaction/delete',
  )
  const hasEdit = getIsPermission(
    projectInfo?.projectPermissions,
    projectInfo.projectType === 1 ? 'b/story/update' : 'b/transaction/update',
  )

  // 复制需求id
  const onCopyNumber = (id: string) => {
    copyLink(id, t('copysuccess'), t('copyfailed'))
  }

  //  点击复制链接
  const onCopy = (record: any) => {
    let text: any = ''
    let beforeUrl: any = ''
    beforeUrl = `${window.origin}${import.meta.env.__URL_HASH__}`
    let params = null
    let url = ''
    if (projectInfo.projectType === 2) {
      params = encryptPhp(
        JSON.stringify({
          id: projectInfo.id,
          sprintId: record.id,
          newOpen: true,
        }),
      )
      url = `SprintProjectManagement/SprintProjectDetail?data=${params}`
    } else if (projectInfo.projectType === 1 && record.is_bug === 1) {
      params = encryptPhp(
        JSON.stringify({
          id: projectInfo.id,
          flawId: record.id,
          newOpen: true,
        }),
      )
      url = `ProjectManagement/DefectDetail?data=${params}`
    } else if (projectInfo.projectType === 1 && record.is_bug !== 1) {
      params = encryptPhp(
        JSON.stringify({
          id: projectInfo.id,
          demandId: record.id,
          newOpen: true,
        }),
      )
      url = `ProjectManagement/DemandDetail?data=${params}`
    }
    text += `【${record.story_prefix_key}-${record.name}】 ${beforeUrl}${url} \n`
    copyLink(text, t('common.copySuccess'), t('common.copyFail'))
  }

  const onDel = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    open({
      title: t('confirm_deletion'),
      text: t('are_you_sure_to_delete_this_requirement?'),
      onConfirm: () => {
        // 判断当前删除的是那种类型
        let typeNum = 0
        if (projectInfo.projectType === 2) {
          typeNum = 2
        } else if (projectInfo.projectType === 1 && props.story.is_bug === 1) {
          typeNum = 3
        } else if (projectInfo.projectType === 1 && props.story.is_bug !== 1) {
          typeNum = 1
        }
        dispatch(
          deleteStory(
            {
              id: props.story.id,
            },
            typeNum,
          ),
        )
        return Promise.resolve()
      },
    })
  }

  const items = [
    {
      key: '1',
      label: (
        <Item
          onClick={e => {
            e.stopPropagation()
            dispatch(
              setAddWorkItemModal({
                visible: true,
                params: {
                  type: props.story?.project_category?.work_type,
                  editId: props.story.id,
                  projectId: getProjectIdByUrl(),
                  title: t('editorial_affairs'),
                },
              }),
            )
          }}
        >
          {t('edit')}
        </Item>
      ),
    },
    {
      key: '2',
      label: <Item onClick={onDel}>{t('delete')}</Item>,
    },
    {
      key: '3',
      label: (
        <Item
          onClick={e => {
            e.stopPropagation()
            onCopyNumber(String(props.story.story_prefix_key))
          }}
        >
          {t('copy_number')}
        </Item>
      ),
    },
    {
      key: '4',
      label: (
        <Item
          onClick={e => {
            e.stopPropagation()
            onCopy(props.story)
          }}
        >
          {t('copy_title')}
        </Item>
      ),
    },
  ].filter(item => {
    if (item.key === '2') {
      return !hasDel
    }
    if (item.key === '1') {
      return !hasEdit
    }
    return true
  })
  return (
    <>
      <Dropdown
        trigger={['hover']}
        menu={{
          items,
        }}
        placement="bottomRight"
        getPopupContainer={(i: any) => i.parentNode}
      >
        <HoverIcon>
          <IconFont
            style={{
              color: 'var(--neutral-n3)',
              fontSize: 16,
            }}
            type="more"
          />
        </HoverIcon>
      </Dropdown>
      <DeleteConfirmModal />
    </>
  )
}

export default ThreeDot
