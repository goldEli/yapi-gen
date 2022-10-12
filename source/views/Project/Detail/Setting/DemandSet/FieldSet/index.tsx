/* eslint-disable multiline-ternary */
/* eslint-disable no-undefined */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { Divider, message, Space, Spin, Table } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import Sort from '@/components/Sort'
import { useTranslation } from 'react-i18next'
import DeleteConfirm from '@/components/DeleteConfirm'
import EditFiled from './components/EditField'
import NoData from '@/components/NoData'

const Wrap = styled.div({
  padding: 16,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const SetTitleWrap = styled.div({
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  fontSize: 12,
})

const BackWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: '#2877ff',
  fontWeight: 400,
  cursor: 'pointer',
})

const ContentWrap = styled.div({
  borderRadius: 6,
  background: 'white',
  width: '100%',
  height: 'calc(100% - 35px)',
  padding: '24px 8px 24px 24px',
  overflow: 'auto',
  position: 'relative',
})

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'flex-end',
})

const TableWrap = styled.div({
  overflow: 'auto',
  height: 'calc(100% - 50px)',
  marginTop: 16,
  paddingRight: 16,
})

const SetBreadcrumb = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useModel('project')
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0

  const onBack = () => {
    navigate(-1)
  }

  const onToSet = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: activeTabs,
        id: projectInfo.id,
        pageIdx: 'main',
      }),
    )
    navigate(`/Detail/Set?data=${params}`)
  }
  return (
    <SetTitleWrap>
      <BackWrap onClick={onBack}>
        <IconFont type="return" style={{ fontSize: 16, marginRight: 6 }} />
        <span>返回</span>
      </BackWrap>
      <Divider type="vertical" style={{ background: '#BBBDBF' }} />
      <div style={{ color: '#323233', cursor: 'pointer' }} onClick={onToSet}>
        需求设置
      </div>
      <IconFont type="right" style={{ color: '#323233', margin: '0 4px' }} />
      <div style={{ color: '#969799' }}>字段设置</div>
    </SetTitleWrap>
  )
}

const NewSort = (sortProps: any) => {
  return (
    <Sort
      fixedKey={sortProps.fixedKey}
      onChangeKey={sortProps.onUpdateOrderKey}
      nowKey={sortProps.nowKey}
      order={sortProps.order === 'asc' ? 1 : 2}
    >
      {sortProps.children}
    </Sort>
  )
}

const FieldSet = () => {
  const [t] = useTranslation()
  const { getFieldList, fieldList, option, deleteStoryConfigField }
    = useModel('project')
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [order, setOrder] = useState<any>({ value: '', key: '' })
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)

  const getList = async () => {
    setIsSpinning(true)
    await getFieldList({
      projectId: paramsData.id,
    })
    setIsSpinning(false)
  }

  useEffect(() => {
    getList()
  }, [])

  const onUpdateOrderKey = (key: any, val: any) => {

    // 排序
  }

  const onAddClick = () => {
    setOperationObj({})
    setIsVisible(true)
  }

  const onDelClick = (row: any) => {
    setOperationObj(row)
    setIsDelVisible(true)
  }

  const onEditClick = (row: any) => {
    const obj = Object.assign({}, row)
    obj.values = obj.type?.value
    obj.type = option?.filter(i => i.type === obj.type.attr)[0]?.value

    setOperationObj(obj)
    setIsVisible(true)
  }

  const onDelConfirm = async () => {
    try {
      await deleteStoryConfigField({
        id: operationObj.id,
        projectId: paramsData.id,
      })
      setIsDelVisible(false)
      setOperationObj({})
      message.success(t('common.deleteSuccess'))
      getList()
    } catch (error) {

      //
    }
  }

  const columns = [
    {
      title: (
        <NewSort
          fixedKey="name"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          自定义名称
        </NewSort>
      ),
      dataIndex: 'name',
      width: 240,
      render: (text: any) => {
        return <div style={{ color: '#323233', fontSize: 14 }}>{text}</div>
      },
    },
    {
      title: (
        <NewSort
          fixedKey="type"
          nowKey={order.key}
          order={order.value}
          onUpdateOrderKey={onUpdateOrderKey}
        >
          字段类型
        </NewSort>
      ),
      dataIndex: 'type',
      width: 240,
      render: (text: any) => {
        return (
          <div style={{ color: '#323233', fontSize: 14 }}>
            {option?.filter(i => i.type === text?.attr)[0]?.label}
          </div>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <Space size={16}>
            <span
              style={{ color: '#2877ff', cursor: 'pointer', fontSize: 14 }}
              onClick={() => onEditClick(record)}
            >
              编辑
            </span>
            <span
              style={{ color: '#2877ff', cursor: 'pointer', fontSize: 14 }}
              onClick={() => onDelClick(record)}
            >
              删除
            </span>
          </Space>
        )
      },
    },
  ]

  const onUpdate = () => {
    setOperationObj({})
    getList()
  }

  return (
    <Wrap>
      <EditFiled
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        item={operationObj}
        onUpdate={onUpdate}
      />
      <DeleteConfirm
        isVisible={isDelVisible}
        onConfirm={onDelConfirm}
        onChangeVisible={() => setIsDelVisible(false)}
        title={operationObj?.hasDemand ? '确认删除该字段？' : '删除确认'}
        text={
          operationObj?.hasDemand
            ? `检测到该字段有${operationObj?.hasDemand}个需求，删除自定义字段后，对应
        字段值将会被清空，且无法恢复，请谨慎操作。`
            : '确认删除该字段？'
        }
      />
      <SetBreadcrumb />
      <ContentWrap>
        <ItemWrap>
          <Button
            type="primary"
            icon={<IconFont type="plus" />}
            onClick={onAddClick}
          >
            添加字段
          </Button>
          <div style={{ color: '#969799', fontSize: 12, marginLeft: 16 }}>
            自定义字段最多可添加20个
          </div>
        </ItemWrap>
        <TableWrap>
          <Spin spinning={isSpinning}>
            {!!fieldList?.list
              && (fieldList?.list?.length > 0 ? (
                <Table
                  rowKey="id"
                  pagination={false}
                  columns={columns}
                  dataSource={fieldList?.list}
                  sticky
                />
              )
                : <NoData />
              )}
          </Spin>
        </TableWrap>
      </ContentWrap>
    </Wrap>
  )
}

export default FieldSet
