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
        </Dropdown>

        <UpdateButton
          style={{ marginLeft: 16 }}
          onClick={() => setVisible(true)}
        >
          更新进度
        </UpdateButton>
      </CommonProgressWrap>
      <UpdateProgressModal
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  )
}

export default CommonProgress
