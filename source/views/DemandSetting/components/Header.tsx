import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Switch } from 'antd'
import { useDispatch, useSelector } from '@store/index'
import { setProjectInfoValues } from '@store/project'
import { useEffect, useState } from 'react'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import { deleteStoryConfigCategory } from '@/services/project'
import { useNavigate } from 'react-router-dom'
import { encryptPhp } from '@/tools/cryptoPhp'
import { setStartUsing } from '@store/category'

const HeaderWrap = styled.div`
  height: 66px;
  display: flex;
  margin: 0 24px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--neutral-n6-d1);
`
const LeftMsg = styled.div`
  display: flex;
  align-items: flex-start;
`
const RightOperate = styled.div`
  display: flex;
  align-items: center;
`
const MsgContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  div:nth-child(1) {
    color: var(--neutral-n1-d1);
    font-size: 14px;
  }
  div:nth-child(2) {
    color: var(--neutral-n3);
    font-size: 12px;
  }
`
const SwitchStyle = styled.div`
  display: flex;
  align-items: center;
  color: var(--neutral-n3);
  font-size: 14px;
`
const BtnStyle = styled.div`
  display: inline-block;
  width: auto;
  height: 32px;
  border-radius: 6px;
  background: var(--hover-d2);
  color: var(--neutral-n2);
  padding: 0 16px;
  margin-left: 16px;
  line-height: 32px;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`
const Header = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { startUsing, activeCategory } = useSelector(store => store.category)
  const { projectInfo } = useSelector(store => store.project)
  const [checked, setChecked] = useState(startUsing)
  const [isDelete, setIsDelete] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setChecked(startUsing ? true : false)
  }, [startUsing])

  // 删除需求类别
  const onDeleteConfirm = async () => {
    // await deleteStoryConfigCategory({
    //   id: props.row.id,
    //   projectId: paramsData.id,
    // })
  }

  // 点击跳转配置工作流
  const onSetWorkFlow = () => {
    const params = encryptPhp(
      JSON.stringify({
        id: projectInfo.id,
        pageIdx: 'work',
        categoryItem: activeCategory,
      }),
    )
    navigate(`/ProjectManagement/WorkFlow?data=${params}`)
  }

  return (
    <HeaderWrap>
      <DeleteConfirm
        isVisible={isDelete}
        text={t('newlyAdd.confirmDelCategory')}
        onChangeVisible={() => setIsDelete(!isDelete)}
        onConfirm={onDeleteConfirm}
      />
      <LeftMsg>
        <CommonIconFont type="left" size={24} />
        <MsgContent>
          <div>{activeCategory.name}</div>
          <div>{activeCategory.remark || '--'}</div>
        </MsgContent>
      </LeftMsg>
      <RightOperate>
        <SwitchStyle>
          <span style={{ marginRight: '8px' }}>启用状态</span>
          <Switch
            checked={checked}
            onChange={e => {
              setChecked(e), dispatch(setStartUsing(e))
            }}
          />
        </SwitchStyle>
        <BtnStyle onClick={onSetWorkFlow}>配置工作流</BtnStyle>
        <BtnStyle>编辑</BtnStyle>
        <BtnStyle onClick={() => setIsDelete(true)}>删除</BtnStyle>
      </RightOperate>
    </HeaderWrap>
  )
}
export default Header
