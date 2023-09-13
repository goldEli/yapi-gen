/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-leaked-render */
import { useTranslation } from 'react-i18next'
import {
  ArrorBox,
  ArrorItem,
  LineBoxTitle2,
  TimelineWrap,
  VerifyTitle,
} from '../style'
import { Timeline } from 'antd'
import IconFont from '@/components/IconFont'
import StateTag from '@/components/StateTag'
import CommonUserAvatar from '@/components/CommonUserAvatar'

interface Props {
  configData: any
  checkStatusItem: Model.Project.CheckStatusItem
}

const WanderVerify = (props: Props) => {
  const [t] = useTranslation()
  return (
    <>
      {props.configData?.is_verify &&
        props.configData.verify.verify_type === 1 && (
          <div>
            <VerifyTitle>{t('newlyAdd.reviewProcess')}</VerifyTitle>

            <TimelineWrap>
              {props.configData?.verify.process.map((item2: any) => (
                <Timeline.Item key={item2}>
                  <div>
                    <div style={{ display: 'flex' }}>
                      <LineBoxTitle2>
                        {t('newlyAdd.reviewPerson')}
                      </LineBoxTitle2>
                    </div>

                    <ArrorBox>
                      {item2.verify_users.map((item: any, index: any) => (
                        <div
                          key={item}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: 8,
                          }}
                        >
                          <CommonUserAvatar name={item.name} />
                          {index !== item2.verify_users?.length - 1 && (
                            <IconFont
                              style={{
                                fontSize: 16,
                                margin: '0 8px',
                                color: 'var(--neutral-n4)',
                                position: 'relative',
                                top: '0px',
                              }}
                              type={
                                item2.operator === 1
                                  ? 'right'
                                  : item2.operator === 2
                                  ? 'and'
                                  : 'line'
                              }
                            />
                          )}
                        </div>
                      ))}
                    </ArrorBox>
                  </div>
                </Timeline.Item>
              ))}
              <Timeline.Item>
                <div>
                  <div style={{ display: 'flex' }}>
                    <LineBoxTitle2>{t('newlyAdd.circulationTo')}</LineBoxTitle2>
                    <StateTag
                      name={props.checkStatusItem.content}
                      state={
                        props.checkStatusItem?.is_start === 1 &&
                        props.checkStatusItem?.is_end === 2
                          ? 1
                          : props.checkStatusItem?.is_end === 1 &&
                            props.checkStatusItem?.is_start === 2
                          ? 2
                          : props.checkStatusItem?.is_start === 2 &&
                            props.checkStatusItem?.is_end === 2
                          ? 3
                          : 0
                      }
                    />
                  </div>
                </div>
              </Timeline.Item>
            </TimelineWrap>
          </div>
        )}
    </>
  )
}

export default WanderVerify
