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
import CommonInput from '../CommonInput'
import InputSearch from '../InputSearch'
import { getLongStoryList } from '@store/sprint/sprint.thunk'
import { useDispatch, useSelector } from '@store/index'
import { List } from 'antd'
const LongStoryDropdown = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { longStoryList } = useSelector(state => state.sprint)
  const [list, setList] = useState<Model.Sprint.longStroyItem[]>([])
  const [params, setParams] = useState<API.Sprint.getLongStoryList.Params>({
    order: 'asc',
    orderkey: 'id',
    search: {
      all: 0,
      project_id: 604,
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
            <ContentItem
              key={index}
              onClick={() => {
                console.log(item)
              }}
            >
              <img src={item.category_attachment} alt="" />
              <span>{item.story_prefix_key}</span>
              <span>{item.name}</span>
            </ContentItem>
          )}
        ></List>
      </ContentBox>
      <CancelParentBox>取消父项链接</CancelParentBox>
      <FooterBox>
        可见{list.length}个，共{longStoryList.pager?.total}个
      </FooterBox>
    </Wrap>
  )
}
export default LongStoryDropdown
