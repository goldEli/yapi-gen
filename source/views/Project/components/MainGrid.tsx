// 项目列表卡片模式

/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/naming-convention */
import ProjectCard from '@/components/ProjectCard'
import styled from '@emotion/styled'
import { Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import IconFont from '@/components/IconFont'
import { getIsPermission } from '@/tools'
import { useModel } from '@/models'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { encryptPhp } from '@/tools/cryptoPhp'

interface Props {
  onChangeOperation(type: string, id: number, e?: any): void
  onChangeVisible(): void
  projectList: any
  onAddClear?(): void
}

const SpaceWrap = styled(Space)({
  display: 'flex',
  flexWrap: 'wrap',
})

const AddProject = styled.div({
  height: 144,
  borderRadius: 4,
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 220,
  cursor: 'pointer',
  div: {
    color: '#646566',
  },
  svg: {
    color: '#969799',
  },
  '&: hover': {
    div: {
      color: '#2877ff',
    },
    svg: {
      color: '#2877ff',
    },
  },
})

const DataWrap = styled.div({
  height: '100%',
  overflowX: 'auto',
})

const MainGrid = (props: Props) => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const { userInfo } = useModel('user')
  const isPermission = getIsPermission(
    userInfo?.company_permissions,
    'b/project/save',
  )

  const onToDetail = (item: any) => {
    const params = encryptPhp(JSON.stringify({ id: item.id }))
    navigate(`/Detail/Demand?data=${params}`)
  }

  const onAddClick = () => {
    props.onChangeVisible()
    props.onAddClear?.()
  }

  return (
    <DataWrap>
      {!!props.projectList?.list &&
        (props.projectList?.list?.length > 0 ? (
          <SpaceWrap size={24}>
            {props.projectList.list?.map((item: any) => (
              <div key={item.id}>
                <ProjectCard
                  item={item}
                  onToDetail={() => onToDetail(item)}
                  onChangeOperation={props.onChangeOperation}
                />
              </div>
            ))}

            {!isPermission && (
              <AddProject onClick={onAddClick}>
                <IconFont
                  style={{ fontSize: 24, marginBottom: 16 }}
                  type="plus"
                />
                <div style={{ fontSize: 14 }}>{t('common.createProject')}</div>
              </AddProject>
            )}
          </SpaceWrap>
        ) : isPermission ? (
          <NoData />
        ) : (
          <AddProject onClick={onAddClick}>
            <IconFont style={{ fontSize: 24, marginBottom: 16 }} type="plus" />
            <div style={{ fontSize: 14 }}>{t('common.createProject')}</div>
          </AddProject>
        ))}
    </DataWrap>
  )
}

export default MainGrid
