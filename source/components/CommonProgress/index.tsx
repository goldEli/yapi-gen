import { Progress, Dropdown } from 'antd'
import { useEffect, useMemo, useState } from 'react'
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
  // 是否是表格上的进度操作
  isTableOperation?: boolean
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
  const [t, i18n]: any = useTranslation()
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

  const getRightDistance = useMemo(() => {
    if (percent === 100) {
      if (i18n.language === 'zh') {
        return 70
      }
      return 120
    }
    if (i18n.language === 'zh') {
      return 52
    }
    return 105
  }, [i18n.language, percent])

  return (
    <>
      <CommonProgressWrap
        style={{
          padding: props.isTableOperation ? 0 : '0px 24px 0px 0px',
        }}
      >
        {/* 不是列表操作栏的进度 */}
        {!props.isTableOperation && (
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
                          Math.floor((k.task_time / 3600) * 100) / 100
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
              <div>{`${percent ?? 0}%`}</div>
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
              <div
                style={{
                  width: 222,
                  marginRight: getRightDistance,
                  cursor: 'pointer',
                }}
              >
                <Progress
                  percent={percent}
                  strokeColor="var(--function-success)"
                  style={{ color: 'var(--function-success)' }}
                  format={percent => `${t('totalProgress')} ${percent}%`}
                  type="line"
                  strokeWidth={8}
                />
              </div>
            )}
          </Dropdown>
        )}

        {/* 列表上的操作进度 */}
        {props.isTableOperation ? (
          <span onClick={() => setVisible(true)}>
            {t('progressAndWorkingHours')}
          </span>
        ) : (
          <>
            {isTable || isKanBan
              ? null
              : hasEdit && (
                  <UpdateButton onClick={() => setVisible(true)}>
                    {t('updateProgress')}
                  </UpdateButton>
                )}
          </>
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
