/* eslint-disable no-undefined */
import { Tabs, TabsProps } from 'antd'
import { ActivityTabItem, InfoItem, ItemNumber, Label } from '../style'
import { useEffect, useState } from 'react'
import ChangeRecord from './ChangeRecord'
import Circulation from './Circulation'
import CommonComment from '@/components/CommonComment'
import { useSearchParams } from 'react-router-dom'
import { getIdsForAt, getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { getAffairsCommentList } from '@store/affairs/affairs.thunk'
import { deleteAffairsComment, updateAffairsComment } from '@/services/affairs'
import { getMessage } from '@/components/Message'
import { useTranslation } from 'react-i18next'
import ScreenMinHover from '@/components/ScreenMinHover'

const ActivitySprint = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [activeKey, setActiveKey] = useState('1')
  const [filter, setFilter] = useState(false)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData ?? {}
  const { affairsCommentList, affairsInfo, affairsActivity } = useSelector(
    store => store.affairs,
  )

  // 获取评论列表
  const getList = () => {
    dispatch(
      getAffairsCommentList({
        projectId: id,
        sprintId: affairsInfo.id || 0,
        page: 1,
        pageSize: 999,
      }),
    )
  }

  // 删除评论
  const onDeleteCommentConfirm = async (commentId: number) => {
    await deleteAffairsComment({ projectId: id, id: commentId })
    getMessage({ type: 'success', msg: t('successfullyDeleted') })
    getList()
  }

  // 编辑评论
  const onEditComment = async (value: string, commentId: number) => {
    if (affairsInfo?.info === value || !value) {
      return
    }
    await updateAffairsComment({
      projectId: id,
      id: commentId,
      storyId: affairsInfo.id || 0,
      content: value,
      ids: getIdsForAt(value),
    })
    getMessage({ type: 'success', msg: t('successfullyModified') })
    getList()
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <ActivityTabItem>
          <span>{t('comment1')}</span>
          <ItemNumber isActive={activeKey === '1'}>
            {affairsCommentList?.list.length || 0}
          </ItemNumber>
        </ActivityTabItem>
      ),
      children: (
        <CommonComment
          data={affairsCommentList}
          onDeleteConfirm={onDeleteCommentConfirm}
          onEditComment={onEditComment}
        />
      ),
    },
    {
      key: '2',
      label: (
        <ActivityTabItem>
          <span>{t('changeLog')}</span>
          <ItemNumber isActive={activeKey === '2'}>
            {affairsInfo.changeCount}
          </ItemNumber>
        </ActivityTabItem>
      ),
      children: <ChangeRecord activeKey={activeKey} filter={filter} />,
    },
    {
      key: '3',
      label: (
        <ActivityTabItem>
          <span>{t('circulationRecords')}</span>
        </ActivityTabItem>
      ),
      children: <Circulation activeKey={activeKey} />,
    },
  ]

  const onChange = (key: string) => {
    setActiveKey(key)
    if (key === '1') {
      getList()
    }
  }

  useEffect(() => {
    setActiveKey(affairsActivity)
  }, [affairsActivity])

  return (
    <InfoItem id="sprint-activity" className="info_item_tab">
      <Label>{t('activity')}</Label>
      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={onChange}
        tabBarExtraContent={
          activeKey === '2' ? (
            <ScreenMinHover
              label={t('common.search')}
              icon="filter"
              isActive={filter}
              onClick={() => setFilter(!filter)}
            />
          ) : null
        }
      />
    </InfoItem>
  )
}

export default ActivitySprint
