// 需求设置-添加工作流弹窗

/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import CommonModal from '@/components/CommonModal'
import { Form, Input, message, Space, Spin, Table, Select } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { CategoryWrap, HiddenText } from '@/components/StyleCommon'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import NoData from '@/components/NoData'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import {
  addStoryConfigStatus,
  addStoryConfigWorkflow,
  deleteStoryConfigStatus,
  storyConfigStatusList,
  updateStoryConfigStatus,
} from '@/services/project'
import { useSelector } from '@store/index'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import StateTag from '@/components/StateTag'
import CustomSelect from '@/components/CustomSelect'
import CommonButton from '@/components/CommonButton'
import { getMessage } from '@/components/Message'

const TableWrap = styled.div({
  width: '780px',
  padding: '0',
  overflowY: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflowX: 'hidden',
  '.ant-table-content': {
    maxHeight: '40vh',
  },
})

const TableWrapBox = styled(Table)({
  padding: '0 24px',
  '.ant-checkbox-wrapper': {
    marginLeft: 8,
  },
  '.ant-table-cell': {
    position: 'relative',
  },
})

const TableTitle = styled.div({
  marginTop: 8,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  color: 'var( --neutral-n3)',
  fontSize: 14,
  fontFamily: 'SiYuanMedium',
})

const AddWrapBox = styled.div({
  padding: '0 24px',
  height: 32,
  lineHeight: '32px',
  color: 'var(--primary-d2)',
  width: 'fit-content',
  margin: '10px 0',
  cursor: 'pointer',
})

const TextWrap = styled.div({
  fontSize: 14,
  fontWeight: 400,
  cursor: 'pointer',
})

const HasDemandText = styled.div({
  marginTop: 8,
  color: 'var(--function-error)',
  fontWeight: 400,
  fontSize: 12,
})

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})
interface Props {
  isVisible: boolean
  onUpdate(): void
  onClose(): void
}

const AddWrap = () => {
  const [t] = useTranslation()
  return (
    <AddWrapBox>
      <CommonButton type="primaryText">
        <IconFont type="plus" /> {t('newlyAdd.addStatus')}
      </CommonButton>
    </AddWrapBox>
  )
}

interface AddActiveWrapProps {
  onClose?(): void
  onConfirm?(obj: any): void
  hasMargin?: boolean
  item?: any
}

const AddActiveWrap = (props: AddActiveWrapProps) => {
  const [t] = useTranslation()
  const [value, setValue] = useState<any>('')
  const [errorState, setErrorState] = useState(false)
  const [normalColor, setNormalColor] = useState<any>('var(--primary-d2)')
  const inputRefDom = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props?.item?.id) {
      setValue(props?.item.name)
      setNormalColor(props?.item.color)
      setTimeout(() => {
        inputRefDom.current?.focus()
      }, 100)
    }
  }, [props?.item])

  const onReset = () => {
    props?.onClose?.()
    setValue('')
    setNormalColor('var(--primary-d2)')
    setErrorState(false)
  }

  const onClose = () => {
    onReset()
  }

  const onConfirm = () => {
    if (!value) {
      setErrorState(true)
      return
    }
    if (!normalColor) {
      getMessage({
        msg: t('newlyAdd.pleaseStatusChooseColor'),
        type: 'warning',
      })
      return
    }
    props?.onConfirm?.({ name: value, color: normalColor })
    onReset()
  }

  const onChangeValue = (val: string | undefined) => {
    setNormalColor(val)
  }

  const onChangeInpValue = (val: any) => {
    setValue(val)
    setErrorState(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: props?.hasMargin ? '10px 0' : '0',
      }}
    >
      <Input
        ref={inputRefDom as any}
        style={{
          width: 196,
          margin: props?.hasMargin ? '0 24px' : '0 16px 0 0',
          border: errorState
            ? '1px solid var(--function-error)'
            : '1px solid var(--neutral-n6-d1)',
        }}
        placeholder={t('newlyAdd.pleaseStatusName')}
        allowClear
        onChange={e => onChangeInpValue(e.target.value)}
        value={value}
        maxLength={10}
        autoFocus
      />
      <>
        <TextWrap
          style={{ margin: '0 16px 0 24px', color: 'var(--primary-d2)' }}
          onClick={onConfirm}
        >
          {t('container.finish')}
        </TextWrap>
        <TextWrap style={{ color: 'var(--neutral-n2)' }} onClick={onClose}>
          {t('common.cancel')}
        </TextWrap>
      </>
    </div>
  )
}

interface ChangeTableNameProps {
  record: any
  text: string
  operationObj: any
  onClose?(): void
  onConfirm?(obj: any): void
}

const ChangeTableName = (props: ChangeTableNameProps) => {
  return (
    <div>
      {props?.operationObj?.id === props?.record?.id ? (
        <div style={{ position: 'absolute', zIndex: 2, top: 10, width: 680 }}>
          <AddActiveWrap
            onClose={props?.onClose}
            onConfirm={props?.onConfirm}
            item={props?.operationObj}
          />
        </div>
      ) : null}
      <StateTag name={props?.text} />
    </div>
  )
}

const AddWorkflow = (props: Props) => {
  const [t] = useTranslation()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [isAdd, setIsAdd] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [operationDelObj, setOperationDelObj] = useState<any>({})
  const [statusWorkList, setStatusWorkList] = useState<any>([])
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData
  const [isSpinning, setIsSpinning] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [form] = Form.useForm()
  const { colorList } = useSelector(store => store.project)

  const getList = async () => {
    setIsSpinning(true)
    const result = await storyConfigStatusList({
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
      orderKey: 'id',
      order: 'asc',
    })
    setStatusWorkList(result)
    const arr = result?.list?.filter((i: any) => i.isCheck)
    setSelectedRowKeys(arr?.map((k: any) => k.id))
    setIsSpinning(false)
  }

  useEffect(() => {
    if (props?.isVisible) {
      getList()
    }
  }, [props?.isVisible])

  const onConfirm = async () => {
    if (!selectedRowKeys?.length) {
      getMessage({ msg: t('newlyAdd.onlyChooseStatus'), type: 'warning' })
      return
    }
    const obj = {
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
      ids: selectedRowKeys,
    }
    try {
      await addStoryConfigWorkflow(obj)
      getMessage({ msg: t('common.addSuccess') as string, type: 'success' })
      setSelectedRowKeys([])
      props?.onClose()
      props?.onUpdate()
    } catch (error) {
      //
    }
  }

  const onClose = () => {
    props?.onClose()
    setIsAdd(false)
    setSelectedRowKeys([])
  }

  const onAddConfirm = async (obj: any) => {
    obj.projectId = paramsData.id
    obj.categoryId = categoryItem?.id
    try {
      await addStoryConfigStatus(obj)
      getMessage({ msg: t('common.addSuccess') as string, type: 'success' })
      getList()
    } catch (error) {
      //
    }
  }

  const onChangeName = async (obj: any) => {
    obj.projectId = paramsData.id
    obj.id = operationObj.id
    try {
      await updateStoryConfigStatus(obj)
      getMessage({ msg: t('common.editSuccess') as string, type: 'success' })
      setOperationObj({})
      getList()
      props?.onUpdate()
    } catch (error) {
      //
    }
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const onAddDel = async (row: any) => {
    setOperationDelObj(row)
    setTimeout(() => {
      if (row.deleteData?.story_count) {
        setIsHasDelete(true)
      } else {
        setIsDelVisible(true)
      }
    }, 100)
  }

  const onCloseDel = () => {
    setOperationDelObj({})
    setIsDelVisible(false)
  }

  const onDeleteConfirm = async () => {
    const obj = {
      projectId: paramsData.id,
      id: operationDelObj?.id,
    }
    try {
      await deleteStoryConfigStatus(obj)
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      getList()
      onCloseDel()
      props?.onUpdate()
    } catch (error) {
      //
    }
  }

  const onCloseHasDelete = () => {
    setOperationDelObj({})
    setIsHasDelete(false)
    setTimeout(() => {
      form.resetFields()
    }, 100)
  }

  const onConfirmHasDelete = async () => {
    const arr = Object.keys(form.getFieldsValue())?.map((i: any) => ({
      category_id: Number(String(i).split('_')[0]),
      status_id: form.getFieldValue(i),
    }))
    const obj = {
      projectId: paramsData.id,
      id: operationDelObj?.id,
      list: arr,
    }
    try {
      await deleteStoryConfigStatus(obj)
      getMessage({ msg: t('common.deleteSuccess') as string, type: 'success' })
      getList()
      onCloseHasDelete()
      props?.onUpdate()
    } catch (error) {
      //
    }
  }

  const onAddEdit = (row: any) => {
    setOperationObj(row)
  }

  const columns = [
    {
      width: 244,
      title: '',
      dataIndex: 'name',
      render: (text: any, record: any) => (
        <ChangeTableName
          record={record}
          text={text}
          operationObj={operationObj}
          onClose={() => setOperationObj({})}
          onConfirm={obj => onChangeName(obj)}
        />
      ),
    },
    {
      width: 314,
      title: '',
      dataIndex: 'categoryName',
      render: (text: any, record: any) => (
        <>
          {operationObj?.id === record.id ? (
            ''
          ) : (
            <HiddenText>
              <OmitText
                width={220}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text || '--'}
              </OmitText>
            </HiddenText>
          )}
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <>
          {operationObj?.id === record.id ? (
            ''
          ) : (
            <Space size={16}>
              <span
                style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                onClick={() => onAddEdit(record)}
              >
                {t('common.edit')}
              </span>
              <span
                style={{ color: 'var(--primary-d2)', cursor: 'pointer' }}
                onClick={() => onAddDel(record)}
              >
                {t('common.del')}
              </span>
            </Space>
          )}
        </>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: any) => ({
      disabled: record?.deleteData?.story_count && record.isCheck,
    }),
  }

  return (
    <>
      <DeleteConfirm
        text={t('newlyAdd.confirmDelStatus')}
        isVisible={isDelVisible}
        onChangeVisible={onCloseDel}
        onConfirm={onDeleteConfirm}
      />
      <CommonModal
        isVisible={isHasDelete}
        onClose={onCloseHasDelete}
        title={t('newlyAdd.newStatus')}
        onConfirm={onConfirmHasDelete}
      >
        <div style={{ paddingRight: 16 }}>
          <HasDemandText>
            {t('newlyAdd.changeNewStatus', {
              count: operationDelObj?.deleteData?.story_count,
              name: operationDelObj?.name,
            })}
          </HasDemandText>
          <FormWrap form={form} layout="vertical">
            {operationDelObj?.deleteData?.list?.map((i: any) => (
              <Form.Item
                name={`${i.category_id}_name`}
                key={i.category_id}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryWrap
                      style={{ marginRight: 8, marginLeft: 0 }}
                      color={i.category_color}
                      bgColor={''}
                    >
                      {i.category_name}
                    </CategoryWrap>
                    {t('newlyAdd.appointStatus')}
                  </div>
                }
              >
                <CustomSelect
                  placeholder={t('common.pleaseSelect')}
                  showArrow
                  showSearch
                  getPopupContainer={(node: any) => node}
                  allowClear
                  optionFilterProp="label"
                  options={i.status?.map((k: any) => ({
                    label: k.content,
                    value: k.id,
                  }))}
                />
              </Form.Item>
            ))}
          </FormWrap>
        </div>
      </CommonModal>
      <CommonModal
        isVisible={props.isVisible}
        title={t('newlyAdd.addStatus')}
        onClose={onClose}
        onConfirm={onConfirm}
        width={784}
        bodyStyle={{ maxHeight: '80vh' }}
      >
        <div style={{ paddingRight: 20 }}>
          <TableTitle>
            <span style={{ width: '40%' }}>{t('newlyAdd.statusName')}</span>
            <span style={{ width: '45%' }}>{t('newlyAdd.demandCategory')}</span>
            <span style={{ width: '15%' }}>{t('newlyAdd.operation')}</span>
          </TableTitle>
        </div>
        {isAdd ? (
          <AddActiveWrap
            hasMargin
            onClose={() => setIsAdd(false)}
            onConfirm={obj => onAddConfirm(obj)}
          />
        ) : null}
        {!isAdd && (
          <div onClick={() => setIsAdd(true)}>
            <AddWrap />
          </div>
        )}
        <TableWrap>
          <Spin indicator={<NewLoadingTransition />} spinning={isSpinning}>
            {!!statusWorkList?.list &&
              (statusWorkList?.list?.length > 0 ? (
                <TableWrapBox
                  rowSelection={rowSelection}
                  dataSource={statusWorkList?.list}
                  columns={columns}
                  showHeader={false}
                  pagination={false}
                  rowKey="id"
                />
              ) : (
                <NoData />
              ))}
          </Spin>
        </TableWrap>
      </CommonModal>
    </>
  )
}

export default AddWorkflow
