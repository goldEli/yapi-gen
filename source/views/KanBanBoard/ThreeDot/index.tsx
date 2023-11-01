/* eslint-disable max-depth */
import React from 'react'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import IconFont from '@/components/IconFont'
import { HoverIcon } from '../IssueCard/styled'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import { store, useDispatch, useSelector } from '@store/index'
import { deleteStory } from '@store/kanBan/kanBan.thunk'
import { copyLink, getIsPermission, getProjectIdByUrl } from '@/tools'
import { projectSlice, setAddWorkItemModal } from '@store/project'
import useI18n from '@/hooks/useI18n'
import { encryptPhp } from '@/tools/cryptoPhp'
import { getNewkanbanStoriesOfList } from '@/services/kanban'
import { setKanbanInfoByGroup } from '@store/kanBan'

interface ThreeDotProps {
  story: Model.KanBan.Story
  groupId?: number
  cid?: number
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
    let params: any = {
      id: projectInfo.id,
      detailId: record.id,
      isOpenScreenDetail: true,
    }
    let url = ''
    if (projectInfo.projectType === 2) {
      params.specialType = 1
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `SprintProjectManagement/Affair?data=${resultParams}`
    } else if (projectInfo.projectType === 1 && record.is_bug === 1) {
      params.specialType = 2
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectManagement/Defect?data=${resultParams}`
    } else if (projectInfo.projectType === 1 && record.is_bug !== 1) {
      params.specialType = 3
      const resultParams = encryptPhp(JSON.stringify(params))
      url = `ProjectManagement/Demand?data=${resultParams}`
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
        console.log(props, '删除操作的数据')

        dispatch(
          deleteStory(
            {
              groupId: props.groupId,
              columnId: props.cid,
              id: props.story.id,
            },
            typeNum,
          ),
        )
        return Promise.resolve()
      },
    })
  }
  function findAndReplace(
    groupId: any,
    issuesId: any,
    array: any,
    cId: any,
    newData: any,
  ) {
    const cc = JSON.parse(JSON.stringify(array))
    for (let i = 0; i < cc.length; i++) {
      console.log(cc[i])
      if (cc[i].id === groupId) {
        for (let b = 0; b < cc[i].columns.length; b++) {
          if (cc[i].columns[b].id === cId) {
            for (let c = 0; c < cc[i].columns[b].stories.length; c++) {
              if (cc[i].columns[b].stories[c].id === issuesId) {
                cc[i].columns[b].stories.splice(c, 1, newData)
              }
            }
          }
        }
      }
    }

    return cc
  }
  const updata = async (pp: any) => {
    const res = await getNewkanbanStoriesOfList({
      project_id: getProjectIdByUrl(),
      story_ids: [pp.id],
    })

    dispatch(
      setKanbanInfoByGroup(
        findAndReplace(
          pp.groupId,
          pp.id,
          store.getState().kanBan.kanbanInfoByGroup,
          pp.columnId,
          res[0],
        ),
      ),
    )
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
                  confirm: () => {
                    updata({
                      groupId: props.groupId,
                      columnId: props.cid,
                      id: props.story.id,
                    })
                  },
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
