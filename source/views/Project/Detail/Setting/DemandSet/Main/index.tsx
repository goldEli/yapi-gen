/* eslint-disable complexity */
/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Switch, Form, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import { OmitText } from '@star-yun/ui'
import EditCategory from './components/EditCategory'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useModel } from '@/models'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'

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
  fontSize: 12,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  '.set': {
    cursor: 'pointer',
    color: '#646566',
    marginRight: 16,
    '&: hover': {
      color: '#2877ff',
    },
  },
  '.warning': {
    display: 'flex',
    alignItems: 'center',
    div: {
      color: '#FA9746',
      marginLeft: 6,
    },
  },
})

const CategoryName = styled.div<{ bgColor?: string; color?: string }>(
  {
    height: 22,
    borderRadius: '11px',
    padding: '0 8px',
    fontSize: 12,
    lineHeight: '22px',
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
  cursor: 'pointer',
  '&: hover': {
    color: '#2877ff',
  },
})

interface MoreWrapProps {
  row: any
  onChange(row: any): void
  list?: any
}

const MoreWrap = (props: MoreWrapProps) => {
  const [t] = useTranslation()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [form] = Form.useForm()
  const {
    getCategoryList,
    deleteStoryConfigCategory,
    changeStoryConfigCategory,
    getStatusList,
    statusWorkList,
  } = useModel('project')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [disable, setDisable] = useState(true)

  const onClickMenu = (type: string) => {
    setIsMoreVisible(false)
    if (type === 'delete' && props?.row?.hasDemand) {
      setIsHasDelete(true)
    } else if (type === 'delete' && !props?.row?.hasDemand) {
      setIsDelete(true)
    } else {
      props?.onChange(props?.row)
    }
  }

  const menu = () => {
    const menuItems = [
      {
        key: '1',
        label:
          <div onClick={() => onClickMenu('edit')}>{t('common.edit')}</div>
        ,
      },
      {
        key: '2',
        label:
          <div onClick={() => onClickMenu('delete')}>{t('common.del')}</div>
        ,
      },
    ]
    return <Menu items={menuItems} />
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteStoryConfigCategory({
        id: props.row.id,
        projectId: paramsData.id,
      })
      message.success(t('common.deleteSuccess'))
      getCategoryList({ projectId: paramsData.id })
    } catch (error) {

      //
    }
  }

  const onCloseHasDelete = () => {
    setIsHasDelete(false)
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  const onConfirmHasDelete = async () => {
    await form.validateFields()
    const params = form.getFieldsValue()
    params.projectId = paramsData.id
    params.oldId = props.row.id
    try {
      await changeStoryConfigCategory(params)
      message.success(t('newlyAdd.dateMoveSuccess'))
      onCloseHasDelete()
    } catch (error) {

      //
    }
  }

  const onChangeSelect = async (value: any) => {
    if (value) {
      await getStatusList({
        projectId: paramsData.id,
        categoryId: value,
        isSelect: true,
      })
      setDisable(false)
    } else {
      form.resetFields()
      setDisable(true)
    }
  }

  return (
    <>
      {isDelete && (
        <DeleteConfirm
          isVisible={isDelete}
          text={t('newlyAdd.confirmDelCategory')}
          onChangeVisible={() => setIsDelete(!isDelete)}
          onConfirm={onDeleteConfirm}
        />
      )}

      {isHasDelete && (
        <CommonModal
          isVisible={isHasDelete}
          onClose={onCloseHasDelete}
          title={t('newlyAdd.historyMove')}
          onConfirm={onConfirmHasDelete}
        >
          <div style={{ paddingRight: 20 }}>
            <HasDemandText>
              {t('newlyAdd.hasMoveType', { hasDemand: props?.row?.hasDemand })}
            </HasDemandText>
            <FormWrap form={form} layout="vertical">
              <Form.Item
                label={t('newlyAdd.afterCategory')}
                name="newId"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  placeholder={t('common.pleaseSelect')}
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                  onChange={onChangeSelect}
                  options={props?.list
                    ?.filter((i: any) => i.id !== props?.row?.id)
                    ?.map((k: any) => ({ label: k.name, value: k.id }))}
                />
              </Form.Item>
              <Form.Item
                label={t('newlyAdd.afterStatus')}
                name="statusId"
                rules={[{ required: true, message: '' }]}
              >
                <Select
                  placeholder={t('common.pleaseSelect')}
                  disabled={disable}
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                  options={statusWorkList?.list?.map((k: any) => ({
                    label: k.name,
                    value: k.id,
                  }))}
                />
              </Form.Item>
            </FormWrap>
          </div>
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
  list: any[]
}

const CardGroup = (props: CardGroupProps) => {
  const [t] = useTranslation()
  const [isEdit, setIsEdit] = useState(false)
  const [editRow, setEditRow] = useState<any>({})
  const { colorList, changeCategoryStatus, getCategoryList, projectInfo }
    = useModel('project')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const navigate = useNavigate()
  const activeTabs = Number(paramsData.type) || 0

  const onChangeStatus = async (item: any, state: any) => {
    try {
      await changeCategoryStatus({
        projectId: paramsData.id,
        id: item.id,
        status: state,
      })
      message.success(t('common.statusSuccess'))
      getCategoryList({ projectId: paramsData.id })
    } catch (error) {

      //
    }
  }

  const onChange = (checked: boolean, row: any) => {
    const arr = props?.list?.filter(i => i.id !== row.id)
    if (!row.statusCount && checked) {
      message.warning(t('newlyAdd.hasFlowCanOpen'))
      return
    }

    if (!arr?.filter(i => i.isCheck === 1)?.length && !checked) {
      message.warning(t('newlyAdd.onlyCategoryOpen'))
      return
    }
    onChangeStatus(row, checked ? 1 : 2)
  }

  const onClose = () => {
    setIsEdit(false)
    setTimeout(() => {
      setEditRow({})
    }, 50)
  }

  const onChangeMore = (row: any) => {
    setEditRow(row)
    setIsEdit(true)
  }

  const onToWorkFlow = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({
        type: activeTabs,
        id: projectInfo.id,
        pageIdx: 'work',
        categoryItem: item,
      }),
    )
    navigate(`/Detail/Set?data=${params}`)
  }

  return (
    <>
      <EditCategory isVisible={isEdit} onClose={onClose} item={editRow} />
      <CardGroupWrap>
        {props?.list?.map((item: any) => (
          <CategoryCard key={item.id}>
            <CategoryCardHead>
              <CategoryName
                bgColor={
                  colorList?.filter(k => k.key === item.color)[0]?.bgColor
                }
                color={item.color}
              >
                <OmitText width={150}>{item.name}</OmitText>
              </CategoryName>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Switch
                  checked={item.isCheck === 1}
                  onChange={checked => onChange(checked, item)}
                  disabled={!item?.statusCount}
                />
                <MoreWrap
                  onChange={row => onChangeMore(row)}
                  row={item}
                  list={props?.list}
                />
              </div>
            </CategoryCardHead>
            <DivWrap>
              <span className="set" onClick={() => onToWorkFlow(item)}>
                {t('newlyAdd.workflowSet')}
              </span>
              {item?.statusCount ? null : (
                <div className="warning">
                  <IconFont
                    type="fillwarning"
                    style={{ fontSize: 14, color: '#FA9746' }}
                  />
                  <div>{t('newlyAdd.notFinishFlow')}</div>
                </div>
              )}
            </DivWrap>
          </CategoryCard>
        ))}
        <CategoryCard
          onClick={() => setIsEdit(true)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: '#646566',
            cursor: 'pointer',
          }}
        >
          <IconFont type="plus" style={{ fontSize: 20 }} />
          <div style={{ fontSize: 14, fontWeight: 400, marginTop: 8 }}>
            {t('newlyAdd.createCategory')}
          </div>
        </CategoryCard>
      </CardGroupWrap>
    </>
  )
}

const DemandSet = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo, getCategoryList, categoryList } = useModel('project')
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0

  const getList = () => {
    getCategoryList({ projectId: paramsData.id })
  }

  useEffect(() => {
    getList()
  }, [])

  const onToPage = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: activeTabs,
        id: projectInfo.id,
        pageIdx: 'field',
      }),
    )
    navigate(`/Detail/Set?data=${params}`)
  }

  return (
    <Wrap>
      <SetTitleWrap>{t('newlyAdd.demandSet')}</SetTitleWrap>
      <ContentWrap>
        <ModeWrap style={{ marginBottom: 72 }}>
          <LabelWrap style={{ marginBottom: 24 }}>
            <div />
            <span>{t('newlyAdd.demandFieldsSet')}</span>
          </LabelWrap>
          <Button
            type="primary"
            icon={<IconFont type="settings" />}
            onClick={onToPage}
          >
            {t('newlyAdd.fieldsSet')}
          </Button>
        </ModeWrap>
        <ModeWrap>
          <LabelWrap>
            <div />
            <span>{t('newlyAdd.demandCategorySet')}</span>
          </LabelWrap>
          <CardGroup list={categoryList?.list} />
        </ModeWrap>
      </ContentWrap>
    </Wrap>
  )
}

export default DemandSet
