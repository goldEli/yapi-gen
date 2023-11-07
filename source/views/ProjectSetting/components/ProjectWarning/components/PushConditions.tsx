import { Input, InputNumber, Switch } from 'antd'
import {
  PushConditionsWrap,
  SubTitleBox,
  PushConditionsContent,
  TableItem,
  TableWrap,
} from '../style'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PushConditions = () => {
  const [t] = useTranslation()
  const [maxWidth, setMaxWidth] = useState<number>()
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
  const data = [
    {
      conditionCount: 3,
      thresholdCount: 2,
      isDisable: 1,
      type: 'task_soon_expired',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      isDisable: 1,
      type: 'task_expired',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      isDisable: 1,
      type: 'bug_soon_expired',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      isDisable: 2,
      type: 'bug_expired',
    },
    {
      conditionCount: 3,
      thresholdCount: 2,
      isDisable: 2,
      type: 'bug_too_many',
    },
  ]

  //   计算最大宽度
  const onComputedWidth = () => {}

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
      render: (text: string, record: any) => {
        return (
          <TableItem>
            <div>
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
            />
            天
          </TableItem>
        )
      },
    },
    {
      title: t('pushThreshold'),
      dataIndex: 'thresholdSub',
      render: (text: string, record: any) => {
        return (
          <TableItem>
            <div>
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
            />
            条
          </TableItem>
        )
      },
    },
    {
      title: t('whetherToEnable'),
      dataIndex: 'isDisable',
      render: (text: string, record: any) => {
        return <Switch checked={record.isDisable === 1} />
      },
    },
  ]
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
