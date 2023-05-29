/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import { Checkbox } from 'antd'
import { useEffect, useState } from 'react'
import Addperson from '@/views/WorkReport/Formwork/Addperson'
import { useTranslation } from 'react-i18next'
import { setReportContent, setReportContentCopy } from '@store/formWork'
import { useDispatch, useSelector } from '@store/index'

const AcceptorSelection = (props: any) => {
  const dispatch = useDispatch()
  const [isEmail, setIsEmail] = useState(false)
  const [t] = useTranslation()

  const { fillingRequirements, reportContentCopy } = useSelector(
    store => store.formWork,
  )

  const [person1, setPerson1] = useState<any>([])
  const [person2, setPerson2] = useState<any>([])
  const [person3, setPerson3] = useState<any>([])

  const onChange2 = (e: any) => {
    console.log(`checked = ${e.target.checked}`)
    setIsEmail(e.target.checked)
  }

  const fitlerDataList = (data: any) => {
    let obj: any = {}
    let set: any = data?.reduce((cur: any, next: any) => {
      obj[next.target_id] ? '' : (obj[next.target_id] = true && cur.push(next))
      return cur
    }, [])
    return set
  }
  const filterValues = (list: any) => {
    // 谁可以写
    let data1 =
      list?.filter((item: { user_type: number }) => item.user_type === 1) || []
    //  汇报对象
    let data2 = list?.filter(
      (item: { user_type: number }) => item.user_type === 2,
    )
    //  谁可以看
    let data3 =
      list?.filter((item: { user_type: number }) => item.user_type === 3) || []
    const d1 = fitlerDataList(data1)
    const d2 = fitlerDataList(data2)
    const d3 = fitlerDataList(data3)
    return [...d1, ...d2, ...d3]
  }
  const onChangedel = (el: any, num: number) => {
    let data1: any = person1 || []
    let data2: any = person2 || []
    let data3: any = person3 || []
    if (num === 1) {
      data1 = person1.filter((item: any) =>
        el?.target_id ? item?.target_id !== el?.target_id : el.key !== item.key,
      )
    } else if (num === 2) {
      data2 = person2.filter((item: any) => item.target_id !== el.target_id)
    } else {
      data3 = person3.filter((item: any) =>
        el?.target_id ? item?.target_id !== el?.target_id : el.key !== item.key,
      )
    }
    const v3 = data3.find(
      (item: any) =>
        item.user_type === 3 &&
        (item.key === 'all' || item.target_value?.key === 'all'),
    )
    const v1 = data1.find(
      (item: any) =>
        item.user_type === 1 &&
        (item.key === 'all' || item.target_value?.key === 'all'),
    )

    dispatch(
      setReportContentCopy({
        is_all_view: v3 ? 1 : 2,
        is_all_write: v1 ? 1 : 2,
        template_configs: filterValues([...data1, ...data2, ...data3]),
      }),
    )
  }
  const onChangeValues = (values: any, num: number) => {
    console.log(values, 'values')
    let d1: any = person1 || []
    let d2 = person2 || []
    let d3 = person3 || []
    if (num === 1) {
      const val1 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d1 = [...person1, ...val1]
    } else if (num === 2) {
      const val2 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d2 = [...person2, ...val2]
      setPerson2(d2)
    } else {
      const val3 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d3 = [...person3, ...val3]
    }
    const d3V = d3.find(
      (item: any) =>
        item.user_type === 3 &&
        (item.key === 'all' || item?.target_value?.key === 'all'),
    )
    const d1v = d1.find(
      (item: any) =>
        item.user_type === 1 &&
        (item.key === 'all' || item?.target_value?.key === 'all'),
    )
    dispatch(
      setReportContentCopy({
        is_all_view: d3V ? 1 : 2,
        is_all_write: d1v ? 1 : 2,
        template_configs: [...d1, ...d2, ...d3],
      }),
    )
  }
  // 组装数据
  const assemblyData = () => {
    // 谁可以写
    let data1 =
      reportContentCopy.template_configs?.filter(
        (item: { user_type: number }) => item.user_type === 1,
      ) || []
    //  汇报对象
    let data2 = reportContentCopy.template_configs?.filter(
      (item: { user_type: number }) => item.user_type === 2,
    )
    //  谁可以看
    let data3 =
      reportContentCopy.template_configs?.filter(
        (item: { user_type: number }) => item.user_type === 3,
      ) || []
    // 有已经存在的情况，需要过滤掉
    if (reportContentCopy.is_all_view === 1) {
      const newData3 = [
        {
          user_type: 3,
          key: 'all',
          name: '全员',
          avatar: '',
          target_id: -1,
          target_value: {
            user_type: 3,
            key: 'all',
            name: '全员',
            avatar: '',
          },
        },
        ...data3,
      ]
      const hasAll = data3.find((el: any) => el.target_value.key === 'all')
      setPerson3(hasAll ? data3 : newData3)
    }
    // 有已经存在的情况，需要过滤掉
    if (reportContentCopy.is_all_write === 1) {
      const newData1 = [
        {
          user_type: 1,
          key: 'all',
          name: '全员',
          avatar: '',
          target_id: -1,
          target_value: {
            user_type: 1,
            key: 'all',
            name: '全员',
            avatar: '',
          },
        },
        ...data1,
      ]
      const hasAll = data1.find((el: any) => el.target_value.key === 'all')
      setPerson1(hasAll ? data1 : newData1)
    }
    reportContentCopy.is_all_view === 2 && setPerson3(data3)
    reportContentCopy.is_all_write === 2 && setPerson1(data1)
    setPerson2(data2)
  }
  useEffect(() => {
    reportContentCopy && assemblyData()
    return () => {
      dispatch(setReportContentCopy(null))
    }
  }, [reportContentCopy])
  console.log(person1, '选中的人')
  useEffect(() => {
    props.onChange({
      member: person1,

      isEmail: isEmail,
    })
  }, [person1, isEmail])
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '-30px', left: '80px' }}>
        <Checkbox onChange={onChange2}>
          <span
            style={{
              height: '20px',
              fontSize: '12px',
              verticalAlign: 'text-bottom',
              color: '#646566',
              lineHeight: '20px',
            }}
          >
            同时邮件通知
          </span>
        </Checkbox>
      </div>
      <Addperson
        onChangedel={val => onChangedel(val, 1)}
        onChangeValues={val => onChangeValues(val, 1)}
        person={person1}
        // title={t('formWork.title2')}
        isShow={false}
        state={1}
      />
    </div>
  )
}

export default AcceptorSelection
