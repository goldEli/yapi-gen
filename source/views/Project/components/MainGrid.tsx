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
  marginLeft: '8px',
  marginTop: '-8px',
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
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <img
              style={{
                width: '240px',
                height: '144px',
              }}
              src="/public/noData.png"
              alt=""
            />
            <div
              style={{
                height: '22px',
                fontSize: '14px',
                fontWeight: 400,
                color: '#969799',
                lineHeight: '22px',
                marginTop: '26px',
              }}
            >
              {t('new_p1.quick')}
            </div>

            <div
              onClick={onAddClick}
              style={{
                marginTop: '24px',
                fontSize: 14,
                minWidth: '88px',
                padding: '0 16px',
                height: '32px',
                background: '#F0F4FA',
                borderRadius: '6px 6px 6px 6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2877FF',
              }}
            >
              {t('common.createProject')}
            </div>
          </div>
        ))}
    </DataWrap>
  )
}

export default MainGrid
