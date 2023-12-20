import LeftIcon from './LeftIcon'
import RightForm from './RightForm'
import { useEffect, useState } from 'react'
import { CreateFormWrap, MainWrap, HeaderWrap, IconFontWrap } from './style'
import { useDispatch, useSelector } from '@store/index'
import { getAffiliationUser, getProjectInfoOnly } from '@/services/project'
import moment from 'moment'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import { getProjectInfoStore } from '@store/project/project.thunk'
import { postCreate, postEditCreate } from '@store/create-propject/thunks'

const CreateForm = (props: {
  title: string
  onBack(): void
  onCancel(): void
  projectType: number
}) => {
  const dispatch = useDispatch()
  const { isEditId } = useSelector(state => state.createProject)
  const [selectLeaders, setSelectLeaders] = useState<any>([])
  const [projectInfo, setProjectInfo] = useState<any>()
  const [formValues, setFormValues] = useState<any>(null)
  const [newFormValues, setNewFormValues] = useState<any>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isCVisible, setIsCVisible] = useState<boolean>(false)
  const [str, setStr] = useState<string>('')
  const [t] = useTranslation()
  // 左侧选中的icon
  const [icon, setIcon] = useState('')
  // 初始化获取项目负责人
  const getLeaderData = async (id: number) => {
    const res = await getAffiliationUser(id)
    setSelectLeaders(
      res.map((i: any) => ({
        name: i.name,
        id: i.id,
        img: i.avatar,
      })),
    )
  }
  // 获取编辑的项目信息
  const getProjectInfo = async () => {
    const res = await getProjectInfoOnly(isEditId)
    setProjectInfo(res)
    const res2 = await getAffiliationUser(res.team_id)
    setSelectLeaders(
      res2.map((i: any) => ({
        name: i.name,
        id: i.id,
        img: i.avatar,
      })),
    )
    setIcon(res.cover)
    const values = {
      name: res.name,
      prefix: res.prefix,
      // eslint-disable-next-line no-undefined
      leader_id: res.leader_id || undefined,
      expected_start_at: res.expected_start_at
        ? moment(res.expected_start_at)
        : '',
      expected_end_at: res.expected_end_at ? moment(res.expected_end_at) : '',
      info: res.info || '',
    }
    setFormValues(values)
    setNewFormValues(values)
    getLeaderData(res.team_id)
  }
  // 取消操作
  const onCancel = () => {
    const nowVal = JSON.stringify(formValues || '')
    const newVal = JSON.stringify(newFormValues || '')
    // 对比有无更改内容
    if (nowVal === newVal) {
      props.onCancel()
    } else {
      setIsVisible(true)
    }
  }
  const onBack = () => {
    setStr('back')
    const nowVal = JSON.stringify(formValues || '')
    const newVal = JSON.stringify(newFormValues || '')
    // 回到上一步也需要判断是否有更改
    if (nowVal === newVal) {
      props.onBack()
    } else {
      setIsVisible(true)
    }
  }
  const onCreate = () => {
    setIsCVisible(true)
  }
  // 创建或编辑的api
  const onCreateProject = async () => {
    const obj = {
      clone_project_id: [],
      project_type: props.projectType || projectInfo?.project_type,
      cover: icon,
      ...newFormValues,
    }
    if (isEditId) {
      await dispatch(postEditCreate({ ...projectInfo, ...obj, id: isEditId }))
      setProjectInfo({ ...projectInfo, ...obj, id: isEditId })
      dispatch(getProjectInfoStore({ projectId: isEditId }))
    } else {
      dispatch(postCreate(obj))
    }
    setIsCVisible(false)
  }
  useEffect(() => {
    // 编辑
    if (isEditId) {
      getProjectInfo()
      return
    }
    // 初始化为空
    const values = {
      name: '',
      prefix: '',
      // eslint-disable-next-line no-undefined
      leader_id: undefined,
      expected_start_at: '',
      expected_end_at: '',
      info: '',
    }
    setFormValues(values)
    setNewFormValues(values)
    // 创建
    getLeaderData(0)
  }, [isEditId])
  return (
    <CreateFormWrap>
      <HeaderWrap>
        <span className="title">{props.title}</span>
        <IconFontWrap onClick={onCancel} type="close" />
      </HeaderWrap>
      <MainWrap>
        <LeftIcon
          projectType={props.projectType || projectInfo?.project_type}
          icon={icon}
          newFormValues={newFormValues}
          selectLeaders={selectLeaders}
          onChangeIcon={(val: string) => {
            setIcon(val)
          }}
        />
        <RightForm
          isEditId={isEditId}
          selectLeaders={selectLeaders}
          formValues={formValues}
          onCancel={() => {
            setStr('cancel'), onCancel()
          }}
          onBack={onBack}
          onUpdateValues={val => setNewFormValues(val)}
          onCreate={onCreate}
        />
      </MainWrap>
      <DeleteConfirm
        hasIcon={false}
        okText={t('newlyAdd.yes')}
        cancelText={t('newlyAdd.no')}
        text={t('cancelText')}
        title={t('sprintProject.confirmCancel')}
        isVisible={isVisible}
        onCancel={() => {
          console.log(12)
        }}
        onChangeVisible={() => {
          setIsVisible(false)
        }}
        onConfirm={() => {
          setIsVisible(false)
          if (str === 'back') {
            props.onBack()
            return
          }
          // 关闭大弹窗
          props.onCancel()
        }}
      />
      <DeleteConfirm
        hasIcon={false}
        okText={t('qr')}
        cancelText={t('cancel')}
        text={isEditId ? t('qrE') : t('qrA')}
        title={isEditId ? t('qrEt') : t('qrAt')}
        isVisible={isCVisible}
        onCancel={() => {
          setIsCVisible(false)
        }}
        onChangeVisible={() => {
          setIsCVisible(false)
        }}
        onConfirm={onCreateProject}
      />
    </CreateFormWrap>
  )
}
export default CreateForm
