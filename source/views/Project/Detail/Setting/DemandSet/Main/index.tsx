/* eslint-disable no-undefined */
// 需求设置主页

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Button, Menu, Switch, Form, Select, message } from 'antd'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import { OmitText } from '@star-yun/ui'
import EditCategory from './components/EditCategory'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import MoreDropdown from '@/components/MoreDropdown'
import useSetTitle from '@/hooks/useSetTitle'
import { useSelector } from '@store/index'
import {
  changeCategoryStatus,
  changeStoryConfigCategory,
  deleteStoryConfigCategory,
  getWorkflowList,
  storyConfigCategoryList,
} from '@/services/project'

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

const CategoryCard = styled.div<{ isHover?: any }>(
  {
    width: 290,
    height: 110,
    borderRadius: 6,
    border: '1px solid #EBEDF0',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 0 4px 16px',
    margin: '24px 24px 0 0',
  },
  ({ isHover }) => ({
    '&:hover': {
      border: '1px solid transparent',
      boxShadow: '0px 4px 13px -2px rgba(0,0,0,0.08)',
      color: isHover ? '#2877ff!important' : '',
    },
  }),
)

const CategoryCardHead = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '.dropdownIcon': {
    visibility: 'visible',
  },
})

const DivWrap = styled.div({
  marginTop: 24,
  fontSize: 12,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  height: 70,
  '.set': {
    cursor: 'pointer',
    color: '#646566',
    lineHeight: '16px',
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
      lineHeight: '16px',
    },
  },
})

const CategoryName = styled.div<{ bgColor?: string; color?: string }>(
  {
    height: 22,
    display: 'flex',
    alignItems: 'center',
    borderRadius: '11px',
    padding: '0 8px',
    fontSize: 12,
    lineHeight: '22px',
    '::before': {
      content: "'#'",
    },
    '::after': {
      content: "'#'",
    },
  },
  ({ bgColor, color }) => ({
    background: bgColor,
    color,
  }),
)

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

const HasDemandText = styled.div({
  marginTop: 8,
  color: '#FF5C5E',
  fontWeight: 400,
  fontSize: 12,
})

interface MoreWrapProps {
  row: any
  onChange(row: any): void
  list?: any
  onUpdate(): void
}

const MoreWrap = (props: MoreWrapProps) => {
  const [t] = useTranslation()
  const [isMoreVisible, setIsMoreVisible] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [workList, setWorkList] = useState<any>({
    list: undefined,
  })
  const [form] = Form.useForm()
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
    let menuItems = [
      {
        key: '1',
        label: (
          <div onClick={() => onClickMenu('edit')}>{t('common.edit')}</div>
        ),
      },
      {
        key: '2',
        label: (
          <div onClick={() => onClickMenu('delete')}>{t('common.del')}</div>
        ),
      },
    ]
    if (
      props?.row.isCheck === 1 &&
      props?.list?.filter((i: any) => i.isCheck === 1)?.length === 1
    ) {
      menuItems = menuItems.filter((i: any) => i.key !== '2')
    }
    return <Menu items={menuItems} />
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteStoryConfigCategory({
        id: props.row.id,
        projectId: paramsData.id,
      })
      message.success(t('common.deleteSuccess'))
      props.onUpdate()
    } catch (error) {
      //
    }
  }

  const onCloseHasDelete = () => {
    setIsHasDelete(false)
    setTimeout(() => {
      form.resetFields()
      setDisable(true)
    }, 100)
  }

  const onConfirmHasDelete = async () => {
    await form.validateFields()
    const params = form.getFieldsValue()
    params.projectId = paramsData.id
    params.oldId = props.row.id
    try {
      await changeStoryConfigCategory(params)
      await onDeleteConfirm()
      onCloseHasDelete()
    } catch (error) {
      //
    }
  }

  const onChangeSelect = async (value: any) => {
    if (value) {
      const result = await getWorkflowList({
        projectId: paramsData.id,
        categoryId: value,
      })
      setWorkList(result)
      setDisable(false)
      form.setFieldsValue({
        statusId: '',
      })
    } else {
      form.resetFields()
      setDisable(true)
    }
  }

  return (
    <>
      <DeleteConfirm
        isVisible={isDelete}
        text={t('newlyAdd.confirmDelCategory')}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />

      {isHasDelete && (
        <CommonModal
          isVisible={isHasDelete}
          onClose={onCloseHasDelete}
          title={t('newlyAdd.historyMove')}
          onConfirm={onConfirmHasDelete}
        >
          <div style={{ padding: '0 16px 0 2px' }}>
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
                    ?.filter(
                      (i: any) =>
                        i.id !== props?.row?.id &&
                        i?.statusCount &&
                        i.isCheck === 1,
                    )
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
                  options={workList?.list?.map((k: any) => ({
                    label: k.name,
                    value: k.statusId,
                  }))}
                />
              </Form.Item>
            </FormWrap>
          </div>
        </CommonModal>
      )}
      <MoreDropdown
        isMoreVisible={isMoreVisible}
        onChangeVisible={setIsMoreVisible}
        menu={menu}
        size={20}
        color="#969799"
      />
    </>
  )
}

const CardGroup = () => {
  const asyncSetTtile = useSetTitle()
  const [t] = useTranslation()
  const [isEdit, setIsEdit] = useState(false)
  const [editRow, setEditRow] = useState<any>({})
  const { projectInfo, colorList } = useSelector(
    (store: { project: any }) => store.project,
  )
  const [categoryList, setCategoryList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const navigate = useNavigate()
  const activeTabs = Number(paramsData.type) || 0
  asyncSetTtile(`${t('title.a8')}【${projectInfo.name}】`)

  const getList = async () => {
    const result = await storyConfigCategoryList({ projectId: paramsData.id })
    setCategoryList(result)
  }

  useEffect(() => {
    getList()
  }, [])

  const onChangeStatus = async (item: any, state: any) => {
    try {
      await changeCategoryStatus({
        projectId: paramsData.id,
        id: item.id,
        status: state,
      })
      message.success(t('common.statusSuccess'))
      getList()
    } catch (error) {
      //
    }
  }

  const onChange = (checked: boolean, row: any) => {
    const arr = categoryList?.list?.filter((i: any) => i.id !== row.id)
    if (!row.statusCount && checked) {
      message.warning(t('newlyAdd.hasFlowCanOpen'))
      return
    }

    if (!arr?.filter((i: any) => i.isCheck === 1)?.length && !checked) {
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
      <EditCategory
        isVisible={isEdit}
        onClose={onClose}
        item={editRow}
        onUpdate={getList}
      />
      <CardGroupWrap>
        {categoryList?.list?.map((item: any) => (
          <CategoryCard key={item.id}>
            <CategoryCardHead>
              <CategoryName
                bgColor={
                  colorList?.filter((k: any) => k.key === item.color)[0]
                    ?.bgColor
                }
                color={item.color}
              >
                <OmitText
                  width={150}
                  tipProps={{
                    getPopupContainer: node => node,
                  }}
                >
                  {item.name}
                </OmitText>
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
                  list={categoryList?.list}
                  onUpdate={getList}
                />
              </div>
            </CategoryCardHead>
            <DivWrap>
              <span className="set" onClick={() => onToWorkFlow(item)}>
                {t('newlyAdd.workflowSet')}
              </span>
              {item?.statusCount === 0 && (
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
          isHover
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
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )

  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0

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
          <CardGroup />
        </ModeWrap>
      </ContentWrap>
    </Wrap>
  )
}

export default DemandSet
