import { Dropdown, Progress } from 'antd'
import { useState } from 'react'
import { CommonProgressWrap, UpdateButton, ItemRow } from './style'
import UpdateProgressModal from './UpdateProgressModal'
import CommonUserAvatar from '../CommonUserAvatar'

interface ProgressProps {
  isTable?: boolean
  percent: number
  isKanban?: boolean
}

const CommonProgress = (props: ProgressProps) => {
  const { isTable, percent, isKanban } = props
  const [visible, setVisible] = useState(false)
  const items = [
    {
      key: '1',
      label: (
        <ItemRow>
          <CommonUserAvatar
            isBorder
            name="李钟硕 (前端开发) - 50% 3h"
            avatar={''}
          />
        </ItemRow>
      ),
    },
    {
      key: '2',
      label: (
        <ItemRow>
          <CommonUserAvatar
            isBorder
            name="杨一 (前端开发) - 50% 3h"
            avatar={''}
          />
        </ItemRow>
      ),
    },
  ]
  return (
    <>
      <CommonProgressWrap>
        <Dropdown menu={{ items }} placement="bottom">
          {isKanban ? (
            <div>70%</div>
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
                percent={20}
                strokeColor="var(--function-success)"
                style={{ color: 'var(--function-success)' }}
                format={percent => `总进度 ${percent}%`}
                type="line"
                strokeWidth={8}
              />
            </div>
          )}
        </Dropdown>
        {isTable || isKanban ? null : (
          <UpdateButton
            style={{ marginLeft: 16 }}
            onClick={() => setVisible(true)}
          >
            更新进度
          </UpdateButton>
        )}
      </CommonProgressWrap>
      {isTable || isKanban ? null : (
        <UpdateProgressModal
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  )
}

export default CommonProgress
