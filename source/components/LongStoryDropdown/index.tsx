import React, { useState, useEffect } from 'react'
import {
  Wrap,
  SearchBox,
  ContentBox,
  FooterBox,
  ContentItem,
  LoadMore,
} from './style'
import CommonInput from '../CommonInput'
import { getLongStoryList } from '@store/sprint/sprint.thunk'
import { useDispatch, useSelector } from '@store/index'
import { List } from 'antd'
const LongStoryDropdown = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { longStoryList } = useSelector(state => state.sprint)
  const [list, setList] = useState<Model.Sprint.LongStory[]>([])
  const [params, setParams] = useState<API.Sprint.getLongStoryList.Params>({
    order: 'asc',
    orderkey: 'id',
    search: {
      all: 1,
      sprint_status: 0,
      project_id: 604,
    },
    is_long_story: 1,
  })
  const onLoadMore = () => {
    console.log('加载更多')
  }
  const getList = async () => {
    dispatch(getLongStoryList(params))
  }
  useEffect(() => {
    getList()
  }, [params])
  useEffect(() => {
    if (!longStoryList) {
      return
    }
    setList(longStoryList)
  }, [longStoryList])
  return (
    <Wrap>
      <SearchBox>
        <CommonInput
          placeholder="输入长故事标题或编号"
          bgColor="#fff"
          width="100%"
          onChangeSearch={value => {
            setParams((p: API.Sprint.getLongStoryList.Params) => {
              let { search } = { ...p }
              search = { ...search, sprint_status: 1 }
              return { ...p, search }
            })
          }}
        ></CommonInput>
      </SearchBox>
      <ContentBox>
        <span className="title">全部长故事</span>
        <List
          itemLayout="horizontal"
          loadMore={<LoadMore onClick={onLoadMore}>加载更多</LoadMore>}
          dataSource={list}
          renderItem={(item, index) => (
            <ContentItem
              key={index}
              onClick={() => {
                console.log(item)
              }}
            >
              <img
                src="https://dev.staryuntech.com/dev-agile/attachment/category_icon/security.png"
                alt=""
              />
              <span>DXKJ-256</span>
              <span>{item.name}</span>
            </ContentItem>
          )}
        ></List>
      </ContentBox>
      <FooterBox>可见10个，共100个</FooterBox>
    </Wrap>
  )
}
export default LongStoryDropdown
