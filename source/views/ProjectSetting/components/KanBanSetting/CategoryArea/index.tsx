import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import CommonButton from '@/components/CommonButton'
import UpDownBtn from '../../../../../components/UpDownBtn'
import { useDispatch, useSelector } from '@store/index'
import { setCategoryVisibleInfo } from '@store/kanbanConfig'
import { useNavigate } from 'react-router'
import { encryptPhp } from '@/tools/cryptoPhp'
import useI18n from '@/hooks/useI18n'
import { getProjectIdByUrl, getProjectType } from '@/tools'

interface CategoryAreaProps {
  data: Model.KanbanConfig.Category
  children: React.ReactNode
  showTitle: boolean
}

const CategoryAreaBox = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  flex-direction: column;
`
const TitleArea = styled.div<{ visible: boolean }>`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const IconImg = styled.img`
  width: 20px;
  height: 20px;
`

const Text = styled.div`
  font-size: 14px;
  font-family: SiYuanMedium;
  color: var(--neutral-n1-d1);
  padding-right: 8px;
`

const CategoryArea: React.FC<CategoryAreaProps> = props => {
  const dispatch = useDispatch()
  const { categoryVisibleInfo } = useSelector(store => store.KanbanConfig)
  const isOpen = useMemo(() => {
    return !categoryVisibleInfo.find(item => item.categoryId === props.data.id)
      ?.close
  }, [categoryVisibleInfo, props.data])
  const navigate = useNavigate()
  const { t } = useI18n()

  const children = useMemo(() => {
    if (!isOpen) {
      return <></>
    }
    return props.children
  }, [props.children, isOpen])
  return (
    <CategoryAreaBox>
      <TitleArea
        onClick={() => {
          dispatch(setCategoryVisibleInfo(props.data.id))
        }}
        visible={props.showTitle}
      >
        <UpDownBtn isOpen={isOpen} />
        <IconImg src={props.data.attachment_path} />
        <Text>{props.data.name}</Text>
        <div
          onClick={e => {
            const type = getProjectType()
            e.stopPropagation()
            const params = encryptPhp(
              JSON.stringify({
                id: getProjectIdByUrl(),
                pageIdx: 'work',
                type: type === 1 ? 4 : 'work',
                // categoryItem: props.data,
                categoryItem: {
                  name: props.data.name,
                  //   hasDemand: 0,
                  //   color: '#969799',
                  id: props.data.id,
                  //   isCheck: 1,
                  statusCount: props.data?.status?.length ?? 0,
                  //   remark: '',
                  attachmentPath: props.data.attachment_path,
                  //   status: 1,
                  //   active: true,
                },
              }),
            )
            if (type === 2) {
              navigate(`/SprintProjectManagement/WorkFlow?data=${params}`)
              return
            }
            navigate(`/ProjectManagement/WorkFlow?data=${params}`)
          }}
        >
          <CommonButton type="light">{t('edit_workflow')}</CommonButton>
        </div>
      </TitleArea>
      {children}
    </CategoryAreaBox>
  )
}

export default CategoryArea
