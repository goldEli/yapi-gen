import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import { Hehavior, MyInput } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import Filter from '@/views/Project/components/Filter'
import MainGrid from './MainGrid'
import MainTable from './MainTable'

const buttonCss = css``
const StyledUpload = styled.div``
const Content = styled.div({
  padding: 16,
  background: '#F5F7FA',
})

export default () => {
  const [state, setState] = useState()
  const [isGrid, setIsGrid] = useState(true)
  const [sort, setSort] = useState('name')
  const [activeType, setActiveType] = useState(0)
  const navigate = useNavigate()
  const [isHidden, setIsHidden] = useState(false)
  const onChangeType = (type: number) => {
    setActiveType(type)
    console.log('调用接口-企业和我参与的')
  }
  const onChangeOperation = (type: string, id: number) => {
    console.log(type)
  }
  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)
    console.log('调用接口-隐藏结束项目')
  }

  const onChangeSort = (value: string) => {
    setSort(value)
    console.log('调用接口-排序')
  }

  useEffect(() => {}, [])
  return (
    <div>
      <Hehavior>
        <MyInput
          suffix={
            <IconFont
              type="search"
              style={{ color: '#BBBDBF', fontSize: 20 }}
            />
          }
          placeholder="请输入昵称姓名邮箱电话"
          allowClear
        ></MyInput>
        <Filter
          total={31}
          sort={sort}
          isGrid={isGrid}
          activeType={activeType}
          onChangeSort={onChangeSort}
          onChangeFormat={() => setIsGrid(!isGrid)}
          onChangeHidden={onChangeHidden}
          onChangeType={onChangeType}
        ></Filter>
      </Hehavior>
      <Content>
        {isGrid ? (
          <MainGrid onChangeOperation={onChangeOperation} />
        ) : (
          <MainTable onChangeOperation={onChangeOperation} />
        )}
      </Content>
    </div>
  )
}
