/* eslint-disable no-undefined */
/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import { Checkbox } from 'antd'
import { useEffect, useState } from 'react'
import Addperson from '@/views/WorkReport/Formwork/Addperson'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '@store/index'

const AcceptorSelection = (props: any) => {
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
      d1 = [...val1]
    }

    props.onChange({
      member: d1,

      isEmail,
    })
  }

  useEffect(() => {
    setIsEmail(props?.value?.isEmail)
    setPerson1(props?.value?.member ? props?.value?.member : [])
  }, [props.value])

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
        data={props.data}
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
