import { createRef, useEffect, useRef, useState } from 'react'
import {
  DetailInfoWrap,
  InfoItem,
  InfoWrap,
  Label,
  SprintDetailDragLine,
  SprintDetailMouseDom,
  TextWrap,
} from '../style'
import { useTranslation } from 'react-i18next'
import { Editor, EditorRef } from '@xyfe/uikit'
import { AddWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'
import useDeleteConfirmModal from '@/hooks/useDeleteConfirmModal'
import CommonButton from '@/components/CommonButton'
import ChildSprint from './ChildSprint'
import LinkSprint from './LinkSprint'
import ActivitySprint from './ActivitySprint'
import CommentFooter from '@/components/CommonComment/CommentFooter'
import { useDispatch, useSelector } from '@store/index'
import {
  addInfoAffairs,
  addAffairsComment,
  deleteInfoAffairs,
} from '@/services/affairs'
import { useSearchParams } from 'react-router-dom'
import { getIdsForAt, getParamsData, removeNull } from '@/tools'
import { getMessage } from '@/components/Message'
import {
  getAffairsCommentList,
  getAffairsInfo,
} from '@store/affairs/affairs.thunk'
import SprintTag from '@/components/TagComponent/SprintTag'
import { Tabs, TabsProps } from 'antd'

const SprintDetailInfo = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id, sprintId } = paramsData
  const LeftDom = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorRef>(null)
  const commentDom: any = createRef()
  const { open, DeleteConfirmModal } = useDeleteConfirmModal()
  const { affairsInfo } = useSelector(store => store.affairs)
  const { projectInfo, projectInfoValues } = useSelector(store => store.project)
  //   当前删除的附件数据
  const [tagList, setTagList] = useState<any>([])
  const [isEditInfo, setIsEditInfo] = useState(false)
  const [tabActive, setTabActive] = useState('sprint-info')
  const [isScroll, setIsScroll] = useState(false)
  const [info, setInfo] = useState('')

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  //   添加附件
  const onAddInfoAttach = async (data: any) => {
    const obj = {
      url: data.data.url,
      name: data.data.files.name,
      size: data.data.files.size,
      ext: data.data.files.suffix,
      ctime: data.data.files.time,
    }
    await addInfoAffairs({
      projectId: id,
      sprintId,
      type: 'attachment',
      targetId: [obj],
    })
    dispatch(getAffairsInfo({ projectId: id, sprintId }))
    onBottom()
  }

  //   确认删除附件事件
  const onDeleteConfirm = async (targetId: number) => {
    await deleteInfoAffairs({
      projectId: id,
      sprintId,
      type: 'attachment',
      targetId,
    })
    dispatch(getAffairsInfo({ projectId: id, sprintId }))
    getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    // onBottom()
  }

  //   删除附件弹窗
  const onDeleteInfoAttach = async (file?: any) => {
    open({
      title: '删除确认',
      text: t('p2.del'),
      onConfirm: () => {
        onDeleteConfirm(file)
        return Promise.resolve()
      },
    })
  }

  // 提交评论
  const onConfirmComment = async (value: { info: string }) => {
    await addAffairsComment({
      projectId: id,
      sprintId,
      content: value.info,
      a_user_ids: getIdsForAt(value.info),
    })
    getMessage({ type: 'success', msg: '评论成功' })
    dispatch(
      getAffairsCommentList({
        projectId: id,
        sprintId,
        page: 1,
        pageSize: 9999,
      }),
    )
    commentDom.current.cancel()
  }

  // tab标签栏
  const items: TabsProps['items'] = [
    {
      key: 'sprint-info',
      label: '描述',
    },
    {
      key: 'sprint-attachment',
      label: '附件',
    },
    {
      key: 'sprint-tag',
      label: '标签',
    },
    {
      key: 'sprint-childSprint',
      label: '子事务',
    },
    {
      key: 'sprint-linkSprint',
      label: '链接事务',
    },
    {
      key: 'sprint-activity',
      label: '活动',
    },
  ]

  // 监听左侧信息滚动
  const onChangeTabs = (value: string) => {
    const dom = document.getElementById(value)
    dom?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  // 计算滚动选中tab
  const handleScroll = (e: any) => {
    setIsScroll(!(e.target.scrollTop < 60))
    // 滚动容器
    const { scrollTop } = document.querySelector(
      '.sprintDetail_dom',
    ) as HTMLElement
    // 所有标题节点
    const titleItems = document.querySelectorAll('.info_item_tab')
    let arr: any = []
    titleItems.forEach(element => {
      const { offsetTop, id } = element as HTMLElement
      if (offsetTop <= scrollTop + 120) {
        const keys = [...arr, ...[id]]
        arr = [...new Set(keys)]
      }
    })
    setTabActive(arr[arr.length - 1])
  }

  // 富文本回车
  const onBlurEditor = () => {
    console.log(info, '富文本')
  }

  useEffect(() => {
    setTagList(
      affairsInfo?.tag?.map((i: any) => ({
        id: i.id,
        color: i.tag?.color,
        name: i.tag?.content,
      })),
    )
    setInfo(affairsInfo.info || '')
  }, [affairsInfo])

  useEffect(() => {
    window?.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('scroll', handleScroll, false)
    }
  }, [])

  return (
    <>
      <DeleteConfirmModal />
      <InfoWrap>
        {isScroll && (
          <Tabs activeKey={tabActive} items={items} onChange={onChangeTabs} />
        )}
        <DetailInfoWrap
          ref={LeftDom}
          className="sprintDetail_dom"
          isScroll={isScroll}
        >
          <InfoItem
            className="info_item_tab"
            id="sprint-info"
            style={{
              marginTop: '0px',
            }}
          >
            <Label>描述</Label>
            {info ? (
              <Editor
                value={info}
                getSuggestions={() => []}
                readonly={!isEditInfo}
                ref={editorRef}
                onReadonlyClick={() => {
                  setIsEditInfo(true)
                  setTimeout(() => {
                    editorRef.current?.focus()
                  }, 0)
                }}
                onChange={(value: string) => setInfo(value)}
                onBlur={onBlurEditor}
              />
            ) : (
              <TextWrap>--</TextWrap>
            )}
          </InfoItem>
          <InfoItem id="sprint-attachment" className="info_item_tab">
            <Label>{t('common.attachment')}</Label>
            <div>
              {projectInfo?.projectPermissions?.filter(
                (i: any) => i.name === '附件上传',
              ).length > 0 && (
                <UploadAttach
                  onBottom={onBottom}
                  defaultList={affairsInfo?.attachment?.map((i: any) => ({
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
          <InfoItem id="sprint-tag" className="info_item_tab">
            <Label>{t('common.tag')}</Label>
            <SprintTag
              defaultList={tagList}
              canAdd
              addWrap={
                <AddWrap hasDash>
                  <IconFont type="plus" />
                </AddWrap>
              }
            />
          </InfoItem>
          <ChildSprint />
          <LinkSprint />
          <ActivitySprint />
        </DetailInfoWrap>
        <CommentFooter
          onRef={commentDom}
          placeholder="发表评论（按M快捷键发表评论）"
          personList={removeNull(projectInfoValues, 'user_name')?.map(
            (k: any) => ({
              label: k.content,
              id: k.id,
            }),
          )}
          onConfirm={onConfirmComment}
          style={{ padding: '0 0 0 24px', width: 'calc(100% - 24px)' }}
          maxHeight="60vh"
          hasAvatar
        />
      </InfoWrap>
    </>
  )
}

export default SprintDetailInfo
