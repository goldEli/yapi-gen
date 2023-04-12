import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import IconFont from '@/components/IconFont'

import { Badge, Radio } from 'antd'
import React, { useState } from 'react'
import {
  About,
  GrepContent,
  HoverWrap,
  Name,
  Time,
  Time2,
  Tip,
  Wrap,
  Wrap2,
} from './style'

const ContentItem = (props: any) => {
  const [choose, setChoose] = useState(false)

  return (
    <div>
      <Wrap onClick={() => setChoose(true)}>
        <div
          style={{
            marginRight: '12px',
          }}
        >
          <Badge offset={[-1, 4]} dot>
            <CommonUserAvatar />
          </Badge>
        </div>
        <HoverWrap style={{ flex: '1' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Name>{props.name}</Name>
            <Tip>在评论中@了您</Tip>
            <Time>2小时前</Time>
            <Time2>
              <Radio checked={choose} />
            </Time2>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', margin: '5px 0px' }}
          >
            <CommonIconFont color="var(--neutral-n3)" type="folder-open-nor" />
            <About>关于XXXX产品V3.0.0的开发计划</About>
          </div>

          <GrepContent>
            <span>关于XXXX产品V3.0.0的开发计划中千颂伊酱@了您，请</span>
            <span
              style={{
                color: 'var(--auxiliary-text-t1-d2)',
              }}
            >
              前往查看
            </span>
          </GrepContent>
        </HoverWrap>
      </Wrap>

      {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <Badge offset={[-1, 4]} dot>
          <CommonUserAvatar />
        </Badge>
        <span style={{ marginLeft: '8px' }}>来自 亿洋</span>
        <span
          style={{
            color: 'var(--auxiliary-text-t1-d2)',
          }}
        >
          另外 1 条消息
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <Badge offset={[-1, 4]} dot>
          <CommonUserAvatar />
        </Badge>
        <span
          style={{
            marginLeft: '8px',
            color: 'var(--auxiliary-text-t1-d2)',
          }}
        >
          收起
        </span>
      </div> */}
    </div>
  )
}

export default ContentItem
