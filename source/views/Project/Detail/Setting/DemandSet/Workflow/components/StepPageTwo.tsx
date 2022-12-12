// 需求设置-工作流第二步

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import styled from '@emotion/styled'
import { Table, Space, Checkbox, message } from 'antd'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { useMemo, useState } from 'react'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import SetConfig from './SetConfig'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'

const TableWrap = styled.div({
  width: '100%',
  maxHeight: 'calc(100% - 52px)',
  overflowY: 'auto',
})

const ContWrap = styled.div({
  width: '100%',
  height: 'calc(100% - 148px)',
})

const TextWrap = styled.div({
  marginTop: 8,
  color: '#969799',
  fontSize: 12,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
})

const IconfontWrap = styled(IconFont)({
  color: '#BBBDBF',
  cursor: 'pointer',
  fontSize: 16,
  '&: hover': {
    color: '#2877ff',
  },
})

const StepPageTwo = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData
  const { workList, saveWorkflowStatus, setWorkList } = useModel('project')
  const [isVisible, setIsVisible] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})

  const onClickSet = (row: any, id: any) => {
    setIsVisible(true)
    row.toId = id
    setOperationObj(row)
  }

  const onChangeCheck = (e: any, row: any, id: any) => {
    const arr = workList?.list
    if (e.target.checked) {
      arr?.filter((i: any) => i.id === row.id)[0]?.canChange?.push(String(id))
    } else {
      arr.filter((i: any) => i.id === row.id)[0].canChange = arr
        ?.filter((i: any) => i.id === row.id)[0]
        ?.canChange?.filter((k: any) => k !== String(id))
    }
    setWorkList({ list: arr })
  }

  const setColumns: any = useMemo(() => {
    const arr = [
      {
        title: t('newlyAdd.statusName'),
        width: 200,
        dataIndex: 'name',
        render: (text: any, record: any) => (
          <OmitText
            width={180}
            tipProps={{
              getPopupContainer: node => node,
            }}
          >
            {t('newlyAdd.fromReviewTo', { name: text })}
          </OmitText>
        ),
      },
    ]
    workList?.list?.forEach((i: any) => {
      arr.push({
        title: i.name,
        width: 120,
        dataIndex: 'id',
        render: (text: any, record: any) => (
          <Space size={16}>
            <Checkbox
              disabled={text === i.id}
              checked={record.canChange?.includes(String(i.id))}
              onChange={e => onChangeCheck(e, record, i.id)}
            />
            {record.canChange?.includes(String(i.id)) ? (
              <IconfontWrap
                onClick={() => onClickSet(record, i.id)}
                type="settings"
              />
            ) : null}
          </Space>
        ),
      })
    })
    return arr
  }, [workList])

  const onSave = async () => {
    try {
      await saveWorkflowStatus({
        projectId: paramsData.id,
        categoryId: categoryItem?.id,
        canChanges: workList?.list?.map((k: any) => ({
          id: k.id,
          can_changes_category_status: k.canChange,
        })),
      })
      message.success(t('common.saveSuccess'))
    } catch (error) {
      //
    }
  }

  const onClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setOperationObj({})
    }, 100)
  }

  return (
    <>
      <ContWrap>
        <SetConfig
          isVisible={isVisible}
          onClose={onClose}
          item={operationObj}
        />
        <TableWrap>
          <Table
            rowKey="id"
            pagination={false}
            dataSource={workList?.list}
            columns={setColumns as any}
            sticky
          />
        </TableWrap>
        <TextWrap>{t('newlyAdd.text')}</TextWrap>
        <TextWrap>
          {t('newlyAdd.dragSortClick')}
          <IconFont
            type="settings"
            style={{
              fontSize: 14,
            }}
          />
          {t('newlyAdd.textSort1')}
        </TextWrap>
      </ContWrap>

      <Space size={16} style={{ position: 'absolute', bottom: 24, left: 24 }}>
        <Button type="primary" onClick={onSave}>
          {t('common.save')}
        </Button>
      </Space>
    </>
  )
}

export default StepPageTwo
