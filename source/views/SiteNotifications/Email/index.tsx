import CommonButton from '@/components/CommonButton'
import CommonIconFont from '@/components/CommonIconFont'
import { Breadcrumb, Select, Switch } from 'antd'
import React, { useState } from 'react'
import { First, Wrap } from '../Setting/style'
import {
  ActiveContentEmail2,
  Content,
  Content1,
  ContentEmail,
  ContentEmail2,
} from './style'
import { useTranslation } from 'react-i18next'

const items = [
  {
    id: '1',
    text: '待办',
  },
  {
    id: '2',
    text: '待办',
  },
  {
    id: '3',
    text: '待办',
  },
  {
    id: '4',
    text: '待办',
  },
  {
    id: '5',
    text: '待办',
  },
  {
    id: '6',
    text: '待办',
  },
  {
    id: '7',
    text: '待办',
  },
]

const Email = () => {
  const [t] = useTranslation()
  const [choose, setChoose] = useState<any>([])
  const [active, setActive] = useState<any>(true)
  const onChange = (checked: boolean) => {
    setActive(checked)
  }

  const onChoose = (id: any) => {
    if (choose.includes(id)) {
      setChoose(choose.filter((i: any) => i !== id))
    } else {
      setChoose([...choose, id])
    }
  }

  return (
    <Wrap>
      <First>
        <Breadcrumb
          separator={
            <CommonIconFont
              type="right"
              size={14}
              color="var(--neutral-n1-d1)"
            />
          }
        >
          <Breadcrumb.Item>
            <span style={{ color: 'var(--neutral-n1-d1)' }}>
              {' '}
              {t('notification')}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('email_notification')}</Breadcrumb.Item>
        </Breadcrumb>
        {active ? (
          <CommonButton type="primary">
            <span>{t('common.save')}</span>
          </CommonButton>
        ) : null}
      </First>
      <Content>
        <Content1>
          {t(
            'ReceiveEmailUpdatesWithMentionsInvitationsAndCommentsAboutItemsYouCareAbout',
          )}
          <span style={{ marginLeft: '250px' }}>
            <Switch checked={active} onChange={onChange} />
          </span>
        </Content1>
        {active ? (
          <ActiveContentEmail2 active={active}>
            <Content1>
              {t('use_this_email_to_receive')}
              <ContentEmail>XXXX@ifudsds n.com</ContentEmail>
            </Content1>
            <Content1>{t('receive_format')}</Content1>
            <div>
              <Select
                defaultValue="lucy"
                style={{ width: 320 }}
                options={[
                  {
                    value: 'jack',
                    label: 'HTML',
                  },
                  {
                    value: 'lucy',
                    label: '文本',
                  },
                ]}
              />
            </div>
            <Content1>
              {t('what_situations_require_email_notification')}
            </Content1>
            <div>
              {items.map((i: any) => (
                <ContentEmail2
                  active={choose.includes(i.id)}
                  onClick={() => onChoose(i.id)}
                  key={i.id}
                >
                  {i.text}
                </ContentEmail2>
              ))}
            </div>
          </ActiveContentEmail2>
        ) : null}
      </Content>
    </Wrap>
  )
}

export default Email
