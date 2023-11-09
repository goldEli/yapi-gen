import { Switch, Tooltip } from 'antd'
import {
  PushConditionsWrap,
  SubTitleBox,
  PushConditionsContent,
  TableWrap,
  BlueText,
  GrayText,
} from '../style'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PreviewImageModal from './PreviewImageModal'
import SetDingTalkGroupModal from './SetDingTalkGroupModal'
import { useDispatch, useSelector } from '@store/index'
import { setProjectWarning } from '@store/project'

const PushChannel = () => {
  const [t] = useTranslation()
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [selectRecord, setSelectRecord] = useState<any>({})
  const [data, setData] = useState<any[]>([])
  const dispatch = useDispatch()
  const { projectWarning } = useSelector(store => store.project)
  useEffect(() => {
    setData(projectWarning?.push_channel ?? [])
    console.log(projectWarning?.push_channel)
  }, [projectWarning])
  // 文字
  const dataText = [
    {
      name: t('systemNotification'),
      sub: t(
        'aWindowWillBeDisplayedOnTheHomepageOfEachModuleUnderTheProjectToPromptTheAbove',
      ),
      type: 'sys',
    },
    {
      name: t('dingtalkNotifications'),
      sub: t('aboveInformationWillBePromptedInDingtalkGroupsBasedOn'),
      type: 'ding',
    },
    {
      name: t('notification'),
      sub: t('theAboveInformationWillBePromptedInEmailsOnA'),
      type: 'email',
    },
    {
      name: t('smsNotification'),
      sub: t('theAboveInformationWillBePromptedInTextMessagesOnA'),
      type: 'sms',
    },
  ]

  //   表格列
  const columns = [
    {
      title: t('pushType'),
      dataIndex: 'type',
      render: (text: string, record: any) => {
        return (
          <div>
            {dataText?.filter((i: any) => i.type === record.type)[0]?.name}
          </div>
        )
      },
    },
    {
      title: t('pushDescription'),
      dataIndex: 'desc',
      render: (text: string, record: any) => {
        return (
          <div>
            {dataText?.filter((i: any) => i.type === record.type)[0]?.sub}
          </div>
        )
      },
    },
    {
      title: t('operate'),
      dataIndex: 'operation',
      render: (text: string, record: any) => {
        return record.type === 'ding' ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <BlueText
              onClick={() => {
                setImageModalVisible(true)
                setSelectRecord(record)
              }}
            >
              {t('preview')}
            </BlueText>
            <BlueText
              style={{ margin: '0px 24px' }}
              onClick={() => {
                setVisible(true)
              }}
            >
              {t('setUpDingtalkGroup')}
            </BlueText>
            {data.find((s: any) => s.type === 'ding')?.other_config
              ?.group_name ? (
              <Tooltip
                title={
                  data.find((s: any) => s.type === record.type)?.other_config
                    ?.group_name
                }
              >
                <GrayText>
                  {
                    data.find((s: any) => s.type === record.type)?.other_config
                      ?.group_name
                  }
                </GrayText>
              </Tooltip>
            ) : null}
          </div>
        ) : (
          <BlueText
            onClick={() => {
              setImageModalVisible(true)
              setSelectRecord(record)
            }}
          >
            {t('preview')}
          </BlueText>
        )
      },
    },
    {
      title: t('whetherToEnable'),
      dataIndex: 'is_enable',
      render: (_: string, record: any) => {
        return (
          <Tooltip
            title={
              record.type === 'ding' &&
              !data.find((s: any) => s.type === 'ding')?.other_config
                ?.group_name
                ? t('pleaseSetUpADingtalkGroupFirst')
                : ''
            }
          >
            <Switch
              disabled={
                record.type === 'sys' ||
                (record.type === 'ding' &&
                  !data.find((s: any) => s.type === 'ding')?.other_config
                    ?.group_name)
              }
              checked={
                data.find((s: any) => s.type === record.type)?.is_enable === 1
              }
              onChange={(val: boolean) => {
                const temp = data.map((k: any) => {
                  if (k.type === record.type) {
                    return {
                      ...k,
                      is_enable: val ? 1 : 2,
                    }
                  }
                  return k
                })
                dispatch(
                  setProjectWarning({
                    ...projectWarning,
                    push_channel: temp,
                  }),
                )
              }}
            />
          </Tooltip>
        )
      },
    },
  ]

  return (
    <PushConditionsWrap>
      <SubTitleBox style={{ margin: '24px 0px 16px 0px' }}>
        {t('pushChannel')}
      </SubTitleBox>
      <PushConditionsContent>
        <TableWrap dataSource={data} columns={columns} pagination={false} />
      </PushConditionsContent>
      <PreviewImageModal
        type={selectRecord.type}
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
      />
      <SetDingTalkGroupModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        onConfirm={(other_config: any) => {
          const temp = data.map((k: any) => {
            if (k.type === 'ding') {
              return {
                ...k,
                other_config,
                is_enable:
                  !other_config?.group_name && !other_config?.web_hook
                    ? 2
                    : k.is_enable,
              }
            }
            return k
          })
          dispatch(
            setProjectWarning({
              ...projectWarning,
              push_channel: temp,
            }),
          )
          setVisible(false)
        }}
      />
    </PushConditionsWrap>
  )
}

export default PushChannel
