import React, { useState, useEffect, useRef } from 'react'
import {
  Wrap,
  SearchBox,
  ContentBox,
  FooterBox,
  ContentItem,
  LoadMore,
  CancelParentBox,
  activity,
} from './style'
import InputSearch from '../InputSearch'
import { getLongStoryList } from '@store/sprint/sprint.thunk'
import { useDispatch, useSelector } from '@store/index'
import { List } from 'antd'
import { getMessage } from '../Message'
import {
  addInfoAffairs,
  deleteInfoAffairs,
  updateInfoAffairs,
} from '@/services/affairs'
interface IProps {
  detail: Model.Affairs.AffairsInfo
  onClick?(): void
}
const LongStoryDropdown = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { detail, onClick } = props
  const cacheProjectId = useRef(0)

  const { longStoryList } = useSelector(state => state.sprint)
  const [list, setList] = useState<Model.Sprint.longStroyItem[]>([])
  const [hasLongStroy, setHasLongStroy] = useState(false)
  const [params, setParams] = useState<API.Sprint.getLongStoryList.Params>({
    order: 'asc',
    orderkey: 'id',
    search: {
      all: 0,
      project_id: detail.projectId,
      keyword: '',
    },
    page: 1,
    pagesize: 10,
  })
  const onLoadMore = () => {
    console.log('加载更多')
    // debugger
    if (list.length === longStoryList.pager?.total) {
      return
    }
    setParams((p: API.Sprint.getLongStoryList.Params) => {
      let { search } = { ...p }
      search = { ...search }
      return { ...p, search, pagesize: p.pagesize + 10 }
    })
  }
  const getList = async () => {
    dispatch(getLongStoryList(params))
  }
  const onConfirm = async (data: Model.Sprint.longStroyItem) => {
    // console.log(data)

    let params: API.Affairs.AddInfoAffairs.Params = {
      projectId: detail.projectId,
      sprintId: detail.id,
      type: 'parent',
    }
    // hasLongStroy 为true新增
    if (hasLongStroy) {
      params = {
        ...params,
        targetId: [data.id],
      }
    } else {
      params = {
        ...params,
        parentId: data.id,
        name: detail.name,
      }
    }
    const methods = hasLongStroy ? addInfoAffairs : updateInfoAffairs
    try {
      await methods(params)
      getMessage({
        type: 'success',
        msg: hasLongStroy ? '添加成功' : '编辑成功',
      })

      onClick && onClick()
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
      getMessage({ type: 'success', msg: '取消关联成功' })
      onClick && onClick()
    } catch (error) {
      // error
    }
  }
  useEffect(() => {
    const hasLongStroy =
      detail.level_tree?.length === 0 &&
      (detail.work_type === 4 || detail.work_type === 5)
    setHasLongStroy(hasLongStroy)
    setLoading(true)
    // if (longStoryList?.list.length) {
    //   return
    // }
    getList()
  }, [params.search.project_id, params.pagesize])
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
            // console.log(e)
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
            <ContentItem
              key={index}
              onClick={() => onConfirm(item)}
              className={item.id === detail.parentId ? activity : ''}
            >
              <img src={item.category_attachment} alt="" />
              <span>{item.story_prefix_key}</span>
              <span>{item.name}</span>
            </ContentItem>
          )}
        ></List>
      </ContentBox>
      {hasLongStroy ? null : (
        <CancelParentBox onClick={deleteInfoAffairsClick}>
          取消父项链接
        </CancelParentBox>
      )}

      <FooterBox>
        可见{list.length}个，共{longStoryList.pager?.total}个
      </FooterBox>
    </Wrap>
  )
}
export default LongStoryDropdown
