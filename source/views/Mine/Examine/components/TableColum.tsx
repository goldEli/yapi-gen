// 审核列表字段

import Sort from '@/components/Sort'
import { CategoryWrap, ClickWrap } from '@/components/StyleCommon'
import { OmitText } from '@star-yun/ui'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { encryptPhp } from '@/tools/cryptoPhp'
import { useSelector } from '@store/index'
import { Tooltip } from 'antd'
import { useNavigate } from 'react-router-dom'

const CircleWrap = styled.div({
  width: 8,
  height: 8,
  borderRadius: '50%',
  marginRight: 8,
})

const CanClick = styled.div({
  height: 24,
  borderRadius: 6,
  padding: '0 8px',
  cursor: 'pointer',
  color: 'white',
  fontSize: 12,
  background: '#2877ff',
  lineHeight: '24px',
  width: 'fit-content',
})

const StatusWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

export const useDynamicColumns = (state: any) => {
  const [t] = useTranslation()
  const { colorList } = useSelector(store => store.project)
  const navigate = useNavigate()

  // const onToDetail = (item: any) => {
  //   const params = encryptPhp(
  //     JSON.stringify({
  //       type: 'info',
  //       id: item.projectId,
  //       demandId: item.demandId,
  //     }),
  //   )
  //   navigate(`/ProjectManagement/Demand?data=${params}`)
  // }

  const NewSort = (propsSort: any) => {
    return (
      <Sort
        fixedKey={propsSort.fixedKey}
        onChangeKey={state.onUpdateOrderkey}
        nowKey={state?.orderKey}
        order={state?.order}
      >
        {propsSort.children}
      </Sort>
    )
  }

  const arr = [
    {
      title: <NewSort fixedKey="story_id">ID</NewSort>,
      dataIndex: 'demandId',
      key: 'story_id',
      render: (text: string, record: any) => {
        return (
          <ClickWrap onClick={() => state.onClickItem(record)}>
            {text}
          </ClickWrap>
        )
      },
    },
    {
      title: <NewSort fixedKey="story_name">{t('common.title')}</NewSort>,
      dataIndex: 'demandName',
      key: 'story_name',
      render: (text: string | number, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip placement="top" title={record.categoryName}>
              <img
                src={
                  record.category_attachment
                    ? record.category_attachment
                    : 'https://varlet.gitee.io/varlet-ui/cat.jpg'
                }
                style={{
                  width: '18px',
                  height: '18px',
                  marginRight: '8px',
                }}
                alt=""
              />
            </Tooltip>
            <ClickWrap onClick={() => state.onClickItem(record)}>
              <OmitText
                width={200}
                tipProps={{
                  getPopupContainer: node => node,
                }}
              >
                {text}
              </OmitText>
            </ClickWrap>
          </div>
        )
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'usersName',
      key: 'users_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: <NewSort fixedKey="user_name">{t('newlyAdd.submitName')}</NewSort>,
      dataIndex: 'userName',
      key: 'user_name',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },

    {
      title: t('newlyAdd.reviewStatus'),
      dataIndex: 'statusFromTo',
      key: 'status_from_to',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_status">
          {t('newlyAdd.examineStatus')}
        </NewSort>
      ),
      dataIndex: 'status',
      key: 'verify_status',
      render: (text: any, record: any) => {
        return (
          <div onClick={() => state.onChangeOperation(record)}>
            {text === 1 && !state.activeTab ? (
              <CanClick>{t('newlyAdd.waitExamine')}</CanClick>
            ) : (
              <StatusWrap>
                <CircleWrap
                  style={{
                    background:
                      text === 1
                        ? '#FA9746'
                        : text === 2
                        ? '#43BA9A'
                        : '#FF5C5E',
                  }}
                />
                <ClickWrap style={{ display: 'inline' }}>
                  {text === 1
                    ? t('newlyAdd.waitExamine')
                    : text === 2
                    ? t('newlyAdd.passed')
                    : t('newlyAdd.notPass')}
                </ClickWrap>
              </StatusWrap>
            )}
          </div>
        )
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_at">{t('newlyAdd.examineTime')}</NewSort>
      ),
      dataIndex: 'verifyTime',
      key: 'verify_at',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
    {
      title: (
        <NewSort fixedKey="verify_opinion">
          {t('newlyAdd.examineReason')}
        </NewSort>
      ),
      dataIndex: 'reason',
      key: 'verify_opinion',
      render: (text: string) => {
        return <span>{text || '--'}</span>
      },
    },
  ]

  let resultArr: any
  if (state.activeTab) {
    resultArr = arr.filter(
      (i: any) => i.key !== 'verify_opinion' && i.key !== 'user_name',
    )
  }

  return state.activeTab ? resultArr : arr
}
