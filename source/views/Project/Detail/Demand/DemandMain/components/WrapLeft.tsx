/* eslint-disable no-negated-condition */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable multiline-ternary */
/* eslint-disable no-undefined */
/* eslint-disable consistent-return */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Form, Input, Popover, Tooltip, Tree } from 'antd'
import { useEffect, useState, useContext } from 'react'
import {
  getTreeList,
  addTreeList,
  delTreeList,
  moveTreeList,
} from '@/services/project/tree'
import { TreeContext } from '../index'
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import { css } from '@emotion/css'
import { getIsPermission } from '@/tools'
import { useModel } from '@/models'

const Left = styled.div`
  height: calc(100vh - 64px);
  background-color: #fff;
  position: relative;
  /* float: left; */
`

const TitleWrap = styled.div({
  whiteSpace: 'nowrap',
  fontSize: 14,
  color: '#323233',
  lineHeight: '52px',
  fontWeight: 'bold',
})

interface Props {
  isShowLeft: boolean
  projectId: any
}
const TreeBox = styled.div`
  width: 100% !important;
  height: 40px;
  /* background: #f0f4fa; */
  border-radius: 0px 0px 0px 0px;
  /* color: green;
  border-left: 5px solid currentColor;
  box-shadow: 5px 5px 10px currentColor; */
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  &:hover {
    [data] {
      visibility: visible;
    }
  }
`
const FormBox = styled.div``
const BtnsItemBox = styled.div`
  cursor: pointer;
  width: 102px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px 0px 0px 0px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #646566;
  &:hover {
    background: #f0f4fa;
    color: #2877ff;
  }
`
const centerText = css`
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: 10px;
  /* margin-right: auto; */
`
const rightText = css`
  box-sizing: border-box;
  visibility: hidden;
  /* margin-left: 10px; */
  font-size: 16px;
  margin-left: 30px;
  color: #969799;
  &:hover {
    color: #2877ff;
  }
`
const TreeItem = (props: any) => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visibleEditText, setVisibleEditText] = useState('')
  const { projectInfo } = useModel('project')
  const btnsText = [
    {
      id: 1,
      text: '创建子分类',
    },
    {
      id: 2,
      text: '修改子分类',
    },
    {
      id: 3,
      text: '删除子分类',
    },
  ]
  const close = () => {
    setVisible(false)
    setVisibleEdit(false)
    form.resetFields()
  }
  const showVisible = (id: number) => {
    close()
    if (id === 3) {
      setVisible(true)
    } else if (id === 1) {
      setVisibleEditText('add')
      setVisibleEdit(true)
    } else if (id === 2) {
      setVisibleEditText('edit')
      setVisibleEdit(true)
      form.setFieldsValue({
        name: props.name,
        remark: props.remark,
      })
    }
  }
  const onChangeVisible = () => {
    close()
  }

  const onConfirm = async () => {
    await delTreeList({
      projectId: props.projectId,
      id: props.id,
    })

    close()
    props.onRest()
    form.resetFields()
  }

  const editClose = () => {
    close()
    props.onRest()
    form.resetFields()
  }

  const editConfirm = async () => {
    const tag = visibleEditText === 'add'
    const data = form.getFieldsValue()
    const obj = {
      name: data.name,
      remark: data.remark,
      projectId: props.projectId,
      pid: tag ? props.id : undefined,
      id: tag ? undefined : props.id,
    }

    await addTreeList(obj, visibleEditText)

    close()
    props.onRest()
  }
  const content = (
    <div>
      {props.pid === 1
        ? btnsText
          .filter(item => item.id === 1)
          .map(item => (
            <BtnsItemBox onClick={() => showVisible(item.id)} key={item.id}>
              {item.text}
            </BtnsItemBox>
          ))
        : btnsText.map(item => (
          <BtnsItemBox onClick={() => showVisible(item.id)} key={item.id}>
            {item.text}
          </BtnsItemBox>
        ))}
    </div>
  )
  return (
    <TreeBox>
      <span
        style={{
          whiteSpace: 'nowrap',

          // overflow: 'hidden',
          // textOverflow: ' ellipsis',
          // width: '60px',
        }}
      >
        {/* <Tooltip title={props.name}>{props.name}</Tooltip> */}
        {props.name}
      </span>
      <span className={centerText}>{props.story_count}</span>
      {props.pid === 0
      || getIsPermission(
        projectInfo?.projectPermissions,
        'b/project/story/class',
      )
        ? ''
        : (
            <Popover
              getPopupContainer={node => node}
              placement="bottomRight"
              content={content}
              trigger="hover"
            >
              <IconFont data-tree className={rightText} type="more" />
            </Popover>
          )}

      <DeleteConfirm
        isVisible={visible}
        onChangeVisible={onChangeVisible}
        onConfirm={onConfirm}
        text="确认删除该分类？"
      />
      <CommonModal
        title={visibleEditText === 'add' ? '创建子分类' : '修改子分类'}
        isVisible={visibleEdit}
        onClose={editClose}
        onConfirm={editConfirm}
      >
        <FormBox>
          <Form form={form} layout="vertical">
            <Form.Item
              label="分类名称"
              name="name"
              rules={[{ required: true, message: '' }]}
            >
              <Input maxLength={10} placeholder="请输入分类名称" />
            </Form.Item>
            <Form.Item name="remark" label="分类说明">
              <Input.TextArea
                maxLength={200}
                showCount
                placeholder="请输入分类描述内容"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Form>
        </FormBox>
      </CommonModal>
    </TreeBox>
  )
}

const WrapLeft = (props: Props) => {
  const context: any = useContext(TreeContext)
  const [treeData, setTreeData] = useState<any>([])
  const init = async () => {
    const res = await getTreeList({ id: props.projectId })

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setTreeData(filterTreeData(res))
  }

  function filterTreeData(data: any) {
    const newData = data.map((item: any) => ({
      title: (
        <TreeItem
          onRest={() => {
            init()
          }}
          projectId={props.projectId}
          {...item}
        />
      ),
      children:
        item.children && item.children.length
          ? filterTreeData(item.children)
          : null,
    }))
    return newData
  }
  const onDrop = async (info: any) => {
    const onlyID: any = treeData[0].children[0].title.props.id
    const onlySort: any = treeData[0].children[0].title.props.sort
    const start = info.dragNode.title.props
    const end = info.node.title.props
    const isDropToGap = info.dropToGap

    // console.log(info, '信息')
    // console.log(isDropToGap, '是否间隙')

    // console.log(start, '起点')
    // console.log(end, '终点')

    if (start.pid === 0) {
      return
    }

    if (end.pid === 1) {
      await moveTreeList({
        projectId: props.projectId,
        newId: onlyID,
        sort: onlySort,
        id: start.id,
        pid: start.id,
      })
    } else if (isDropToGap) {
      if (end.pid === 0) {
        await moveTreeList({
          projectId: props.projectId,

          id: start.id,
        })
      } else {
        if (end.pid === 0) {
          return
        }
        await moveTreeList({
          projectId: props.projectId,
          newId: end.id,
          sort: end.sort,
          id: start.id,
          pid: end.id,
        })
      }
    } else {
      if (end.pid === 0) {
        return
      }
      await moveTreeList({
        projectId: props.projectId,
        id: start.id,
        pid: end.id,
      })
    }

    init()
  }

  const onSelect = (selectedKeys: any, e: any) => {
    const {
      node: {
        title: { props: selectLine },
      },
    } = e

    context.changeKey(selectLine.id)

    // console.log(selectLine)
  }

  useEffect(() => {
    init()
  }, [])
  if (props.isShowLeft) {
    return (
      <Left>
        <div className="resize_bar" />
        <div className="resize_line" />
        <div className="resize_save">
          <TitleWrap>需求分类</TitleWrap>
          {treeData.length > 0 && (
            <Tree
              defaultExpandAll
              onDrop={onDrop}
              onSelect={onSelect}
              draggable
              treeData={treeData}
            />
          )}
        </div>
      </Left>
    )
  }
  return null
}

export default WrapLeft
