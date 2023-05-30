import React, { useState } from 'react'
import {
  Wrap,
  SearchBox,
  ContentBox,
  FooterBox,
  ContentItem,
  LoadMore,
} from './style'
import CommonInput from '../CommonInput'
import { List } from 'antd'
const LongStoryDropdown = () => {
  const [loading, setLoading] = useState(false)
  const onLoadMore = () => {
    console.log('加载更多')
  }
  const list = Array(10).fill(0)
  return (
    <Wrap>
      <SearchBox>
        <CommonInput
          placeholder="输入长故事标题或编号"
          bgColor="#fff"
          width="100%"
          onChangeSearch={value => {
            console.log(value)
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
                console.log(111)
              }}
            >
              <img
                src="https://dev.staryuntech.com/dev-agile/attachment/category_icon/security.png"
                alt=""
              />
              <span>DXKJ-256</span>
              <span>事务名称事务名称事务名称</span>
            </ContentItem>
          )}
        ></List>
      </ContentBox>
      <FooterBox>可见10个，共100个</FooterBox>
    </Wrap>
  )
}
export default LongStoryDropdown
