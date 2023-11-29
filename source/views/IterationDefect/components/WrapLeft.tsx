/* eslint-disable require-unicode-regexp */
/* eslint-disable no-undefined */

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
import IconFont from '@/components/IconFont'
import DeleteConfirm from '@/components/DeleteConfirm'
import CommonModal from '@/components/CommonModal'
import { css } from '@emotion/css'
import { getIsPermission, getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { setProjectInfoValues } from '@store/project'
import { useDispatch, useSelector } from '@store/index'
import {
  addTreeList,
  delTreeList,
  getTreeList,
  moveTreeList,
} from '@/services/demand'
import { changeId } from '@store/counterSlice'
import { useSearchParams } from 'react-router-dom'
import { getMessage } from '@/components/Message'
import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'
import { TreeContextDefect } from '..'

const TitleWrap = styled.div({
  paddingLeft: '15px',
  whiteSpace: 'nowrap',
  fontSize: 14,
  color: 'var(--neutral-n1-d2)',
  fontFamily: 'SiYuanMedium',
})

const TreeBox = styled.div`
  width: 100% !important;
  height: 40px;
  border-radius: 0px 0px 0px 0px;
  display: flex;
  align-items: center;
`
const FormBox = styled.div`
  padding: 0 20px 0 24px;
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
  color: var(--neutral-n2);
  &:hover {
    background: var(--hover-d3);
    color: var(--neutral-n1-d2);
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
  color: var(--neutral-n3) !important;
  &:hover {
    color: var(--primary-d2);
  }
`
const TreeItem = (props: any) => {
  const context: any = useContext(TreeContextDefect)
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [t] = useTranslation()
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [visiblePop, setVisiblePop] = useState(false)
  const [visibleEditText, setVisibleEditText] = useState('')
  const { projectInfo } = useSelector(store => store.project)

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
      getMessage({ msg: t('common.deleteSuccess'), type: 'success' })
    }
    // 如果当前删除的跟当前选中的一致，则重置
    if (context?.key === props.id) {
      props.onDeleteRestKey()
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
        ? getMessage({ msg: t('common.createSuccess'), type: 'success' })
        : getMessage({ msg: t('common.editSuccess'), type: 'success' })
    }

    close()
    props.onRest()
  }

  const content = (
    <div
      style={{
        padding: '4px 0px',
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
    <TreeBox className="treeBox">
      <span
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {props.name}
      </span>
      <span className={centerText}>
        {props.story_count > 0 && `(${props.story_count})`}
      </span>
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
                  return event.target.value.replace(/(?<start>^\s*)/g, '')
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
                  return event.target.value.replace(/(?<start>^\s*)/g, '')
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
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id
  const { value: valueId } = useSelector(store => store.counter)
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const context: any = useContext(TreeContextDefect)
  const [treeData, setTreeData] = useState<any>([])
  const [show, setShow] = useState<any>(false)
  const { projectInfoValues, isUpdateAddWorkItem } = useSelector(
    store => store.project,
  )
  const { isRefresh } = useSelector(store => store.user)

  // 重组为下拉筛选格式
  const computedChildren = (array: any) => {
    const resultData = array?.map((k: any) => ({
      key: k.id,
      value: k.id,
      title: k.name,
      children: computedChildren(k.children),
    }))
    return resultData || []
  }

  // isUpdateProjectInfoValues：是否需要更新项目下拉数据 isInit：是否是初始化
  const init = async (
    isUpdateProjectInfoValues?: boolean,
    isInit?: boolean,
  ) => {
    if (isInit) setShow(false)
    const res = await getTreeList({ id: props.projectId, is_bug: 1 })
    setTreeData(filterTreeData(res))
    if (isInit) setShow(true)
    // 更新项目成员下拉
    if (isUpdateProjectInfoValues) {
      const beforeValues = JSON.parse(JSON.stringify(projectInfoValues))
      const newValues = beforeValues?.map((i: any) =>
        i.key === 'class'
          ? { ...i, children: computedChildren(res[0].children) }
          : i,
      )
      dispatch(setProjectInfoValues(newValues))
    }
  }

  const onDeleteRestKey = () => {
    context.changeKey(0)
    dispatch(changeId(0))
  }

  function filterTreeData(data: any) {
    const newData = data.map((item: any) => ({
      key: item.key,
      title: (
        <TreeItem
          onRest={() => {
            init(true)
            props.onUpdate()
          }}
          onDeleteRestKey={onDeleteRestKey}
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

    if (start.pid === 0 || end.id === -1) {
      // //
      // return
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

    init(true)
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
    if (isUpdateAddWorkItem || isRefresh) {
      init(false, false)
    }
  }, [isUpdateAddWorkItem, isRefresh])

  useEffect(() => {
    if (props.isShowLeft) {
      init(false, true)
    }
  }, [props.isShowLeft, projectId])

  useImperativeHandle(ref, () => {
    return {
      init,
    }
  })

  useEffect(() => {
    if (isUpdateAddWorkItem) {
      init(false, false)
    }
  }, [isUpdateAddWorkItem])

  if (props.isShowLeft) {
    return (
      <DragMoveContainer
        height="calc(100vh - 150px)"
        max="700px"
        min="240px"
        width="240px"
      >
        <TitleWrap style={{ paddingBottom: '10px' }}>
          {t('newlyAdd.demandClass')}
        </TitleWrap>
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
      </DragMoveContainer>
    )
  }
  return null
}

export default forwardRef(WrapLeft)
