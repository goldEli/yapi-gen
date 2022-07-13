import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'
import Filter from './components/Filter'
import MainGrid from './components/MainGrid'
import MainTable from './components/MainTable'
import PosterComponent from './components/PosterComponent'
import { useState } from 'react'
import { Modal, Form, Input, Select, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'

const SearchWrap = styled.div({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 24,
})

const Content = styled.div({
  padding: 16,
  background: '#F5F7FA',
})

const Footer = styled(Space)({
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

export default () => {
  const [isGrid, setIsGrid] = useState(true)
  const [sort, setSort] = useState('name')
  const [isHidden, setIsHidden] = useState(false)
  const [activeType, setActiveType] = useState(0)
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const onChangeOperation = (type: string, id: number) => {
    console.log(type)
  }
  const onChangeType = (type: number) => {
    setActiveType(type)
    console.log('调用接口-企业和我参与的')
  }

  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)
    console.log('调用接口-隐藏结束项目')
  }

  const onChangeSort = (value: string) => {
    setSort(value)
    console.log('调用接口-排序')
  }

  const onChangeSearch = (value: string) => {
    console.log(value, '搜索任务或项目')
  }

  return (
    <div>
      <Modal
        title="创建项目"
        visible={visible}
        footer={false}
        onCancel={() => setVisible(false)}
        bodyStyle={{ padding: '16px 24px 0' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="项目封面" required>
            <PosterComponent />
          </Form.Item>
          <Form.Item label="项目名称" required>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item label="项目描述">
            <Input.TextArea
              placeholder="请输入项目描述"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item label="公开/私有">
            <Select placeholder="请选择">
              <Select.Option>私有项目</Select.Option>
              <Select.Option>企业公开</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        <Footer size={16}>
          <Button>取消</Button>
          <Button type="primary">确认</Button>
        </Footer>
      </Modal>
      <SearchWrap>
        <SearchComponent
          placeholder="搜索项目或任务"
          text="创建项目"
          onChangeSearch={onChangeSearch}
          onChangeVisible={() => setVisible(true)}
        />
      </SearchWrap>
      <Filter
        total={31}
        sort={sort}
        isGrid={isGrid}
        activeType={activeType}
        onChangeSort={onChangeSort}
        onChangeFormat={() => setIsGrid(!isGrid)}
        onChangeHidden={onChangeHidden}
        onChangeType={onChangeType}
      />
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
