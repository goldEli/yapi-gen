/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import styled from '@emotion/styled'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import {
  Divider,
  Space,
  Table,
  Tooltip,
  Switch,
  Radio,
  Select,
  Form,
} from 'antd'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import EditWorkflow from './components/EditWorkflow'
import { OmitText } from '@star-yun/ui'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import AddWorkflow from './components/AddWorkflow'

const Wrap = styled.div({
  padding: 16,
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const SetTitleWrap = styled.div({
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  fontSize: 12,
})

const BackWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: '#2877ff',
  fontWeight: 400,
  cursor: 'pointer',
})

const ContentWrap = styled.div({
  borderRadius: 6,
  background: 'white',
  width: '100%',
  height: 'calc(100% - 35px)',
  padding: 24,
  overflow: 'auto',
  position: 'relative',
})

const LabelWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 24,
  span: {
    marginLeft: 8,
    fontWeight: 500,
    fontSize: 14,
    color: '#323233',
  },
  '.provider': {
    height: 16,
    width: 3,
    background: '#2877ff',
  },
})

const CategoryWrap = styled.div<{ color: string; bgColor: string }>(
  {
    height: 22,
    borderRadius: 11,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '22px',
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 8,
  },
  ({ color, bgColor }) => ({
    background: bgColor,
    color,
  }),
)

const StepWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '24px 0',
})

const StepBoxWrap = styled.div<{ active?: boolean }>(
  {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    fontSize: 14,
    '.circle': {
      color: 'white',
      width: 27,
      height: 27,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    span: {
      marginLeft: 5,
    },
  },
  ({ active }) => ({
    '.circle': {
      background: active ? '#2877ff' : '#BBBDBF',
      border: active ? '3px solid #F0F4FA' : '3px solid white',
    },
    span: {
      color: active ? '#2877ff' : '#646566',
    },
  }),
)

const TableWrap = styled.div({
  width: '100%',
  maxHeight: 'calc(100% - 262px)',
  overflowY: 'auto',
})

const ViewWrap = styled.div<{ color: string }>(
  {
    height: 22,
    borderRadius: 6,
    padding: '0 8px',
    marginRight: 8,
    lineHeight: '20px',
    fontSize: 12,
    fontWeight: 400,
    width: 'fit-content',
    background: 'white',
  },
  ({ color }) => ({
    color,
    border: `1px solid ${color}`,
  }),
)

const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '24px 0 0 0',
  },
})

const HasDemandText = styled.div({
  marginTop: 8,
  color: '#FF5C5E',
  fontWeight: 400,
  fontSize: 12,
})

const SetBreadcrumb = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { projectInfo } = useModel('project')
  const paramsData = getParamsData(searchParams)
  const activeTabs = Number(paramsData.type) || 0

  const onBack = () => {
    navigate(-1)
  }

  const onToSet = () => {
    const params = encryptPhp(
      JSON.stringify({
        type: activeTabs,
        id: projectInfo.id,
        pageIdx: 'main',
      }),
    )
    navigate(`/Detail/Set?data=${params}`)
  }
  return (
    <SetTitleWrap>
      <BackWrap onClick={onBack}>
        <IconFont type="return" style={{ fontSize: 16, marginRight: 6 }} />
        <span>返回</span>
      </BackWrap>
      <Divider type="vertical" style={{ background: '#BBBDBF' }} />
      <div style={{ color: '#323233', cursor: 'pointer' }} onClick={onToSet}>
        需求设置
      </div>
      <IconFont type="right" style={{ color: '#323233', margin: '0 4px' }} />
      <div style={{ color: '#969799' }}>工作流设置</div>
    </SetTitleWrap>
  )
}

const data = [
  {
    key: '1',
    name: '实现中',
    color: '#43BA9A',
    remark: '说明文字内容说明文字内容说明文字内容说明文字内容说',
    endStatus: false,
    startStatus: true,
    index: 0,
    hasDemand: 3,
  },
  {
    key: '2',
    name: '已结束',
    color: '#969799',
    remark: '说明文字',
    endStatus: true,
    startStatus: false,
    index: 1,
    hasDemand: 0,
  },
  {
    key: '3',
    name: '规划中',
    color: '#FA9746',
    remark: '说明文字内容说',
    endStatus: true,
    startStatus: false,
    index: 2,
    hasDemand: 3,
  },
]

const categoryList = [
  {
    name: '软件需求',
    color: '#43BA9A',
    isDisable: true,
    id: 1,
    hasDemand: 2,
  },
  {
    name: '开发需求',
    color: '#43BA9A',
    isDisable: true,
    id: 2,
    hasDemand: 2,
  },
]

const Workflow = () => {
  const { colorList } = useModel('project')
  const [step, setStep] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isHasDelete, setIsHasDelete] = useState(false)
  const [operationObj, setOperationObj] = useState<any>({})
  const [form] = Form.useForm()

  const onCloseHasDelete = () => {
    setIsHasDelete(false)
  }

  const onConfirmHasDelete = async () => {

    //
  }

  const onDeleteConfirm = () => {

    //
  }

  const onConfirm = () => {

    //
  }

  const onClose = () => {
    setIsVisible(false)
  }

  const onClickOperation = (row: any, type: string) => {
    setOperationObj(row)
    if (type === 'edit') {
      setIsVisible(true)
    } else {
      Number(row.hasDemand) ? setIsHasDelete(true) : setIsDelVisible(true)
    }
  }

  const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      render: () => <IconFont type="move" />,
    },
    {
      title: '状态名称',
      dataIndex: 'name',
      render: (text: any, record: any) => <ViewWrap color={record?.color}>{text}</ViewWrap>
      ,
    },
    {
      title: '状态说明',
      dataIndex: 'remark',
      render: (text: any) => <OmitText width={300}>{text}</OmitText>,
    },
    {
      title: (
        <div>
          <span>起始状态</span>
          <Tooltip title="创建需求的默认状态">
            <IconFont
              style={{ marginLeft: 16, cursor: 'pointer' }}
              type="question"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'startStatus',
      render: (text: any) => <Radio defaultChecked={text} />,
    },
    {
      title: (
        <div>
          <span>结束状态</span>
          <Tooltip title="需求的终结状态，流转至当前状态，需求标题会灰色展示！">
            <IconFont
              style={{ marginLeft: 16, cursor: 'pointer' }}
              type="question"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: 'endStatus',
      render: (text: any) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked={text}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text: string, record: any) => (
        <Space size={16}>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}
            onClick={() => onClickOperation(record, 'edit')}
          >
            编辑
          </span>
          <span
            style={{ color: '#2877ff', cursor: 'pointer' }}
            onClick={() => onClickOperation(record, 'del')}
          >
            删除
          </span>
        </Space>
      ),
    },
  ]

  const onUpdate = () => {

    //
  }

  return (
    <Wrap>
      <AddWorkflow
        isVisible={isAddVisible}
        onUpdate={onUpdate}
        onClose={() => setIsAddVisible(false)}
      />
      <EditWorkflow
        category={categoryList}
        item={operationObj}
        isVisible={isVisible}
        onClose={onClose}
        onConfirm={onConfirm}
      />
      <DeleteConfirm
        text="确认删除需求状态？"
        isVisible={isDelVisible}
        onChangeVisible={() => setIsDelVisible(!isDelVisible)}
        onConfirm={onDeleteConfirm}
      />
      {isHasDelete && (
        <CommonModal
          isVisible={isHasDelete}
          onClose={onCloseHasDelete}
          title="历史数据迁移"
          onConfirm={onConfirmHasDelete}
        >
          <HasDemandText>{`共有${operationObj?.hasDemand}个需求当前处于【${operationObj?.name}】，删除状态后您需要为这些需求分配一个新的状态`}</HasDemandText>
          <FormWrap form={form} layout="vertical">
            {categoryList?.map(i => (
              <Form.Item
                key={i.id}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryWrap
                      style={{ marginRight: 8, marginLeft: 0 }}
                      color={i.color}
                      bgColor={
                        colorList?.filter(k => k.key === i.color)[0]?.bgColor
                      }
                    >
                      {i.name}
                    </CategoryWrap>
                    指定新状态
                  </div>
                }
              >
                <Select
                  placeholder="请选择"
                  showArrow
                  showSearch
                  getPopupContainer={node => node}
                  allowClear
                  optionFilterProp="label"
                />
              </Form.Item>
            ))}
          </FormWrap>
        </CommonModal>
      )}
      <SetBreadcrumb />
      <ContentWrap>
        <LabelWrap>
          <div className="provider" />
          <span>工作流设置</span>
          <CategoryWrap color="#43BA9A" bgColor="#EDF7F4">
            游戏开发
          </CategoryWrap>
        </LabelWrap>
        <StepWrap>
          <StepBoxWrap active={step === 1}>
            <div className="circle">1</div>
            <span>状态定义</span>
          </StepBoxWrap>
          <div
            style={{
              width: 160,
              height: 1,
              background: '#EBEDF0',
              margin: '0 8px',
            }}
          />
          <StepBoxWrap active={step === 2}>
            <div className="circle">2</div>
            <span>流转设置</span>
          </StepBoxWrap>
        </StepWrap>
        <div
          style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 24 }}
        >
          <Button
            style={{ background: '#F0F4FA', color: '#2877ff' }}
            icon={<IconFont type="plus" />}
            onClick={() => setIsAddVisible(true)}
          >
            添加状态
          </Button>
          <span style={{ color: '#969799', fontSize: 12, marginLeft: 8 }}>
            支持添加、编辑和删除工作流状态
          </span>
        </div>
        <TableWrap>
          <Table
            pagination={false}
            dataSource={data}
            columns={columns}
            rowKey="index"
          />
        </TableWrap>
        <div style={{ marginTop: 8, color: '#969799', fontSize: 12 }}>
          注：拖动图标可以调整状态顺序哦。（状态的顺序会体现在流转时状态的展现和列表排序中。）
        </div>
        <Space size={16} style={{ position: 'absolute', bottom: 24 }}>
          <Button type="primary">保存&下一步</Button>
          <Button>取消</Button>
        </Space>
      </ContentWrap>
    </Wrap>
  )
}

export default Workflow
