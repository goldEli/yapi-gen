import { Switch } from 'antd'
import {
  PushConditionsWrap,
  SubTitleBox,
  PushConditionsContent,
  TableWrap,
  BlueText,
  GrayText,
} from '../style'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PreviewImageModal from './PreviewImageModal'
import SetDingTalkGroupModal from './SetDingTalkGroupModal'

const PushChannel = () => {
  const [t] = useTranslation()
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [selectRecord, setSelectRecord] = useState<any>({})
  const [maxWidth, setMaxWidth] = useState<number>()
  // 文字
  const dataText = [
    {
      name: '系统通知',
      sub: '会在项目下的每个模块首页进行弹窗提示以上信息',
      type: 'system',
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
      type: 'phone',
    },
  ]
  //   数据
  const data = [
    {
      isDisable: 1,
      isChecked: true,
      type: 'system',
    },
    {
      isDisable: 2,
      isChecked: false,
      type: 'ding',
    },
    {
      isDisable: 2,
      isChecked: false,
      type: 'email',
    },
    {
      isDisable: 2,
      isChecked: false,
      type: 'phone',
    },
  ]

  //   计算最大宽度
  const onComputedWidth = () => {}

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
      dataIndex: 'isChecked',
      render: (text: string, record: any) => {
        return (
          <Switch
            disabled={record.isDisable === 1}
            checked={record.isChecked}
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
        onConfirm={() => {}}
      />
    </PushConditionsWrap>
  )
}

export default PushChannel
