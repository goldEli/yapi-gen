import CommonIconFont from '@/components/CommonIconFont'
import IconFont from '@/components/IconFont'
import styled from '@emotion/styled'
import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import * as services from '@/services'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from '@store/index'
import { encryptPhp } from '@/tools/cryptoPhp'
import { t } from 'i18next'
import { changeCreateVisible } from '@store/create-propject'

interface PropsType {
  text: string
}
const Container = styled.div`
  width: 320px;
  height: auto;
  background-color: var(--neutral-white-d5);
  box-shadow: 0px 7px 13px 0px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  max-height: calc(100vh - 120px);
`
const ScrollWrap = styled.div`
  height: calc(100vh - 256px);
  overflow-y: auto;
`
const Footer = styled.div`
  /* padding-left: 24px; */
  border-radius: 0px 0px 6px 6px;
  font-size: 14px;
  font-weight: 400;
  color: var(--neutral-n1-d2);
  margin: 8px 0;
  padding-bottom: 8px;
  & div:hover {
    background-color: var(--hover-d3);
    cursor: pointer;
  }
  & div {
    padding-left: 24px;
    display: flex;
    align-items: center;
    height: 52px;
  }
`
const Title = styled.div`
  font-size: 12px;
  font-weight: 400;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
  color: var(--neutral-n3);
`
const Row = styled.div`
  width: 100%;
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    cursor: pointer;
    background-color: var(--hover-d3);
  }
`
const ItemRow = styled(Row)`
  > img {
    width: 32px;
    height: 32px;
  }
`
const ItemTitle = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  margin-left: 12px;
  color: var(--neutral-n1-d1);
`
const Border = styled.div`
  margin: 0 16px;
  text-align: center;
  border-bottom: 1px solid var(--neutral-n6-d2);
`
const ItemDropdown = (props: PropsType) => {
  const { userInfo } = useSelector(store => store.user)
  const navigate = useNavigate()
  const [itemArr, setItemArr] = useState([])
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const onFectProjectList = async () => {
    const data = await services.project.getProjectRecent()
    setItemArr(data)
  }

  useEffect(() => {
    onFectProjectList()
  }, [isOpen])

  const onRoute = (el: any) => {
    // console.log(el)
    const params = encryptPhp(
      JSON.stringify({
        id: el.id,
        projectType: el.projectType,
        type: el.projectType === 2 ? 'sprint' : 'iteration',
      }),
    )
    setIsOpen(false)
    // debugger
    // TODO
    // console.log(el)
    if (el.projectType === 2) {
      navigate(
        `${
          el.defaultHomeMenu
            ? el.defaultHomeMenu
            : '/SprintProjectManagement/Affair'
        }?data=${params}`,
      )
      return
    }
    navigate(
      `${
        el.defaultHomeMenu ? el.defaultHomeMenu : '/ProjectManagement/Demand'
      }?data=${params}`,
    )
  }
  const itmeMain = (item: any) => {
    return item.map((el: any) => (
      <ItemRow key={el.id} onClick={() => onRoute(el)}>
        <img src={el.cover} />
        <ItemTitle>{el.name}</ItemTitle>
      </ItemRow>
    ))
  }
  const dropdownRender = () => {
    return (
      <Container>
        <ScrollWrap>
          <Title>{t('recent_projects') as string}</Title>
          {itmeMain(itemArr)}
        </ScrollWrap>
        <Border />
        <Footer>
          <div
            onClick={() => {
              setIsOpen(false)
              navigate('/ProjectManagement/Project')
            }}
          >
            <IconFont
              type="folder-open-nor"
              style={{
                fontSize: 20,
                marginRight: 12,
                color: 'var(--neutral-n3)',
              }}
            />
            {t('view_all_projects') as string}
          </div>
          {(
            userInfo.company_permissions?.map((i: any) => i.identity) || []
          ).includes('b/project/save') && (
            <div
              onClick={(e: any) => {
                e.stopPropagation()
                dispatch(changeCreateVisible(true))
                setIsOpen(false)
              }}
            >
              <IconFont
                type="plus"
                style={{
                  fontSize: 20,
                  marginRight: 12,
                  color: 'var(--neutral-n3)',
                }}
              />
              {t('common.createProject') as string}
            </div>
          )}
        </Footer>
      </Container>
    )
  }
  return (
    <>
      <Dropdown
        onOpenChange={setIsOpen}
        dropdownRender={dropdownRender}
        placement="bottomLeft"
        trigger={['click']}
        open={isOpen}
        // open={true}
      >
        <div style={{ height: '52px', lineHeight: '52px' }}>
          <span
            style={{
              marginRight: '8px',
              color: isOpen ? 'var(--primary-d2)' : '',
            }}
          >
            {props.text}
          </span>
          <CommonIconFont
            type="down"
            size={14}
            color={isOpen ? 'var(--primary-d2)' : ''}
          />
        </div>
      </Dropdown>
      {dropdownRender}
    </>
  )
}
export default ItemDropdown
