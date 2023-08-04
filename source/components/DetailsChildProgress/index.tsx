import styled from '@emotion/styled'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

const ProgressWrapBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .finish {
    font-size: 12px;
    color: var(--neutral-n2);
  }
`

const ProgressWrapLine = styled.div<{
  one: number
  tow: number
  three: number
}>`
  width: 100%;
  flex: 1;
  display: flex;
  div {
    border-radius: 8px;
    height: 8px;
  }
  .one {
    width: ${props => props.one}%;
    background: var(--function-success);
    margin-right: 4px;
  }
  .two {
    width: ${props => props.tow}%;
    background: var(--primary-d1);
    margin-right: 4px;
  }
  .three {
    width: ${props => props.three}%;
    background: var(--neutral-n8);
  }
`

interface DetailsChildProgressProps {
  details?: any
}

const DetailsChildProgress = (props: DetailsChildProgressProps) => {
  const [t] = useTranslation()
  return (
    <Tooltip
      title={`${t('completed1')} ${
        props.details.child_story_statistics?.finish_percent
      }%; ${t('inProgress')} ${
        props.details.child_story_statistics?.processing_percent
      }%; ${t('incomplete')} ${
        props.details.child_story_statistics?.start_percent
      }%`}
    >
      <ProgressWrapBox>
        <ProgressWrapLine
          one={props.details.child_story_statistics?.finish_percent}
          tow={props.details.child_story_statistics?.processing_percent}
          three={props.details.child_story_statistics?.start_percent}
        >
          <div className="one" />
          <div className="two" />
          <div className="three" />
        </ProgressWrapLine>
        <div className="finish">
          {t('completed1')}
          {props.details.child_story_statistics?.finish_percent}%
        </div>
      </ProgressWrapBox>
    </Tooltip>
  )
}

export default DetailsChildProgress
