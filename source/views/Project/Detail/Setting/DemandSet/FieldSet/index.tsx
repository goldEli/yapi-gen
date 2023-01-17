// 需求字段主页

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
import { useTranslation } from 'react-i18next'
import DeleteConfirm from '@/components/DeleteConfirm'
import EditFiled from './components/EditField'
import NoData from '@/components/NoData'
import { useSelector } from '@store/index'
import { storyConfigField } from '@/services/project'

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
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useSelector(
    (store: { project: any }) => store.project,
  )
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
        <span>{t('newlyAdd.back')}</span>
      </BackWrap>
      <Divider type="vertical" style={{ background: '#BBBDBF' }} />
      <div style={{ color: '#323233', cursor: 'pointer' }} onClick={onToSet}>
        {t('newlyAdd.demandSet')}
      </div>
      <IconFont type="right" style={{ color: '#323233', margin: '0 4px' }} />
      <div style={{ color: '#969799' }}>{t('newlyAdd.fieldsSet')}</div>
    </SetTitleWrap>
  )
}

const FieldSet = () => {
  const [t] = useTranslation()
  const { deleteStoryConfigField } = useModel('project')
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const [fieldList, setFieldList] = useState<any>({
    list: undefined,
  })

  const option = [
    { label: t('newlyAdd.lineText'), value: '1', type: 'text' },
    { label: t('newlyAdd.moreLineText'), value: '2', type: 'textarea' },
    { label: t('newlyAdd.radioDropdown'), value: '3', type: 'select' },
    { label: t('newlyAdd.multiDropdown'), value: '4', type: 'select_checkbox' },
    { label: t('newlyAdd.checkbox'), value: '5', type: 'checkbox' },
    { label: t('newlyAdd.radio'), value: '6', type: 'radio' },
    { label: t('newlyAdd.time'), value: '7', type: 'date' },
    { label: t('newlyAdd.number'), value: '8', type: 'number' },
    { label: t('version2.personRadio'), value: '9', type: 'user_select' },
    {
      label: t('version2.personCheckbox'),
      value: '10',
      type: 'user_select_checkbox',
    },
  ]

  const getList = async () => {
    setIsSpinning(true)
    const result = await storyConfigField({
      projectId: paramsData.id,
    })
    setFieldList(result)
    setIsSpinning(false)
  }

  useEffect(() => {
    getList()
  }, [])

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
      title: t('newlyAdd.customName'),
      dataIndex: 'name',
      width: 240,
      render: (text: any) => {
        return <div style={{ color: '#323233', fontSize: 14 }}>{text}</div>
      },
    },
    {
      title: t('newlyAdd.fieldsType'),
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
      title: t('newlyAdd.operation'),
      dataIndex: 'action',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <Space size={16}>
            <span
              style={{ color: '#2877ff', cursor: 'pointer', fontSize: 14 }}
              onClick={() => onEditClick(record)}
            >
              {t('common.edit')}
            </span>
            <span
              style={{ color: '#2877ff', cursor: 'pointer', fontSize: 14 }}
              onClick={() => onDelClick(record)}
            >
              {t('common.del')}
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
        title={
          operationObj?.hasDemand
            ? t('newlyAdd.confirmDel')
            : t('components.deleteConfirm')
        }
        text={
          operationObj?.hasDemand
            ? t('newlyAdd.hasDemandDel', { hasDemand: operationObj?.hasDemand })
            : t('newlyAdd.confirmDel')
        }
      />
      <SetBreadcrumb />
      <ContentWrap>
        <ItemWrap>
          <Button
            type="primary"
            icon={<IconFont type="plus" />}
            onClick={onAddClick}
            disabled={fieldList?.list?.length === 20}
          >
            {t('newlyAdd.addFields')}
          </Button>
          <div style={{ color: '#969799', fontSize: 12, marginLeft: 16 }}>
            {t('newlyAdd.maxAddFields')}
          </div>
        </ItemWrap>
        <TableWrap>
          <Spin spinning={isSpinning}>
            {!!fieldList?.list &&
              (fieldList?.list?.length > 0 ? (
                <Table
                  rowKey="id"
                  pagination={false}
                  columns={columns}
                  dataSource={fieldList?.list}
                  sticky
                />
              ) : (
                <NoData />
              ))}
          </Spin>
        </TableWrap>
      </ContentWrap>
    </Wrap>
  )
}

export default FieldSet
