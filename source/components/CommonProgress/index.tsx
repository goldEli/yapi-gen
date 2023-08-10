import { Progress, Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import { CommonProgressWrap, UpdateButton, ItemRow } from './style'
import UpdateProgressModal from './UpdateProgressModal'
import CommonUserAvatar from '../CommonUserAvatar'
import { getStroySchedule } from '@/services/demand'
import { useTranslation } from 'react-i18next'

interface ProgressProps {
  isTable?: boolean
  isKanBan?: boolean
  type?: 'transaction' | 'demand' | 'flaw'
  // 当前事务|缺陷|需求id
  id?: number
  // 项目id
  project_id: number
  percent?: number
  // 非表格时判断有无更新权限
  hasEdit?: boolean
  update?: any
  // 更新进度后回调
  onConfirm?(): void
}

const CommonProgress = (props: ProgressProps) => {
  const {
    isTable,
    isKanBan,
    id,
    type,
    percent,
    hasEdit,
    update,
    onConfirm,
    project_id,
  } = props
  const [visible, setVisible] = useState(false)
  const [commonProgressVisible, setCommonProgressVisible] = useState(false)
  const [data, setData] = useState<any>(null)
  const [t]: any = useTranslation()
  const getList = async () => {
    const result = await getStroySchedule({
      id,
      project_id,
    })
    setData(result)
  }
  useEffect(() => {
    if (id && commonProgressVisible) {
      getList()
    }
  }, [id, update, commonProgressVisible])

  return (
    <>
      <CommonProgressWrap>
        <Dropdown
          onOpenChange={(open: boolean) => setCommonProgressVisible(open)}
          overlayClassName="progressDropdownBox_yang"
          overlayStyle={data?.user_list?.length <= 0 ? { height: 0 } : {}}
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
            data?.user_list?.length ? undefined : () => <span />
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
                format={percent => `${t('totalProgress')} ${percent}%`}
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
                {t('updateProgress')}
              </UpdateButton>
            )}
      </CommonProgressWrap>
      {isTable || isKanBan ? null : (
        <UpdateProgressModal
          type={type}
          visible={visible}
          onClose={() => setVisible(false)}
          id={id}
          project_id={project_id}
          onConfirm={onConfirm}
        />
      )}
    </>
  )
}

export default CommonProgress
