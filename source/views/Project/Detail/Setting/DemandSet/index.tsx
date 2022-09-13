/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Switch, Form, Select } from 'antd'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import EditCategory from './components/EditCategory'
import { OmitText } from '@star-yun/ui'

const Wrap = styled.div({
  padding: 16,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const SetTitleWrap = styled.div({
  marginBottom: 16,
  fontSize: 12,
  fontWeight: 500,
  color: '#323233',
})

const ContentWrap = styled.div({
  borderRadius: 6,
  background: 'white',
  width: '100%',
  height: 'calc(100% - 35px)',
  padding: 24,
  overflow: 'auto',
})

const ModeWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: 'fit-content',
})

const LabelWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  span: {
    marginLeft: 8,
    fontWeight: 500,
    fontSize: 14,
    color: '#323233',
  },
  div: {
    height: 16,
    width: 3,
    background: '#2877ff',
  },
})

const CardGroupWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
})

const CategoryCard = styled.div({
  width: 290,
  height: 106,
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
  margin: '24px 24px 0 0',
  cursor: 'pointer',
  '&:hover': {
    border: '1px solid transparent',
    boxShadow: '0px 4px 13px -2px rgba(0,0,0,0.08)',
  },
})

const CategoryCardHead = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const DivWrap = styled.div({
  marginTop: 32,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 400,
  color: '#646566',
  '&: hover': {
    color: '#2877ff',
  },
})

const CategoryName = styled.div<{ bgColor?: string; color?: string }>(
  {
    height: 22,
    borderRadius: '11px',
    padding: '0 8px',
    fontSize: 12,
  },
  ({ bgColor, color }) => ({
    background: bgColor,
    color,
  }),
)

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
  },
})

const HasDemandText = styled.div({
  marginTop: 8,
  color: '#FF5C5E',
  fontWeight: 400,
  fontSize: 12,
})

const IconFontWrap = styled(IconFont)({
  fontSize: 20,
  color: '#969799',
  marginLeft: 16,
  '&: hover': {
    color: '#2877ff',
  },
})

const SetTitle = () => {
  return <SetTitleWrap>需求设置</SetTitleWrap>
}

interface MoreWrapProps {
  row: any
  onChange(): void
}

const MoreWrap = (props: MoreWrapProps) => {
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [form] = Form.useForm()
  const [categoryList, setCategoryList] = useState<any>([])
  const [statusList, setStatusList] = useState<any>([])

  const onClickMenu = (type: string) => {
    setIsMoreVisible(false)
    if (type === 'delete' && props?.row?.hasDemand) {
      setIsHasDelete(true)
    } else if (type === 'delete' && !props?.row?.hasDemand) {
      setIsDelete(true)
    } else {
      props?.onChange()
    }
  }

  const menu = () => {
    const menuItems = [
      {
        key: '1',
        label: <div onClick={() => onClickMenu('edit')}>编辑</div>,
      },
      {
        key: '2',
        label: <div onClick={() => onClickMenu('delete')}>删除</div>,
      },
    ]
    return <Menu items={menuItems} />
  }

  const onDeleteConfirm = async () => {

    // console.log('删除id', props.row.id)
  }

  const onCloseHasDelete = () => {
    setIsHasDelete(false)
  }

  const onConfirmHasDelete = async () => {

    //
  }

  return (
    <>
      {isDelete && (
        <DeleteConfirm
          isVisible={isDelete}
          text="确认删除该需求类型？"
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
      )}

      {isHasDelete && (
        <CommonModal
          isVisible={isHasDelete}
          onClose={onCloseHasDelete}
          title="历史数据迁移"
          onConfirm={onConfirmHasDelete}
        >
          <HasDemandText>{`检测到该类型下有${props?.row?.hasDemand}条需求，请把历史需求变更为其他类型`}</HasDemandText>
          <FormWrap form={form} layout="vertical">
            <Form.Item label="变更后需求类别">
              <Select
                placeholder="请选择"
                showArrow
                showSearch
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
                options={categoryList}
              />
            </Form.Item>
            <Form.Item label="变更后需求状态">
              <Select
                placeholder="请选择"
                showArrow
                showSearch
                getPopupContainer={node => node}
                allowClear
                optionFilterProp="label"
                options={statusList}
              />
            </Form.Item>
          </FormWrap>
        </CommonModal>
      )}

      <Dropdown
        key={isMoreVisible.toString()}
        visible={isMoreVisible}
        onVisibleChange={visible => setIsMoreVisible(visible)}
        trigger={['hover']}
        overlay={menu}
        placement="bottomLeft"
        getPopupContainer={node => node}
      >
        <IconFontWrap type="more" />
      </Dropdown>
    </>
  )
}

interface CardGroupProps {
  list: []
}

const CardGroup = (props: CardGroupProps) => {
  const [isEdit, setIsEdit] = useState(false)

  const onChange = (checked: boolean, row: any) => {

    // console.log(`switch to ${checked}`, row)
  }

  const onConfirm = async () => {

    // 调用编辑接口
  }

  return (
    <>
      <EditCategory
        isVisible={isEdit}
        onClose={() => setIsEdit(false)}
        onConfirm={onConfirm}
      />
      <CardGroupWrap>
        {props?.list.map((item: any) => (
          <CategoryCard key={item.id}>
            <CategoryCardHead>
              <CategoryName bgColor={item.bgColor} color={item.color}>
                <OmitText width={150}>{item.name}</OmitText>
              </CategoryName>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  defaultChecked={item.isDisable}
                  onChange={checked => onChange(checked, item)}
                />
                <MoreWrap onChange={() => setIsEdit(true)} row={item} />
              </div>
            </CategoryCardHead>
            <DivWrap>工作流设置</DivWrap>
          </CategoryCard>
        ))}
        <CategoryCard
          onClick={() => setIsEdit(true)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: '#646566',
          }}
        >
          <IconFont type="plus" style={{ fontSize: 20 }} />
          <div style={{ fontSize: 14, fontWeight: 400, marginTop: 8 }}>
            创建需求类别
          </div>
        </CategoryCard>
      </CardGroupWrap>
    </>
  )
}

const DemandSet = () => {
  const [cardList, setCardList] = useState<any>([])

  useEffect(() => {
    setCardList([
      {
        name: '软件需求',
        color: '#43BA9A',
        bgColor: '#EDF7F4',
        isDisable: true,
        id: 1,
        hasDemand: 2,
      },
      {
        name: '开发需求',
        color: '#43BA9A',
        bgColor: '#EDF7F4',
        isDisable: true,
        id: 2,
        hasDemand: 2,
      },
      {
        name: '美术组的修改图片需求美术组的修改图片需求',
        color: '#FA9746',
        bgColor: '#FCF3EB',
        isDisable: false,
        id: 3,
        hasDemand: 0,
      },
      {
        name: '软件需求',
        color: '#43BA9A',
        bgColor: '#EDF7F4',
        isDisable: true,
        id: 4,
        hasDemand: 2,
      },
    ])
  }, [])

  return (
    <Wrap>
      <SetTitle />
      <ContentWrap>
        <ModeWrap style={{ marginBottom: 72 }}>
          <LabelWrap style={{ marginBottom: 24 }}>
            <div />
            <span>需求字段设置</span>
          </LabelWrap>
          <Button type="primary" icon={<IconFont type="settings" />}>
            字段设置
          </Button>
        </ModeWrap>
        <ModeWrap>
          <LabelWrap>
            <div />
            <span>需求类别设置</span>
          </LabelWrap>
          <CardGroup list={cardList} />
        </ModeWrap>
      </ContentWrap>
    </Wrap>
  )
}

export default DemandSet
