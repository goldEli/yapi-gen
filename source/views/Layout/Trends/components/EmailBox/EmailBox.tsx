import styled from '@emotion/styled'
import React, { ReactNode } from 'react'

const Box = styled.div`
  border-radius: 6px;
  border: 1px solid var(--neutral-n6-d1);
`
const GrepBox = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  background: var(--neutral-n10);
  padding: 16px 24px;
  border-radius: 6px 6px 0 0;
`

interface EmailBoxProps {
  t1: string
  t2: string
  children?: ReactNode
  style?: React.CSSProperties
}

const EmailBox = (props: EmailBoxProps) => {
  const { t1, t2, children } = props
  return (
    <Box style={{ ...props.style }}>
      <GrepBox>
        <span
          style={{
            fontFamily: 'SiYuanMedium',
            color: 'var(--neutral-n1-d1)',
            marginRight: '12px',
            fontSize: '16px',
          }}
        >
          {t1}
        </span>
        <span style={{ color: 'var(--neutral-n3)', fontSize: '12px' }}>
          {t2}
        </span>
      </GrepBox>
      <div>{children}</div>
    </Box>
  )
}

export default EmailBox
