/* eslint-disable prefer-regex-literals */
/* eslint-disable require-unicode-regexp */
// 需求设置-编辑需求类别
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import CommonModal from '@/components/CommonModal'
import { Input, Form } from 'antd'
import styled from '@emotion/styled'
import { useEffect, useRef, useState } from 'react'
import ChooseColor from './ChooseColor'
import { getParamsData } from '@/tools'
import { useTranslation } from 'react-i18next'
import { getCategoryIconList } from '@/services/demand'
import {
  addStoryConfigCategory,
  updateStoryConfigCategory,
} from '@/services/project'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMessage } from '@/components/Message'
import { useSelector, useDispatch } from '@store/index'
import { setProjectInfoValues } from '@store/project'
import { setActiveCategory, setStartUsing } from '@store/category'
import { storyConfigCategoryList } from '@store/category/thunk'
import { encryptPhp } from '@/tools/cryptoPhp'
const FormWrap = styled(Form)({
  '.ant-form-item': {
    margin: '22px 0 0 0',
  },
})

const ViewWrap = styled.div({
  height: 22,
  borderRadius: 11,
  padding: '0px',
  marginRight: 8,
  lineHeight: '22px',
  fontSize: 12,
  fontWeight: 400,
})

interface EditorProps {
  isVisible: boolean
  type?: string
  item?: any
  onClose(): void
  onUpdate(): void
  workType?: number
}

const EditorCategory = (props: EditorProps) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [path, setPath] = useState<any>('')
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const { id } = paramsData
  const inputRefDom = useRef<HTMLInputElement>(null)
  const [colorList, setColorList] = useState<any>()
  const [hiddenUpload, setHiddenUpload] = useState(false)
  const { projectInfoValues } = useSelector(store => store.project)
  const dispatch = useDispatch()
  // 图标icon
  const getIconList = async () => {
    const list: any = await getCategoryIconList()
    setColorList(list.data)
    if (props?.item) {
      setPath(props?.item?.attachmentPath)
    } else {
      setPath(list.data[0].path)
    }
    form.setFieldsValue({
      color: list.data[0].path,
    })
  }

  useEffect(() => {
    if (props?.type === 'edit' && props.isVisible) {
      getIconList()
      form.setFieldsValue(props?.item)
      setPath(props?.item?.path)
    } else if (props.isVisible) {
      getIconList()
    }
  }, [props.isVisible])

  const onReset = () => {
    props?.onClose()
    props.onUpdate()
    setTimeout(() => {
      form.resetFields()
      setPath('')
    }, 100)
  }

  const onConfirm = async (props: any) => {
    await form.validateFields()
    if (!form.getFieldValue('color')) {
      getMessage({ msg: t('newlyAdd.pleaseChooseColor'), type: 'warning' })
      return
    }
    const params = form.getFieldsValue()
    params.projectId = paramsData.id
    params.id = props?.item?.id
    const attachment_id = colorList.find(
      (item: any) => item.path === path,
    )?.path
    params.attachment_id = attachment_id ? attachment_id : path
    if (props?.type === 'edit') {
      try {
        await updateStoryConfigCategory(params)
        getMessage({ msg: t('common.editSuccess'), type: 'success' })
        onReset()
      } catch (error) {
        //
      }
    } else {
      try {
        const res = await addStoryConfigCategory({
          ...params,
          work_type: props.workType,
        })
        const projectInfoValuesData = JSON.parse(
          JSON.stringify(projectInfoValues),
        )
        const data = res.data[0]
        projectInfoValuesData.forEach(
          (item: { children: any[]; key: string }) => {
            if (item.key === 'category') {
              item.children.push({
                ...data,
                content_txt: data.name,
                content: data.name,
              })
            }
          },
        )

        dispatch(setProjectInfoValues(projectInfoValuesData))
        getMessage({ msg: t('common.createSuccess'), type: 'success' })
        dispatch(setActiveCategory(res.data[0]))
        await dispatch(storyConfigCategoryList({ projectId: id }))
        dispatch(setStartUsing(false))
        onReset()
        setTimeout(() => {
          const routerParams = {
            id: paramsData.id,
            categoryItem: res.data[0],
          }
          navigate(
            `/ProjectDetail/Setting/TypeConfiguration?data=${encryptPhp(
              JSON.stringify(routerParams),
            )}`,
          )
        })
      } catch (error) {
        //
      }
    }
    setHiddenUpload(false)
  }

  const onClose = () => {
    props.onClose()
    setHiddenUpload(false)
    setTimeout(() => {
      form.resetFields()
      setPath('')
    }, 100)
  }

  const onChangeValue = (val: { id: number; path: string }, state: any) => {
    setPath(val.path)
    state === 1 ? setHiddenUpload(true) : setHiddenUpload(false)
  }
  return (
    <CommonModal
      isVisible={props.isVisible}
      title={
        props?.type === 'edit'
          ? props.item.work_type === 1 || props.item.work_type === 2
            ? t('newlyAdd.editCategory')
            : t('other.editCategory')
          : t('newlyAdd.createCategory')
      }
      onClose={onClose}
      onConfirm={() => onConfirm(props)}
      confirmText={props?.item?.id ? t('common.confirm') : t('newlyAdd.create')}
    >
      <FormWrap
        form={form}
        layout="vertical"
        style={{ padding: '0 16px 0 24px' }}
      >
        <Form.Item
          label={t('newlyAdd.categoryName')}
          name="name"
          rules={[{ required: true, message: '' }]}
          getValueFromEvent={event => {
            // eslint-disable-next-line require-unicode-regexp
            return event.target.value.replace(/(?<start>^\s*)/g, '')
          }}
        >
          <Input
            autoComplete="off"
            ref={inputRefDom as any}
            placeholder={t('newlyAdd.pleaseCategory')}
            allowClear
            maxLength={10}
            autoFocus
          />
        </Form.Item>
        <Form.Item
          label={t('newlyAdd.categoryRemark')}
          getValueFromEvent={event => {
            const reg = new RegExp(/(?<start>^\s*)/g)

            return event.target.value.replace(reg, '')
          }}
          name="remark"
        >
          <Input.TextArea
            placeholder={t('newlyAdd.pleaseCategoryRemark')}
            autoSize={{ minRows: 5, maxRows: 5 }}
            maxLength={100}
          />
        </Form.Item>
        <Form.Item label={t('newlyAdd.chooseIcon')} name="attachment_id">
          <ChooseColor
            color={path}
            hiddenUpload={hiddenUpload}
            colorList={colorList}
            onChangeValue={(val: any, state) => onChangeValue(val, state)}
          />
        </Form.Item>
        <Form.Item label={t('newlyAdd.view')}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ViewWrap>
              {/* {name || t('newlyAdd.nothing')} */}
              {path && <img src={path} style={{ width: '20px' }} />}
            </ViewWrap>
            <span>{t('newlyAdd.viewName')}</span>
          </div>
        </Form.Item>
      </FormWrap>
    </CommonModal>
  )
}

export default EditorCategory