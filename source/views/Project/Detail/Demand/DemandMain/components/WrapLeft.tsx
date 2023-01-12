/* eslint-disable require-unicode-regexp */
// 需求主页-左侧需求分类
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-duplicate-imports */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import styled from '@emotion/styled'
import { Form, Input, message, Popover, Tree } from 'antd'
import {
  useEffect,
  useState,
  useContext,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
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
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from '../../../../../../../store'
import { changeId } from '../../../../../../../store/counterSlice'

const Left = styled.div`
  height: calc(100vh - 64px);
  background-color: #fff;
  position: relative;
`

const TitleWrap = styled.div({
  paddingLeft: '15px',
  whiteSpace: 'nowrap',
  fontSize: 14,
  color: '#323233',
  lineHeight: '52px',
  fontWeight: 'bold',
})

const TreeBox = styled.div`
  width: 100% !important;
  height: 40px;
  border-radius: 0px 0px 0px 0px;
  display: flex;
  align-items: center;
`
const FormBox = styled.div`
  padding-right: 20px;
`
const BtnsItemBox = styled.div`
  cursor: pointer;
  min-width: 102px;
  padding: 0px 10px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: start;
  border-radius: 0px 0px 0px 0px;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #646566;
  &:hover {
    background: #f4f5f5;
    color: #323233;
  }
`
const centerText = css`
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: 10px;
`
const rightText = css`
  box-sizing: border-box;
  visibility: hidden;
  font-size: 16px;
  margin-left: auto;
  color: #969799;
  &:hover {
    color: #2877ff;
  }
`
const TreeItem = (props: any) => {
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visiblePop, setVisiblePop] = useState(false)
  const [visibleEditText, setVisibleEditText] = useState('')
  const { projectInfo } = useModel('project')
  const btnsText = [
    {
      id: 1,
      text: t('newlyAdd.createChildClass'),
    },
    {
      id: 2,
      text: t('newlyAdd.editChildClass'),
    },
    {
      id: 3,
      text: t('newlyAdd.deleteChildClass'),
    },
  ]
  const close = () => {
    setVisible(false)
    setVisibleEdit(false)
    form.resetFields()
  }
  const showVisible = (id: number) => {
    setVisiblePop(false)
    close()
    setVisiblePop(false)
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
    setTimeout(() => {
      inputRefDom.current?.focus()
    }, 100)
  }
  const onChangeVisible = () => {
    close()
  }

  // 删除需求分类确认
  const onConfirm = async () => {
    const news = await delTreeList({
      projectId: props.projectId,
      id: props.id,
    })
    if (news.code === 0) {
      message.success(t('common.deleteSuccess'))
    }
    close()
    props.onRest()
    form.resetFields()
  }

  // 编辑分类关闭
  const editClose = () => {
    close()
    props.onRest()
    form.resetFields()
  }

  // 编辑分类确认
  const editConfirm = async () => {
    const tag = visibleEditText === 'add'
    const data: any = await form.validateFields()
    const obj = {
      name: data.name,
      remark: data.remark,
      projectId: props.projectId,
      pid: tag ? props.id : undefined,
      id: tag ? undefined : props.id,
    }

    const news = await addTreeList(obj, visibleEditText)

    if (news.code === 0) {
      tag
        ? message.success(t('common.createSuccess'))
        : message.success(t('common.editSuccess'))
    }

    close()
    props.onRest()
  }

  const content = (
    <div
      style={{
        padding: '10px 0px',
        whiteSpace: 'nowrap',
      }}
    >
      {props.pid === 1
        ? btnsText
            .filter(item => item.id === 1)
            .map(item => (
              <BtnsItemBox
                onClick={(e: any) => {
                  e.stopPropagation()
                  showVisible(item.id)
                }}
                key={item.id}
              >
                {item.text}
              </BtnsItemBox>
            ))
        : props.level === 4
        ? btnsText
            .filter(item => item.id !== 1)
            .map(item => (
              <BtnsItemBox
                onClick={(e: any) => {
                  e.stopPropagation()
                  showVisible(item.id)
                }}
                key={item.id}
              >
                {item.text}
              </BtnsItemBox>
            ))
        : btnsText.map(item => (
            <BtnsItemBox
              onClick={(e: any) => {
                e.stopPropagation()
                showVisible(item.id)
              }}
              key={item.id}
            >
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
        }}
      >
        {props.name}
      </span>
      <span className={centerText}>{props.story_count}</span>
      {props.pid === 0 ||
      getIsPermission(
        projectInfo?.projectPermissions,
        'b/project/story/class',
      ) ? (
        ''
      ) : (
        <Popover
          visible={visiblePop}
          getPopupContainer={node => node}
          onVisibleChange={visible1 => setVisiblePop(visible1)}
          placement="bottomRight"
          content={content}
          trigger="hover"
        >
          <IconFont
            onClick={(e: any) => {
              e.stopPropagation()
              setVisiblePop(true)
            }}
            data-tree
            className={rightText}
            type="more"
          />
        </Popover>
      )}

      <div
        onClick={(e: any) => {
          e.stopPropagation()
        }}
      >
        <DeleteConfirm
          isVisible={visible}
          onChangeVisible={onChangeVisible}
          onConfirm={onConfirm}
          text={t('newlyAdd.confirmDelClass')}
        />
      </div>
      <div
        onClick={(e: any) => {
          e.stopPropagation()
        }}
      >
        <CommonModal
          title={
            visibleEditText === 'add'
              ? t('newlyAdd.createChildClass')
              : t('newlyAdd.editChildClass')
          }
          isVisible={visibleEdit}
          onClose={editClose}
          onConfirm={editConfirm}
        >
          <FormBox>
            <Form form={form} layout="vertical">
              <Form.Item
                label={t('newlyAdd.className')}
                name="name"
                rules={[{ required: true, message: '' }]}
                getValueFromEvent={event => {
                  // eslint-disable-next-line require-unicode-regexp
                  return event.target.value.replace(
                    /(?<start>^\s*)|(?<end>\s*$)/g,
                    '',
                  )
                }}
              >
                <Input
                  ref={inputRefDom as any}
                  allowClear
                  autoComplete="off"
                  maxLength={10}
                  placeholder={t('newlyAdd.pleaseClassName')}
                />
              </Form.Item>
              <Form.Item
                getValueFromEvent={event => {
                  return event.target.value.replace(
                    /(?<start>^\s*)|(?<end>\s*$)/g,
                    '',
                  )
                }}
                name="remark"
                label={t('newlyAdd.classRemark')}
              >
                <Input.TextArea
                  maxLength={100}
                  showCount
                  allowClear
                  placeholder={t('newlyAdd.pleaseClassRemark')}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </Form.Item>
            </Form>
          </FormBox>
        </CommonModal>
      </div>
    </TreeBox>
  )
}

const WrapLeft = (props: any, ref: any) => {
  const { value: valueId } = useSelector(store => store.counter)
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const context: any = useContext(TreeContext)
  const [treeData, setTreeData] = useState<any>([])
  const [show, setShow] = useState<any>(false)
  const { setSelectTreeData, getProjectInfoValues } = useModel('project')

  const init = async () => {
    setShow(false)
    const res = await getTreeList({ id: props.projectId })
    setSelectTreeData(filterTreeData2(res)[0].children)
    setTreeData(filterTreeData(res))
    setShow(true)
  }

  function filterTreeData(data: any) {
    const newData = data.map((item: any) => ({
      key: item.key,
      title: (
        <TreeItem
          onRest={() => {
            init()
            getProjectInfoValues({ projectId: props.projectId })
            props.onUpdate()
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

  function filterTreeData2(data: any) {
    const newData = data.map((item: any) => ({
      value: item.key,
      label: item.name,
      children:
        item.children && item.children.length
          ? filterTreeData2(item.children)
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

    if (start.pid === 0 || end.id === -1) {
      return
    }
    if (end.grade === 4 && !isDropToGap) {
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
      if (end.pid === 0 || end.id === -1) {
        return
      }
      await moveTreeList({
        projectId: props.projectId,
        id: start.id,
        pid: end.id,
      })
    }

    init()
    getProjectInfoValues({ projectId: props.projectId })
  }

  const onSelect = (selectedKeys: any, e: any) => {
    const {
      node: {
        title: { props: selectLine },
      },
    } = e
    context.changeKey(selectLine.id)
    dispatch(changeId(selectLine.id))
  }

  useEffect(() => {
    if (props.isShowLeft) {
      init()
    }
  }, [props.isShowLeft])

  useImperativeHandle(ref, () => {
    return {
      init,
    }
  })

  if (props.isShowLeft) {
    return (
      <Left>
        <div className="resize_bar" />
        <div className="resize_line" />
        <div className="resize_save">
          <TitleWrap>{t('newlyAdd.demandClass')}</TitleWrap>
          {treeData.length > 0 && show ? (
            <Tree
              selectedKeys={[valueId]}
              allowDrop={(dropNode: any) => {
                if (dropNode.dropNode.title.props.grade === 4) {
                  return false
                }
                return true
              }}
              defaultExpandAll
              autoExpandParent
              onDrop={onDrop}
              onSelect={onSelect}
              draggable={(node: any) => {
                const {
                  title: {
                    props: { id },
                  },
                } = node
                if (id === -1 || id === 0) {
                  return false
                }

                return true
              }}
              treeData={treeData}
            />
          ) : null}
        </div>
      </Left>
    )
  }
  return null
}

export default forwardRef(WrapLeft)
