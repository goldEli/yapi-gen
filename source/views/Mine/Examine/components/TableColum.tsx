/* eslint-disable complexity */
import Sort from '@/components/Sort'
import { CategoryWrap, ClickWrap } from '@/components/StyleCommon'
import { OmitText } from '@star-yun/ui'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { useModel } from '@/models'
import { encryptPhp } from '@/tools/cryptoPhp'
import { openDetail } from '@/tools'

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
  const { colorList } = useModel('project')

  const onToDetail = (item: any) => {
    const params = encryptPhp(
      JSON.stringify({
        type: 'info',
        id: item.projectId,
        demandId: item.demandId,
      }),
    )
    openDetail(`/Detail/Demand?data=${params}`)
  }

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
        return <ClickWrap onClick={() => onToDetail(record)}>{text}</ClickWrap>
      },
    },
    {
      title: <NewSort fixedKey="story_name">{t('common.title')}</NewSort>,
      dataIndex: 'demandName',
      key: 'story_name',
      render: (text: string | number, record: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CategoryWrap
              style={{ marginLeft: 0 }}
              color={record.categoryColor}
              bgColor={
                colorList?.filter(i => i.key === record.categoryColor)[0]
                  ?.bgColor
              }
            >
              {record.categoryName}
            </CategoryWrap>
            <ClickWrap onClick={() => onToDetail(record)}>
              <OmitText width={200}>{text}</OmitText>
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
            {text === 1 && !state.activeTab
              ? <CanClick>{t('newlyAdd.waitExamine')}</CanClick>
              : (
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
      title:
        <NewSort fixedKey="verify_at">{t('newlyAdd.examineTime')}</NewSort>
      ,
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

  if (state.activeTab) {
    arr.pop()
  }

  return arr
}
