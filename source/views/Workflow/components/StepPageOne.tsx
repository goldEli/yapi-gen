// 需求设置-工作流第一步

/* eslint-disable camelcase */
/* eslint-disable no-undefined */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import {
  Form,
  Radio,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
  message,
} from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { useEffect, useImperativeHandle, useState } from 'react'
import { OmitText } from '@star-yun/ui'
import EditWorkflow from './EditWorkflow'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import AddWorkflow from './AddWorkflow'
import { CategoryWrap, HiddenText, ViewWrap } from '@/components/StyleCommon'
import { arrayMoveImmutable } from 'array-move'
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import NoData from '@/components/NoData'
import { useTranslation } from 'react-i18next'
import {
  deleteStoryConfigWorkflow,
  getWorkflowList,
  sortchangeWorkflow,
  updateStoryConfigWorkflow,
} from '@/services/project'
import { useDispatch, useSelector } from '@store/index'
import { setWorkList } from '@store/project'

const TableWrap = styled.div({
  width: '100%',
  height: 'calc(100% - 204px)',
  overflowY: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '.ant-spin-nested-loading': {
    width: '100%',
  },
})

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

interface Props {
  onChangeStep(val: any): void
  onRef: any
}

const StepPageOne = (propsOne: Props) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [form] = Form.useForm()
  const [isSpinning, setIsSpinning] = useState(false)
  const [dataSource, setDataSource] = useState<any>({
    list: undefined,
  })
  const { colorList } = useSelector(store => store.project)
  const dispatch = useDispatch()

  const getList = async (isUpdateList?: any) => {
    if (isUpdateList) {
      setIsSpinning(true)
    }
    const result = await getWorkflowList({
      projectId: paramsData.id,
      categoryId: categoryItem?.id,
    })
    dispatch(setWorkList(result))
    setDataSource(result)
    setIsSpinning(false)
    return result
  }

  useEffect(() => {
    getList(1)
  }, [])

  const onClickOperation = (row: any, type: string) => {
    setOperationObj(row)
    if (type === 'edit') {
      setIsVisible(true)
    } else {
      Number(row.deleteData?.story_count)
        ? setIsHasDelete(true)
        : setIsDelVisible(true)
    }
  }

  const onCloseHasDelete = () => {
    setIsHasDelete(false)
  }

  const onSaveMethod = async (isUpdateList?: any, arr?: any) => {
    const len = arr
      ? arr?.length
      : dataSource?.list?.map((i: any) => ({ id: i.id }))?.length
    if (len) {
      await sortchangeWorkflow({
        projectId: paramsData.id,
        categoryId: categoryItem?.id,
        ids: arr
          ? arr?.map((i: any) => ({ id: i.id }))
          : dataSource?.list?.map((i: any) => ({ id: i.id })),
      })
    }
    if (!isUpdateList) {
      getList(isUpdateList)
    }
  }

  const onSave = () => {
    if (!dataSource?.list?.length) {
      message.warning(t('newlyAdd.onlyDemandStatus'))
      return
    }
    try {
      onSaveMethod()
      message.success(t('common.saveSuccess'))
      propsOne?.onChangeStep(2)
    } catch (error) {
      //
    }
  }

  const onConfirmHasDelete = async () => {
    await form.validateFields()
    const obj = {
      projectId: paramsData.id,
      id: operationObj?.id,
      item: {
        status_id: form.getFieldValue('statusId'),
        category_id: categoryItem?.id,
      },
    }

    try {
      await deleteStoryConfigWorkflow(obj)
      message.success(t('common.deleteSuccess'))
      setOperationObj({})
      setIsHasDelete(false)
      const arr = dataSource?.list?.filter(
        (i: any) => i.id !== operationObj?.id,
      )
      onSaveMethod('', arr)
      setTimeout(() => {
        form.resetFields()
      }, 100)
    } catch (error) {
      //
    }
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteStoryConfigWorkflow({
        projectId: paramsData.id,
        id: operationObj?.id,
      })
      message.success(t('common.deleteSuccess'))
      setOperationObj({})
      setIsDelVisible(false)
      const arr = dataSource?.list?.filter(
        (i: any) => i.id !== operationObj?.id,
      )
      onSaveMethod('', arr)
    } catch (error) {
      //
    }
  }

  const onClose = () => {
    setIsVisible(false)
  }

  const onUpdate = () => {
    getList()
  }

  const onChangeListStatus = async (checked: any, row: any) => {
    if (row.startStatus) {
      message.warning(t('newlyAdd.startStatusNoEnd'))
      return
    }
    const obj = {
      projectId: paramsData.id,
      id: row.id,
      endStatus: checked ? 1 : 2,
    }
    try {
      await updateStoryConfigWorkflow(obj)
      message.success(t('common.editS'))
      onSaveMethod()
    } catch (error) {
      //
    }
  }

  const onchangeRadio = async (e: any, row: any) => {
    const obj = {
      projectId: paramsData.id,
      id: row.id,
      startStatus: e.target.checked ? 1 : 2,
    }
    try {
      await updateStoryConfigWorkflow(obj)
      message.success(t('common.editS'))
      onSaveMethod()
    } catch (error) {
      //
    }
  }

  const DragHandle = sortableHandle(() => (
    <IconFont
      type="move"
      style={{ fontSize: 16, cursor: 'pointer', color: '#969799' }}
    />
  ))

  const SortableItem = sortableElement(
    (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
  )

  const SortableBody = sortableContainer(
    (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody {...props} />
    ),
  )

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataSource?.list?.slice(),
        oldIndex,
        newIndex,
      ).filter((el: any) => !!el)
      setDataSource({ list: newData })
    }
  }

  const DraggableContainer = (props: any) => (
    <SortableBody
      useDragHandle
      helperClass="row-dragging"
      disableAutoscroll
      onSortEnd={onSortEnd}
      {...props}
    />
  )

  const DraggableBodyRow: React.FC<any> = ({ ...restProps }) => {
    const index = dataSource?.list?.findIndex(
      (x: any) => x.index === restProps['data-row-key'],
    )
    return <SortableItem index={index} {...restProps} />
  }

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      render: () => <DragHandle />,
    },
    {
      title: t('newlyAdd.statusName'),
      width: 180,
      dataIndex: 'name',
      render: (text: any, record: any) => (
        <ViewWrap color={record?.color}>{text}</ViewWrap>
      ),
    },
    {
      title: t('newlyAdd.statusRemark'),
      width: 400,
      dataIndex: 'info',
      render: (text: any) => (
        <HiddenText>
          <OmitText
            width={380}
            tipProps={{
              getPopupContainer: node => node,
            }}
          >
            {text || '--'}
          </OmitText>
        </HiddenText>
      ),
    },
    {
      width: 130,
      title: (
        <div>
          <span>{t('newlyAdd.startStatus')}</span>
          <Tooltip title={t('newlyAdd.createNormalStatus')}>
            <IconFont
              style={{ marginLeft: 16, cursor: 'pointer' }}
              type="question"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'startStatus',
      render: (text: any, record: any) => (
        <Radio checked={text} onChange={e => onchangeRadio(e, record)} />
      ),
    },
    {
      width: 130,
      title: (
        <div>
          <span>{t('newlyAdd.endStatus')}</span>
          <Tooltip title={t('newlyAdd.endStatusText')}>
            <IconFont
              style={{ marginLeft: 16, cursor: 'pointer' }}
              type="question"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'endStatus',
      render: (text: any, record: any) => (
        <Switch
          checkedChildren={t('newlyAdd.yes')}
          unCheckedChildren={t('newlyAdd.no')}
          checked={text}
          disabled={record.startStatus}
          onChange={checked => onChangeListStatus(checked, record)}
        />
      ),
    },
    {
      width: 120,
      title: t('newlyAdd.operation'),
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <Space size={16}>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}
            onClick={() => onClickOperation(record, 'edit')}
          >
            {t('common.edit')}
          </span>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}
            onClick={() => onClickOperation(record, 'del')}
          >
            {t('common.del')}
          </span>
        </Space>
      ),
    },
  ]

  useImperativeHandle(propsOne.onRef, () => {
    return {
      onSave: onSaveMethod,
      list: dataSource?.list,
    }
  })

  const onUpdateEdit = () => {
    onSaveMethod()
  }

  return (
    <>
      <AddWorkflow
        isVisible={isAddVisible}
        onUpdate={onUpdate}
        onClose={() => setIsAddVisible(false)}
      />
      <EditWorkflow
        item={operationObj}
        isVisible={isVisible}
        onClose={onClose}
        onUpdate={onUpdateEdit}
      />
      <DeleteConfirm
        text={t('newlyAdd.confirmDelStatus')}
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      />
      <CommonModal
        isVisible={isHasDelete}
        onClose={onCloseHasDelete}
        title={t('newlyAdd.historyMove')}
        onConfirm={onConfirmHasDelete}
      >
        <div style={{ padding: '0 16px 0 2px' }}>
          <HasDemandText>
            {t('newlyAdd.changeNewStatus', {
              count: operationObj?.deleteData?.story_count,
              name: operationObj?.name,
            })}
          </HasDemandText>
          <FormWrap form={form} layout="vertical">
            <Form.Item
              rules={[{ required: true, message: '' }]}
              name="statusId"
              label={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryWrap
                    style={{ marginRight: 8, marginLeft: 0 }}
                    color={operationObj?.deleteData?.item?.category_color}
                    bgColor={
                      colorList?.filter(
                        (k: any) =>
                          k.key ===
                          operationObj?.deleteData?.item?.category_color,
                      )[0]?.bgColor
                    }
                  >
                    {operationObj?.deleteData?.item?.category_name}
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
                options={operationObj?.deleteData?.item?.status?.map(
                  (i: any) => ({ label: i.content, value: i.id }),
                )}
              />
            </Form.Item>
          </FormWrap>
        </div>
      </CommonModal>
      <div
        style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 24 }}
      >
        <Button
          style={{ background: '#F0F4FA', color: '#2877ff' }}
          icon={<IconFont type="plus" />}
          onClick={() => setIsAddVisible(true)}
        >
          {t('newlyAdd.addStatus')}
        </Button>
        <span style={{ color: '#969799', fontSize: 12, marginLeft: 8 }}>
          {t('newlyAdd.canOperation')}
        </span>
      </div>
      <TableWrap>
        <Spin spinning={isSpinning}>
          {!!dataSource?.list &&
            (dataSource?.list?.length > 0 ? (
              <div style={{ width: '100%' }}>
                <Table
                  pagination={false}
                  dataSource={dataSource?.list}
                  columns={columns}
                  rowKey="index"
                  sticky
                  components={{
                    body: {
                      wrapper: DraggableContainer,
                      row: DraggableBodyRow,
                    },
                  }}
                />
                <div
                  style={{
                    marginTop: 8,
                    color: '#969799',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {t('newlyAdd.dragSort')}
                  <IconFont
                    type="move"
                    style={{
                      fontSize: 14,
                    }}
                  />
                  {t('newlyAdd.textSort')}
                </div>
              </div>
            ) : (
              <NoData subText={t('newlyAdd.pleaseAddStatus')} />
            ))}
        </Spin>
      </TableWrap>
      {dataSource?.list?.length > 0 && (
        <Space size={16} style={{ position: 'absolute', bottom: 24, left: 24 }}>
          <Button type="primary" onClick={onSave}>
            {t('newlyAdd.saveAndNext')}
          </Button>
        </Space>
      )}
    </>
  )
}

export default StepPageOne
