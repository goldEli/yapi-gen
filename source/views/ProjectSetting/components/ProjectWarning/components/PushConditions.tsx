import { Input, InputNumber, Switch } from 'antd'
import {
  PushConditionsWrap,
  SubTitleBox,
  PushConditionsContent,
  TableItem,
  TableWrap,
} from '../style'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { setProjectWarning } from '@store/project'
import { useDispatch, useSelector } from '@store/index'
import _ from 'lodash'
const PushConditions = () => {
  const [t] = useTranslation()
  const { language } = useSelector(store => store.global)
  const dispatch = useDispatch()
  const { projectWarning } = useSelector(store => store.project)
  const [maxWidth, setMaxWidth] = useState<number>()
  const [data, setData] = useState<any[]>([
    {
      conditionCount: 3,
      thresholdCount: 2,
      is_enable: 1,
      type: 'task_soon_expired',
      description: '',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      is_enable: 1,
      type: 'task_expired',
      description: '',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      is_enable: 1,
      type: 'bug_soon_expired',
      description: '',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      is_enable: 2,
      type: 'bug_expired',
      description: '',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      is_enable: 2,
      type: 'bug_too_many',
      description: '',
    },
  ])
  // 用于计算英文状态下的宽度
  const [clientWidth, setClientWidth] = useState(0)

  // 文字
  const dataText = [
    {
      name: t('taskIsAboutToExpire'),
      sub: t('theTaskIsAboutToExceedTheExpectedEndDateAndIsNotCompleted'),
      conditionSub: t('systemDateDistanceFromExpectedEndDate'),
      thresholdSub: t('theNumberOfOverdueTasksExceeds'),
      type: 'task_soon_expired',
    },
    {
      name: t('taskIsOverdue'),
      sub: t('tasksAreNotCompletedPastTheExpectedEndDate'),
      conditionSub: t('systemDateIsGreaterThanExpectedEndDate'),
      thresholdSub: t('theNumberOfOverdueTasksExceeds'),
      type: 'task_expired',
    },
    {
      name: t('bugIsAboutToExpire'),
      sub: t('bugIsAboutToExceedTheExpectedEndDateWithoutBeingFixed'),
      conditionSub: t('systemDateDistanceFromExpectedEndDate'),
      thresholdSub: t('theNumberOfOverdueRepairsExceeds'),
      type: 'bug_soon_expired',
    },
    {
      name: t('bugOverdue'),
      sub: t('theTaskExceedsTheExpectedEndDateAndRemainsUnrepaired'),
      conditionSub: t('systemDateIsGreaterThanExpectedEndDate'),
      thresholdSub: t('theNumberOfOverdueBugsExceeds'),
      type: 'bug_expired',
    },
    {
      name: t('tooManyBugs'),
      sub: t('thereAreTooManyBugsInTheProject'),
      conditionSub: t('howRecent'),
      thresholdSub: t('theNumberOfBugsExceeds'),
      type: 'bug_too_many',
    },
  ]
  //   数据

  //   表格列
  const columns = [
    {
      title: t('matterType'),
      dataIndex: 'name',
      render: (text: string, record: any) => {
        return (
          <div>
            {dataText?.filter((i: any) => i.type === record.type)[0]?.name}
          </div>
        )
      },
    },
    {
      title: t('descriptionOfTheMatter'),
      dataIndex: 'sub',
      render: (text: string, record: any) => {
        return (
          <div>
            {dataText?.filter((i: any) => i.type === record.type)[0]?.sub}
          </div>
        )
      },
    },
    {
      title: t('matterConditions'),
      dataIndex: 'conditionSub',
      render: (text: string, record: any, index: number) => {
        return (
          <TableItem>
            <div
              style={{
                width:
                  language === 'zh' ? 170 : clientWidth > 2195 ? 310 : '14vw',
              }}
            >
              {
                dataText?.filter((i: any) => i.type === record.type)[0]
                  ?.conditionSub
              }
            </div>
            <InputNumber
              min={1}
              max={999}
              step={1}
              className="input"
              value={record.conditionCount}
              onChange={(value: any) => {
                console.log(value, data, index)
                setData((pre: any) => {
                  const newData = _.cloneDeep(pre)
                  newData[index]['conditionCount'] = value
                  return newData
                })
                updateData()
              }}
            />
            {t('sky')}
          </TableItem>
        )
      },
    },
    {
      title: t('pushThreshold'),
      dataIndex: 'thresholdSub',
      render: (text: string, record: any, index: number) => {
        return (
          <TableItem>
            <div
              style={{
                width:
                  language === 'zh' ? 116 : clientWidth > 2195 ? 264 : '12vw',
              }}
            >
              {
                dataText?.filter((i: any) => i.type === record.type)[0]
                  ?.thresholdSub
              }
            </div>
            <InputNumber
              min={1}
              max={999}
              step={1}
              className="input"
              value={record.thresholdCount}
              onChange={(value: any) => {
                console.log(value, data, index)
                setData((pre: any) => {
                  const newData = _.cloneDeep(pre)
                  newData[index]['thresholdCount'] = value
                  return newData
                })
                updateData()
              }}
            />
            {t('strip')}
          </TableItem>
        )
      },
    },
    {
      title: t('whetherToEnable'),
      dataIndex: 'is_enable',
      render: (text: string, record: any, index: number) => {
        return (
          <Switch
            onChange={value => {
              setData((pre: any) => {
                const newData = _.cloneDeep(pre)
                newData[index]['is_enable'] = value
                return newData
              })
              updateData()
            }}
          />
        )
      },
    },
  ]
  const updateData = () => {
    dispatch(
      setProjectWarning({
        ...projectWarning,
        push_condition: data,
      }),
    )
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      setClientWidth(document.body.clientWidth)
    })
    return () => {
      window.addEventListener('resize', () => {
        setClientWidth(document.body.clientWidth)
      })
    }
  }, [])

  return (
    <PushConditionsWrap>
      <SubTitleBox style={{ margin: '24px 0px 16px 0px' }}>
        {t('pushConditions')}
      </SubTitleBox>
      <PushConditionsContent>
        <TableWrap dataSource={data} columns={columns} pagination={false} />
      </PushConditionsContent>
    </PushConditionsWrap>
  )
}
export default PushConditions
