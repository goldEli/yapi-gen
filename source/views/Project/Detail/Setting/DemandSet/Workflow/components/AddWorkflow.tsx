/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import CommonModal from '@/components/CommonModal'
import { Form, Input, message, Space, Spin, Table, Select } from 'antd'
import ChooseColor from '../../components/ChooseColor'
import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { CategoryWrap, ViewWrap } from '@/components/StyleCommon'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import NoData from '@/components/NoData'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'

const TableWrap = styled.div({
  height: 400,
  overflowY: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const TableWrapBox = styled(Table)({
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
  padding: '0 16px',
  color: '#969799',
  fontSize: 14,
  fontWeight: 500,
  borderBottom: '1px solid #EBEDF0',
})

const AddWrapBox = styled.div({
  padding: '0 16px',
  height: 32,
  lineHeight: '32px',
  color: '#2877ff',
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
  color: '#FF5C5E',
  fontWeight: 400,
  fontSize: 12,
})

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
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
      <IconFont style={{ fontSize: 16, marginRight: 8 }} type="plus" />
      <span style={{ fontSize: 14 }}>{t('newlyAdd.addStatus')}</span>
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
  const [normalColor, setNormalColor] = useState<any>()

  useEffect(() => {
    if (props?.item?.id) {
      setValue(props?.item.name)
      setNormalColor(props?.item.color)
    }
  }, [props?.item])

  const onReset = () => {
    props?.onClose?.()
    setValue('')
    setNormalColor('')
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
      message.warning(t('newlyAdd.pleaseStatusChooseColor'))
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
        style={{
          width: 196,
          margin: props?.hasMargin ? '0 16px' : '0 16px 0 0',
          border: errorState ? '1px solid #FF5C5E' : '1px solid #EBEDF0',
        }}
        placeholder={t('newlyAdd.pleaseStatusName')}
        allowClear
        onChange={e => onChangeInpValue(e.target.value)}
        value={value}
        maxLength={10}
      />
      <ChooseColor
        color={normalColor}
        onChangeValue={val => onChangeValue(val)}
      />
      <TextWrap
        style={{ margin: '0 16px 0 24px', color: '#2877ff' }}
        onClick={onConfirm}
      >
        {t('container.finish')}
      </TextWrap>
      <TextWrap style={{ color: '#646566' }} onClick={onClose}>
        {t('common.cancel')}
      </TextWrap>
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
      <ViewWrap color={props?.record?.color}>{props?.text}</ViewWrap>
    </div>
  )
}

const AddWorkflow = (props: Props) => {
  const [t] = useTranslation()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [isAdd, setIsAdd] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [operationDelObj, setOperationDelObj] = useState<any>({})
  const {
    getStatusList,
    statusWorkList,
    addStoryConfigStatus,
    updateStoryConfigStatus,
    deleteStoryConfigStatus,
    colorList,
    addStoryConfigWorkflow,
  } = useModel('project')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData
  const [isSpinning, setIsSpinning] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const arr = statusWorkList?.list?.filter((i: any) => i.isCheck)
    setSelectedRowKeys(arr?.map((k: any) => k.id))
  }, [statusWorkList])

  const getList = async () => {
    setIsSpinning(true)
    await getStatusList({
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
    })
    setIsSpinning(false)
  }

  useEffect(() => {
    if (props?.isVisible) {
      getList()
    }
  }, [props?.isVisible])

  const onConfirm = async () => {
    const obj = {
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
      ids: selectedRowKeys,
    }
    try {
      await addStoryConfigWorkflow(obj)
      message.success(t('common.addSuccess'))
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
      message.success(t('common.addSuccess'))
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
      message.success(t('common.editSuccess'))
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
    if (row.deleteData?.story_count) {
      setIsHasDelete(true)
    } else {
      setIsDelVisible(true)
    }
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
      message.success(t('common.deleteSuccess'))
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
      message.success(t('common.deleteSuccess'))
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
          {operationObj?.id === record.id
            ? ''
            : <OmitText width={300}>{text || '--'}</OmitText>
          }
        </>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <>
          {operationObj?.id === record.id
            ? ''
            : (
                <Space size={16}>
                  <span
                    style={{ color: '#2877ff', cursor: 'pointer' }}
                    onClick={() => onAddEdit(record)}
                  >
                    {t('common.edit')}
                  </span>
                  <span
                    style={{ color: '#2877ff', cursor: 'pointer' }}
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
  }

  return (
    <>
      {isDelVisible && (
        <DeleteConfirm
          text={t('newlyAdd.confirmDelStatus')}
          isVisible={isDelVisible}
          onChangeVisible={onCloseDel}
          onConfirm={onDeleteConfirm}
        />
      )}
      {isHasDelete && (
        <CommonModal
          isVisible={isHasDelete}
          onClose={onCloseHasDelete}
          title={t('newlyAdd.newStatus')}
          onConfirm={onConfirmHasDelete}
        >
          <div style={{ paddingRight: 20 }}>
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
                        bgColor={
                          colorList?.filter(k => k.key === i.category_color)[0]
                            ?.bgColor
                        }
                      >
                        {i.category_name}
                      </CategoryWrap>
                      {t('newlyAdd.appointStatus')}
                    </div>
                  }
                >
                  <Select
                    placeholder={t('common.pleaseSelect')}
                    showArrow
                    showSearch
                    getPopupContainer={node => node}
                    allowClear
                    optionFilterProp="label"
                    options={statusWorkList?.list
                      ?.filter((j: any) => j.id !== operationDelObj?.id)
                      ?.map((k: any) => ({
                        label: k.name,
                        value: k.id,
                      }))}
                  />
                </Form.Item>
              ))}
            </FormWrap>
          </div>
        </CommonModal>
      )}
      <CommonModal
        isVisible={props.isVisible}
        title={t('newlyAdd.addStatus')}
        onClose={onClose}
        onConfirm={onConfirm}
        width={784}
      >
        <div style={{ paddingRight: 20 }}>
          <TableTitle>
            <span style={{ width: '40%' }}>{t('newlyAdd.statusName')}</span>
            <span style={{ width: '45%' }}>{t('newlyAdd.demandCategory')}</span>
            <span style={{ width: '15%' }}>{t('newlyAdd.operation')}</span>
          </TableTitle>
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
            <Spin spinning={isSpinning}>
              {!!statusWorkList?.list
                && (statusWorkList?.list?.length > 0 ? (
                  <TableWrapBox
                    rowSelection={rowSelection}
                    dataSource={statusWorkList?.list}
                    columns={columns}
                    showHeader={false}
                    pagination={false}
                    rowKey="id"
                  />
                )
                  : <NoData />
                )}
            </Spin>
          </TableWrap>
        </div>
      </CommonModal>
    </>
  )
}

export default AddWorkflow
