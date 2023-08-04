import { Dropdown, Progress } from 'antd'
import { useState } from 'react'
import { CommonProgressWrap, UpdateButton } from './style'
import UpdateProgressModal from './UpdateProgressModal'
import { ItemRow } from '../MultipleAvatar/styled'
import CommonUserAvatar from '../CommonUserAvatar'

interface ProgressProps {
  isTable: boolean
}

const CommonProgress = (props: ProgressProps) => {
  const { isTable } = props
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
          {isTable ? (
            <div style={{ width: 196, marginRight: 40 }}>
              <Progress
                showInfo={false}
                percent={20}
                strokeColor="var(--function-success)"
                style={{ color: 'var(--function-success)' }}
                format={percent => `总进度 ${percent}%`}
                type="line"
              />
            </div>
          ) : (
            <div style={{ width: 124 }}>
              <Progress
                percent={20}
                strokeColor="var(--function-success)"
                style={{ color: 'var(--function-success)' }}
                format={percent => `${percent}%`}
                type="line"
                strokeWidth={4}
              />
            </div>
          )}
        </Dropdown>
        {isTable ? null : (
          <UpdateButton
            style={{ marginLeft: 16 }}
            onClick={() => setVisible(true)}
          >
            更新进度
          </UpdateButton>
        )}
      </CommonProgressWrap>
      {isTable ? null : (
        <UpdateProgressModal
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </>
  )
}

export default CommonProgress
