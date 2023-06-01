import React, { useState, useEffect } from 'react'
import {
  Wrap,
  SearchBox,
  ContentBox,
  FooterBox,
  ContentItem,
  LoadMore,
  CancelParentBox,
} from './style'
import InputSearch from '../InputSearch'
import { getLongStoryList } from '@store/sprint/sprint.thunk'
import { useDispatch, useSelector } from '@store/index'
import { List } from 'antd'
import {
  addInfoAffairs,
  deleteInfoAffairs,
  updateInfoAffairs,
} from '@/services/affairs'
interface IProps {
  detail: Model.Affairs.AffairsInfo
}
const LongStoryDropdown = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { detail } = props
  console.log('detail-----', detail)
  const { longStoryList } = useSelector(state => state.sprint)
  const [list, setList] = useState<Model.Sprint.longStroyItem[]>([])
  const [params, setParams] = useState<API.Sprint.getLongStoryList.Params>({
    order: 'asc',
    orderkey: 'id',
    search: {
      all: 0,
      project_id: 607,
      keyword: '',
    },
    page: 1,
    pagesize: 2,
  })
  const onLoadMore = () => {
    console.log('加载更多')
    if (list.length === longStoryList.pager?.total) {
      return
    }
    setParams((p: API.Sprint.getLongStoryList.Params) => {
      let { search } = { ...p }
      search = { ...search }
      return { ...p, search, pagesize: p.pagesize + 2 }
    })
  }
  const getList = async () => {
    dispatch(getLongStoryList(params))
  }
  const onConfirm = async (data: Model.Sprint.longStroyItem) => {
    console.log(data)
    const params = {
      projectId: detail.projectId,
      sprintId: detail.id,
      type: 'parent',
      targetId: [data.id],
      parentId: detail.parentId,
    }
    // hasLongStroy 为true可以添加长故事
    const hasLongStroy =
      detail.level_tree?.length === 0 ||
      (detail.level_tree?.length &&
        detail.level_tree.every(
          (item: { work_type: any }) => item.work_type !== 3,
        ))
    if (!hasLongStroy) {
      delete params.parentId
    }
    const methods = hasLongStroy ? addInfoAffairs : updateInfoAffairs
    try {
      await methods(params)
    } catch (error) {
      // error
    }
  }
  const deleteInfoAffairsClick = async () => {
    if (!detail.parentId) {
      return
    }
    const params = {
      projectId: detail.projectId,
      sprintId: detail.id,
      type: 'parent',
      targetId: detail.parentId,
    }
    try {
      await deleteInfoAffairs(params)
    } catch (error) {
      // error
    }
  }
  useEffect(() => {
    setLoading(true)
    getList()
  }, [params])
  useEffect(() => {
    if (!longStoryList) {
      return
    }
    setLoading(false)
    setList(longStoryList.list)
  }, [longStoryList])
  return (
    <Wrap>
      <SearchBox>
        <InputSearch
          leftIcon
          placeholder="输入长故事标题或编号"
          onChangeSearch={e => {
            console.log(e)
            setParams((p: API.Sprint.getLongStoryList.Params) => {
              let { search } = { ...p }
              search = { ...search, keyword: e }
              return { ...p, search }
            })
          }}
        ></InputSearch>
      </SearchBox>
      <ContentBox>
        <span className="title">全部长故事</span>
        <List
          itemLayout="horizontal"
          loading={loading}
          loadMore={
            <LoadMore onClick={onLoadMore}>
              {list.length === longStoryList.pager?.total
                ? '没有更多了'
                : '加载更多'}
            </LoadMore>
          }
          dataSource={list}
          renderItem={(item, index) => (
            <ContentItem key={index} onClick={() => onConfirm(item)}>
              <img src={item.category_attachment} alt="" />
              <span>{item.story_prefix_key}</span>
              <span>{item.name}</span>
            </ContentItem>
          )}
        ></List>
      </ContentBox>
      <CancelParentBox onClick={deleteInfoAffairsClick}>
        取消父项链接
      </CancelParentBox>
      <FooterBox>
        可见{list.length}个，共{longStoryList.pager?.total}个
      </FooterBox>
    </Wrap>
  )
}
export default LongStoryDropdown
