import { Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { CanOperation, IconFontWrapEdit } from '../StyleCommon'
import CustomSelect from '../CustomSelect'
import { getParentList } from '@/services/project'
import { getMessage } from '../Message'
import { updateTableParams } from '@/services/demand'
import { updateFlawTableParams } from '@/services/flaw'
import { updateAffairsTableParams } from '@/services/affairs'
import { useTranslation } from 'react-i18next'

interface DetailParentProps {
  // 是否可编辑
  hasEdit?: boolean
  onUpdate(): void
  //   详细信息
  detail: any
  // 1-需求，2-缺陷，3-事务
  type: number
  //   可编辑的字段
  canOperationKeys: any
}

const DetailParent = (props: DetailParentProps) => {
  const [t] = useTranslation()
  // 下拉数据
  const [selectList, setSelectList] = useState([])
  // 是否在编辑状态
  const [isShowControl, setIsShowControl] = useState(false)
  const inputRef = useRef<HTMLInputElement>()
  const [defaultValue, setDefaultValue] = useState('')

  const methodsList = [
    { type: 1, url: updateTableParams },
    { type: 2, url: updateFlawTableParams },
    { type: 3, url: updateAffairsTableParams },
  ]

  //   获取父需求列表
  const getParentData = async () => {
    // console.log(props.detail, '=props.detailprops.detail')
    const response = await getParentList({
      projectId: props.detail.projectId,
      id: props.detail.id,
      categoryId: props.detail.categoryId ?? props.detail.category,
    })
    setSelectList(response)
  }

  // 操作框改变
  const onChange = async (newValue: any, type?: any) => {
    if (props.canOperationKeys['parent_id'] === 1 && !newValue) {
      getMessage({
        msg: '父需求是必填项',
        type: 'warning',
      })
      setIsShowControl(false)
      return
    }

    const obj: any = {
      projectId: props.detail.projectId,
      id: props.detail?.id,
      otherParams: {
        parent_id: newValue || newValue === 0 ? newValue : 0,
      },
    }

    const currentType = methodsList.filter((i: any) => i.type === props.type)[0]
    await currentType.url(obj)
    getMessage({ msg: t('common.editSuccess'), type: 'success' })
    props.onUpdate()
    if (type === 1) {
      setIsShowControl(false)
    }
  }

  // 操作框失焦
  const onBlur = (val: any) => {
    if (props.canOperationKeys['parent_id'] === 1 && !val) {
      getMessage({
        msg: '父需求是必填项',
        type: 'warning',
      })
      setIsShowControl(false)
      return
    }
    if (val === defaultValue) {
      setIsShowControl(false)
    } else {
      let resultVal: any
      if (
        [
          'select_checkbox',
          'checkbox',
          'fixed_select',
          'user_select_checkbox',
        ].includes(String(props?.type)) &&
        !val
      ) {
        resultVal = []
      } else {
        resultVal = val || ''
      }
      onChange(resultVal, 1)
    }
  }

  //   点击进行编辑
  const onClick = () => {
    if (!props.hasEdit) return
    setIsShowControl(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  useEffect(() => {
    if (props.detail.id) {
      getParentData()
      setDefaultValue(props.detail.parentName)
    }
  }, [props.detail])

  return (
    <div style={{ width: '100%' }}>
      {isShowControl && (
        <CustomSelect
          placeholder="请选择父需求"
          style={{ width: '100%', minWidth: 192 }}
          showSearch
          showArrow
          optionFilterProp="label"
          getPopupContainer={(node: any) => node}
          allowClear={
            props.type === 3 && props.detail.work_type === 6 ? false : true
          }
          value={defaultValue}
          onRef={inputRef}
          onBlur={() => onBlur?.(defaultValue)}
          onChange={(value: any) => onChange?.(value, 1)}
          options={selectList}
          defaultOpen={true}
        />
      )}
      {!isShowControl && (
        <CanOperation
          isCanEdit={props.hasEdit}
          isTable={false}
          onClick={onClick}
        >
          {props.detail.parentName || '--'}
          {props.hasEdit && (
            <IconFontWrapEdit
              onClick={() => setIsShowControl(true)}
              isTable={false}
              type="down-icon"
            />
          )}
        </CanOperation>
      )}
    </div>
  )
}

export default DetailParent
