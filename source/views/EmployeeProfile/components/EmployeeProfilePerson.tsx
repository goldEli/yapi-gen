/* eslint-disable no-undefined */
import { getMemberOverviewList } from '@store/employeeProfile/employeeProfile.thunk'
import { useDispatch, useSelector } from '@store/index'
import { useEffect, useState } from 'react'
import {
  CheckBoxWrap,
  CheckboxAll,
  CheckboxLi,
  PersonWrap,
  ReportButton,
} from '../style'
import { Checkbox } from 'antd'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import { setContrastDrawer } from '@store/employeeProfile'
import { useTranslation } from 'react-i18next'

interface EmployeeProfilePersonProps {
  onChangeFilter(value: any): void
  filterParams: any
}

const EmployeeProfilePerson = (props: EmployeeProfilePersonProps) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  // 全选状态
  const [checkAll, setCheckAll] = useState(false)
  // 半选状态
  const [indeterminate, setIndeterminate] = useState(false)
  // 选中的key
  const [selectKeys, setSelectKeys] = useState<any>([])
  const { allMemberList, currentKey } = useSelector(
    store => store.employeeProfile,
  )

  // 点击全选
  const onAllChecked = (e: any) => {
    const { checked } = e.target
    setSelectKeys(checked ? allMemberList?.map((k: any) => k.id) : [])
    setIndeterminate(false)
    setCheckAll(checked)
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: checked ? allMemberList?.map((k: any) => k.id) : [],
      },
    })
  }

  // 点击勾选或者取消人员
  const onItemChecked = (e: any, id: number) => {
    const { checked } = e.target
    let resultKeys: any = []
    // 如果勾选中不存在，则添加
    if (selectKeys?.includes(id)) {
      resultKeys = selectKeys?.filter((i: number) => i !== id)
    } else {
      resultKeys = [...selectKeys, ...[id]]
    }
    setSelectKeys(resultKeys)
    setIndeterminate(
      resultKeys?.length !== allMemberList?.length && resultKeys?.length !== 0,
    )
    setCheckAll(resultKeys?.length === allMemberList?.length)
    props.onChangeFilter({
      ...props?.filterParams,
      ...{
        user_ids: resultKeys,
      },
    })
  }

  // 打开对比报告
  const onOpenContrast = () => {
    dispatch(setContrastDrawer({ visible: true }))
  }

  useEffect(() => {
    dispatch(getMemberOverviewList())
  }, [])

  useEffect(() => {
    if (currentKey.key && allMemberList?.length > 0) {
      setSelectKeys(currentKey?.user_ids)
      setIndeterminate(
        currentKey?.total !== allMemberList?.length && currentKey?.total !== 0,
      )
      setCheckAll(currentKey?.total === allMemberList?.length)
    }
  }, [currentKey, allMemberList])

  return (
    <PersonWrap>
      <ReportButton onClick={onOpenContrast}>
        {t('comparisonReport')}
      </ReportButton>
      <div className="label">
        {currentKey?.name}（{props?.filterParams?.user_ids?.length}）
      </div>
      <CheckboxAll
        checked={checkAll}
        indeterminate={indeterminate}
        onClick={onAllChecked}
      >
        {t('selectAll')}
      </CheckboxAll>
      <CheckBoxWrap>
        {allMemberList?.map((i: any) => (
          <CheckboxLi key={i.id}>
            <Checkbox
              checked={selectKeys?.includes(i.id)}
              onClick={e => onItemChecked(e, i.id)}
            >
              <CommonUserAvatar
                avatar={i.avatar}
                name={i.name}
                positionName={i.position?.name}
              />
            </Checkbox>
          </CheckboxLi>
        ))}
      </CheckBoxWrap>
    </PersonWrap>
  )
}

export default EmployeeProfilePerson
