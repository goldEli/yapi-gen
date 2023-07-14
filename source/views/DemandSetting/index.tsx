import styled from '@emotion/styled'
import Header from './components/Header'
import Main from './components/Main'
import CreateField from './components/CreateField'
import CommonButton from '@/components/CommonButton'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from '@store/index'
import PermissionWrap from '@/components/PermissionWrap'
import { getCategoryConfigList } from '@store/category/thunk'
import NoData from '@/components/NoData'
import { setCategoryWorkType } from '@store/project'
import DeleteConfirm from '@/components/DeleteConfirm'
import { onComputedPermission } from '@/tools'
const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow-x: hidden;
`
const ButtonStyle = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  background-color: var(--neutral-n10);
`

const DemandSetting = () => {
  const dispatch = useDispatch()
  const [t] = useTranslation()
  const [isOperate, setIsOperate] = useState<boolean>(false)
  const [isSave, setIsSave] = useState(false)
  const { projectInfo } = useSelector(store => store.project)
  const { currentMenu } = useSelector(store => store.user)
  const [isNoData, setIsNoData] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { activeCategory, getCategoryConfigDataList } = useSelector(
    store => store.category,
  )
  // 计算当前选中下是否有项目管理权限
  const resultAuth = onComputedPermission(
    currentMenu,
    '/ProjectManagement/Project',
  )
  useSelector(store => store.category)
  const save = () => {
    setIsSave(true)
  }
  const onCancel = async () => {
    setIsSave(false), setIsOperate(false)
    await dispatch(
      getCategoryConfigList({
        projectId: projectInfo.id,
        categoryId: activeCategory.id,
      }),
    )
  }
  useEffect(() => {
    setIsSave(false)
    setIsOperate(false)
  }, [activeCategory])
  useEffect(() => {
    getCategoryConfigDataList?.configDataList?.length
      ? setIsNoData(true)
      : setIsNoData(false)
  }, [getCategoryConfigDataList?.configDataList])
  useEffect(() => {
    dispatch(setCategoryWorkType(1))
  }, [])

  // 判断是否详情回来，并且权限是不是有
  const isLength =
    projectInfo?.id && projectInfo?.projectPermissions?.length <= 0
  return (
    <PermissionWrap
      auth={
        resultAuth ? 'b/project/story_config' : '/ProjectManagement/Project'
      }
      permission={
        resultAuth
          ? isLength
            ? ['0']
            : projectInfo?.projectPermissions?.map((i: any) => i.identity)
          : currentMenu?.children?.map((i: any) => i.url)
      }
    >
      {isNoData ? (
        <>
          <Header />
          {isOperate && (
            <ButtonStyle>
              <CommonButton type="light" onClick={() => setIsVisible(true)}>
                {t('common.cancel')}
              </CommonButton>
              <CommonButton
                style={{ marginLeft: '16px' }}
                type="primary"
                onClick={() => save()}
              >
                {t('common.confirm')}
              </CommonButton>
            </ButtonStyle>
          )}
          <Wrap>
            <Main
              onIsOperate={() => setIsOperate(true)}
              isSave={isSave}
              onBack={() => {
                setIsSave(false), setIsOperate(false)
              }}
            />
            <CreateField />
          </Wrap>
        </>
      ) : (
        <NoData
          subText={t('add_the_requirement_state_to_configure_the_workflow')}
        />
      )}
      <DeleteConfirm
        text={t('other.isSave')}
        title={t('sprintProject.confirmCancel')}
        isVisible={isVisible}
        onChangeVisible={() => {
          onCancel(), setIsVisible(false)
        }}
        onConfirm={() => {
          save(), setIsVisible(false)
        }}
      />
    </PermissionWrap>
  )
}
export default DemandSetting
