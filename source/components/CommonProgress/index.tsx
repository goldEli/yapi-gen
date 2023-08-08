import { Dropdown, Progress } from 'antd'
import { useEffect, useState } from 'react'
import { CommonProgressWrap, UpdateButton, ItemRow } from './style'
import UpdateProgressModal from './UpdateProgressModal'
import CommonUserAvatar from '../CommonUserAvatar'
import { getStroySchedule } from '@/services/demand'
import { useSelector } from '@store/index'

interface ProgressProps {
  isTable?: boolean
  isKanBan?: boolean
  type?: 'transaction' | 'demand' | 'flaw'
  // 当前事务|缺陷|需求id
  id?: number
}

const CommonProgress = (props: ProgressProps) => {
  const { isTable, isKanBan, id, type } = props
  const [visible, setVisible] = useState(false)
  const { projectInfo } = useSelector(store => store.project)
  const [data, setData] = useState<any>(null)
  const getList = async () => {
    const result = await getStroySchedule({
      id,
      project_id: projectInfo?.id,
    })
    setData(result)
  }
  useEffect(() => {
    getList()
  }, [id])

  return (
    <>
      <CommonProgressWrap>
        <Dropdown
          menu={{
            items:
              data?.user_list?.map((k: any) => ({
                key: k?.user_name,
                label: (
                  <ItemRow>
                    <CommonUserAvatar
                      isBorder
                      name={`${k?.user_name}${
                        k?.position_name ? `（${k?.position_name}）` : ''
                      }- ${k?.schedule ?? 0}% ${
                        Number(((k?.task_time ?? 0) / 3600).toFixed(1)) * 100
                      }h`}
                      avatar={k?.avatar}
                    />
                  </ItemRow>
                ),
              })) ?? [],
          }}
          placement="bottom"
        >
          {isKanBan ? (
            <div>{`${data?.total_schedule ?? 0}%`}</div>
          ) : isTable ? (
            <div style={{ width: 124, cursor: 'pointer' }}>
              <Progress
                percent={data?.total_schedule ?? 0}
                strokeColor="var(--function-success)"
                style={{ color: 'var(--function-success)', fontSize: 12 }}
                format={percent => `${percent}%`}
                type="line"
                strokeWidth={4}
              />
            </div>
          ) : (
            <div style={{ width: 222, marginRight: 40, cursor: 'pointer' }}>
              <Progress
                percent={data?.total_schedule ?? 0}
                strokeColor="var(--function-success)"
                style={{ color: 'var(--function-success)' }}
                format={percent => `总进度 ${percent}%`}
                type="line"
                strokeWidth={8}
              />
            </div>
          )}
        </Dropdown>
        {isTable || isKanBan ? null : (
          <UpdateButton
            style={{ marginLeft: 16 }}
            onClick={() => setVisible(true)}
          >
            更新进度
          </UpdateButton>
        )}
      </CommonProgressWrap>
      {isTable || isKanBan ? null : (
        <UpdateProgressModal
          type={type}
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  )
}

export default CommonProgress
