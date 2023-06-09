/* eslint-disable no-undefined */
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
  console.log(props.value, '进来的值')

  const dispatch = useDispatch()
  const [isEmail, setIsEmail] = useState(false)
  const [t] = useTranslation()

  const { fillingRequirements, reportContentCopy } = useSelector(
    store => store.formWork,
  )

  const [person1, setPerson1] = useState<any>([])

  const onChange2 = (e: any) => {
    setIsEmail(e.target.checked)

    props.onChange({
      member: person1,

      isEmail: e.target.checked,
    })
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

    if (num === 1) {
      data1 = person1.filter((item: any) =>
        el?.target_id ? item?.target_id !== el?.target_id : el.key !== item.key,
      )
    }

    const v1 = data1.find(
      (item: any) =>
        item.user_type === 1 &&
        (item.key === 'all' || item.target_value?.key === 'all'),
    )
    props.onChange({
      member: data1,

      isEmail,
    })
    // dispatch(
    //   setReportContentCopy({
    //     is_all_write: v1 ? 1 : 2,
    //     template_configs: filterValues([...data1]),
    //   }),
    // )
  }
  const onChangeValues = (values: any, num: number) => {
    let d1: any = person1 || []

    if (num === 1) {
      const val1 =
        values?.map((el: any) => ({
          target_id: el.id || el.target_id,
          user_type: el.user_type,
          target_type: el.target_type,
          target_value: el.target_value,
        })) || []
      d1 = [...person1, ...val1]
    }

    const d1v = d1.find(
      (item: any) =>
        item.user_type === 1 &&
        (item.key === 'all' || item?.target_value?.key === 'all'),
    )
    console.log(d1)
    props.onChange({
      member: d1,

      isEmail,
    })
    // dispatch(
    //   setReportContentCopy({
    //     is_all_write: d1v ? 1 : 2,
    //     template_configs: [...d1],
    //   }),
    // )
  }
  // 组装数据
  const assemblyData = () => {
    // 谁可以写
    let data1 =
      reportContentCopy.template_configs?.filter(
        (item: { user_type: number }) => item.user_type === 1,
      ) || []

    // 有已经存在的情况，需要过滤掉
    if (reportContentCopy.is_all_write === 1) {
      console.log('feji')

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

      props.onChange({
        member: hasAll ? data1 : newData1,

        isEmail,
      })
    }

    reportContentCopy.is_all_write === 2 && setPerson1(data1)
  }
  // useEffect(() => {
  //   reportContentCopy && assemblyData()

  //   return () => {
  //     dispatch(setReportContentCopy(null))
  //   }
  // }, [reportContentCopy])

  useEffect(() => {
    console.log(props?.value, '数据流')

    setIsEmail(props?.value?.isEmail)
    setPerson1(props?.value?.member ? props?.value?.member : [])
  }, [props.value])
  console.log(person1, '人')

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '-30px', left: '80px' }}>
        <Checkbox checked={isEmail} onChange={onChange2}>
          <span
            style={{
              height: '20px',
              fontSize: '12px',
              verticalAlign: 'text-bottom',
              color: 'var(--neutral-n2)',
              lineHeight: '20px',
            }}
          >
            {t('simultaneous_email_notification')}
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
