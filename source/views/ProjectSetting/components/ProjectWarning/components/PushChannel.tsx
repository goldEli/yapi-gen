import { Switch } from 'antd'
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
  const [data, setData] = useState([
    {
      is_enable: 1,
      type: 'sys',
    },
    {
      is_enable: 2,
      type: 'ding',
      other_config: {
        group_name: '',
        web_hook: '',
      },
    },
    {
      is_enable: 2,
      type: 'email',
    },
    {
      is_enable: 2,
      type: 'sms',
    },
  ])
  const dispatch = useDispatch()
  const { projectWarning } = useSelector(store => store.project)
  // 文字
  const dataText = [
    {
      name: '系统通知',
      sub: '会在项目下的每个模块首页进行弹窗提示以上信息',
      type: 'sys',
    },
    {
      name: '钉钉通知',
      sub: '会以项目为单位的钉钉群内提示以上信息',
      type: 'ding',
    },
    {
      name: '邮件通知',
      sub: '会以项目为单位的邮件内提示以上信息',
      type: 'email',
    },
    {
      name: '短信通知',
      sub: '会以项目为单位的短信内提示以上信息',
      type: 'sms',
    },
  ]

  //   表格列
  const columns = [
    {
      title: '推送类型',
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
      title: '推送描述',
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
      title: '操作',
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
              预览
            </BlueText>
            <BlueText
              style={{ margin: '0px 24px' }}
              onClick={() => {
                setVisible(true)
              }}
            >
              设置钉钉群
            </BlueText>
            <GrayText>已配置 iFUN 软件开发</GrayText>
          </div>
        ) : (
          <BlueText
            onClick={() => {
              setImageModalVisible(true)
              setSelectRecord(record)
            }}
          >
            预览
          </BlueText>
        )
      },
    },
    {
      title: t('whetherToEnable'),
      dataIndex: 'is_enable',
      render: (_: string, record: any) => {
        return (
          <Switch
            disabled={record.type === 'sys'}
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
              setData(temp)
            }}
          />
        )
      },
    },
  ]

  return (
    <PushConditionsWrap>
      <SubTitleBox style={{ margin: '24px 0px 16px 0px' }}>
        推送渠道
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
          setData(temp)
          setVisible(false)
        }}
      />
    </PushConditionsWrap>
  )
}

export default PushChannel
