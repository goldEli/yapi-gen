// 需求设置-工作流第二步

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import styled from '@emotion/styled'
import { Table, Space, Checkbox, message } from 'antd'
import IconFont from '@/components/IconFont'
import { OmitText } from '@star-yun/ui'
import { useEffect, useMemo, useState } from 'react'
import SetConfig from './SetConfig'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'
import { CounterState, setWorkList } from '@store/project'
import { saveWorkflowStatus } from '@/services/project'
import CommonButton from '@/components/CommonButton'
import { getMessage } from '@/components/Message'
import DeleteConfirm from '@/components/DeleteConfirm'

const TableWrap = styled.div({
  width: '100%',
  maxHeight: 'calc(100% - 52px)',
  overflowY: 'auto',
})

const ContWrap = styled.div({
  marginTop: '24px',
  width: '100%',
  height: 'calc(100% - 148px)',
})

const TextWrap = styled.div({
  marginTop: 8,
  color: 'var(--neutral-n3)',
  fontSize: 12,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
})

const IconfontWrap = styled(IconFont)({
  color: 'var(--neutral-n4)',
  cursor: 'pointer',
  fontSize: 16,
  '&: hover': {
    color: 'var(--primary-d2)',
  },
})

const StepPageTwo = (props: any) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { categoryItem } = paramsData
  const [isSaveVisible, setIsSaveVisible] = useState(false)
  const { workList } = useSelector(
    (store: { project: CounterState }) => store.project,
  )
  const [nowWorkList, setNowWorkList] = useState<any>()
  const [isVisible, setIsVisible] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const dispatch = useDispatch()

  const onClickSet = (row: any, id: any) => {
    const newRow = Object.assign({}, row)
    newRow.toId = id
    setOperationObj(newRow)
    setIsVisible(true)
  }

  const onChangeCheck = (e: any, row: any, id: any) => {
    const arr: any = JSON.parse(JSON.stringify(workList?.list))
    if (e.target.checked) {
      arr?.filter((i: any) => i.id === row.id)[0]?.canChange?.push(String(id))
    } else {
      arr.filter((i: any) => i.id === row.id)[0].canChange = arr
        ?.filter((i: any) => i.id === row.id)[0]
        ?.canChange?.filter((k: any) => k !== String(id))
    }
    dispatch(setWorkList({ list: arr }))
  }
  useEffect(() => {
    setNowWorkList(workList.list)
  }, [])
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

  const onSave = async (str?: string) => {
    try {
      if (!compareArrays(nowWorkList, workList?.list)) {
        await saveWorkflowStatus({
          projectId: paramsData.id,
          categoryId: categoryItem?.id,
          canChanges: workList?.list?.map((k: any) => ({
            id: k.id,
            can_changes_category_status: k.canChange,
          })),
        })
        setNowWorkList([...workList?.list])
        getMessage({ msg: t('common.saveSuccess'), type: 'success' })
      }
      str === 'cancel' && props.onCancel()
    } catch (error) {
      //
    }
  }
  // 比较两个数据的变化
  const compareArrays = (arr1: any, arr2: any) => {
    if (arr1.length !== arr2.length) {
      return false
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].canChange.length !== arr2[i].canChange.length) {
        return false
      }
    }
    return true
  }
  const onClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setOperationObj({})
    }, 100)
  }
  const onCancel = () => {
    if (!compareArrays(nowWorkList, workList?.list)) {
      setIsSaveVisible(true)
      return
    }
    props.onCancel()
  }
  return (
    <>
      <DeleteConfirm
        text={t('other.isSave')}
        title={t('sprintProject.confirmCancel')}
        isVisible={isSaveVisible}
        onChangeVisible={() => {
          props.onCancel()
        }}
        onConfirm={() => {
          onSave('cancel'), setIsSaveVisible(false)
        }}
      />
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

      <Space size={16} style={{ position: 'absolute', top: 68, right: 24 }}>
        <CommonButton type="secondaryText1" onClick={onCancel}>
          {t('cancel')}
        </CommonButton>
        <CommonButton type="primary" onClick={onSave}>
          {t('common.save')}
        </CommonButton>
      </Space>
    </>
  )
}

export default StepPageTwo
