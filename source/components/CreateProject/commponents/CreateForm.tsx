import LeftIcon from './LeftIcon'
import RightForm from './RightForm'
import { useEffect, useState } from 'react'
import { CreateFormWrap, MainWrap } from './style'
import { useSelector } from '@store/index'
import { getAffiliationUser, getProjectInfoOnly } from '@/services/project'
import moment from 'moment'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'

const CreateForm = (props: { onBack: () => void }) => {
  const { isEditId } = useSelector(state => state.createProject)
  const [selectLeaders, setSelectLeaders] = useState<any>([])
  const [projectInfo, setProjectInfo] = useState({})
  const [formValues, setFormValues] = useState<any>(null)
  const [newFormValues, setNewFormValues] = useState<any>(null)
  const [isVisible, setIsVisible] = useState<boolean>(false)
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
  //   获取编辑的项目信息
  const getProjectInfo = async () => {
    const res = await getProjectInfoOnly(isEditId)
    setProjectInfo(res)
    console.log(res, 'res')
    const res2 = await getAffiliationUser(res.team_id)
    console.log(res2, 'res2')
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
  //取消操作
  const onCancel = () => {
    const nowVal = JSON.stringify(formValues || '')
    const newVal = JSON.stringify(newFormValues || '')
    if (nowVal !== newVal) {
      setIsVisible(true)
    }
  }
  const onBack = () => {
    setStr('back')
    const nowVal = JSON.stringify(formValues || '')
    const newVal = JSON.stringify(newFormValues || '')
    // eslint-disable-next-line no-negated-condition
    if (nowVal !== newVal) {
      setIsVisible(true)
    } else {
      props.onBack()
    }
  }
  const onCreate = (val: any) => {}
  useEffect(() => {
    console.log(isEditId, 'isEditId---')
    // 编辑
    if (isEditId) {
      getProjectInfo()
      return
    }else{
        console.log(333)
    }
    // 创建
    getLeaderData(0)
  }, [isEditId])
  return (
    <CreateFormWrap>
      <MainWrap>
        <LeftIcon
          icon={icon}
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
          onCreate={val => onCreate(val)}
        />
      </MainWrap>
      <DeleteConfirm
        hasIcon
        text={t('other.isSave')}
        title={t('sprintProject.confirmCancel')}
        isVisible={isVisible}
        onChangeVisible={() => {
          console.log(str)
          if (str === 'back') {
            console.log(str, '999')
            props.onBack()
          }
          setIsVisible(false)
        }}
        onConfirm={() => {
          setIsVisible(false)
        }}
      />
    </CreateFormWrap>
  )
}
export default CreateForm
