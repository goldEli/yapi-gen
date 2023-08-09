import { Progress, Dropdown } from 'antd'
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
  percent?: number
  // 非表格时判断有无更新权限
  hasEdit?: boolean
}

const CommonProgress = (props: ProgressProps) => {
  const { isTable, isKanBan, id, type, percent, hasEdit } = props
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
    if (id) {
      getList()
    }
  }, [id])

  return (
    <>
      <CommonProgressWrap>
        <Dropdown
          overlayClassName="progressDropdownBox"
          getPopupContainer={(x: any) => x.parentNode}
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
          dropdownRender={
            // eslint-disable-next-line no-undefined
            data?.user_list?.length <= 0 ? () => <span /> : undefined
          }
        >
          {isKanBan ? (
            <div>{`${data?.total_schedule ?? 0}%`}</div>
          ) : isTable ? (
            <div style={{ width: 124, cursor: 'pointer' }}>
              <Progress
                percent={percent}
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
        {isTable || isKanBan
          ? null
          : hasEdit && (
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
          id={id}
          project_id={projectInfo?.id}
        />
      )}
    </>
  )
}

export default CommonProgress
