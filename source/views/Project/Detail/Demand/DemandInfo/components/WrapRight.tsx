/* eslint-disable multiline-ternary */
/* eslint-disable no-undefined */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Input, Button, message } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'
import NoData from '@/components/NoData'
import { OmitText } from '@star-yun/ui'
import cos from '@/models/cos'

const WrapRight = styled.div({
  width: '424px',
  height: '100%',
  overflow: 'auto',
})

const Title = styled.div({
  fontSize: 14,
  fontWeight: 400,
  color: 'black',
})

const CommentItem = styled.div({
  display: 'flex',
  justifyContent: 'flex-start',
  marginTop: 24,
  '&: hover': {
    '.anticon': {
      display: 'block!important',
      cursor: 'pointer',
    },
  },
  img: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    marginRight: 12,
  },
})

const TextWrap = styled.div({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '.textTop': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    '.name': {
      color: 'black',
      fontSize: 14,
      marginRight: 12,
    },
    '.anticon': {
      color: '#969799',
      fontSize: 16,
      position: 'absolute',
      right: 0,
      top: 3,
      display: 'none',
    },
  },
  '.common': {
    fontSize: 12,
    color: '#969799',
  },
  '.content': {
    color: '#646566',
    fontSize: 12,
    fontWeight: 400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    paddingRight: 30,
  },
})

const TextareaWrap = styled.div({
  marginTop: 67,
  height: 179,
  borderRadius: 6,
  border: '1px solid #EBEDF0',
  padding: 16,
  textAlign: 'right',
  marginBottom: 20,
  '.ant-input': {
    border: 'none',
    padding: 0,
  },
  '.ant-input:focus,.ant-input:active': {
    border: 'none',
    boxShadow: 'none',
  },
})

const SetHead = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  background: #a4acf5;
  background-blend-mode: normal;
  /* border: 2px solid rgba(40, 119, 255, 0.16); */
  border: 1px solid #f0f2fd;
  color: white;
  margin-right: 8px;
  margin-top: 24;
`

const WrapRightBox = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [addValue, setAddValue] = useState('')
  const {
    getCommentList,
    addComment,
    deleteComment,
    isRefreshComment,
    setIsRefreshComment,
  } = useModel('demand')
  const { userInfo } = useModel('user')
  const { projectInfo } = useModel('project')
  const [dataList, setDataList] = useState<any>({
    list: undefined,
  })
  const isComment = !projectInfo?.projectPermissions?.filter(
    (i: any) => i.identity === 'b/story/comment',
  ).length

  const getList = async () => {
    const result = await getCommentList({
      projectId,
      demandId,
      page: 1,
      pageSize: 999,
    })
    setDataList(result)
    setIsRefreshComment(false)
  }

  useEffect(() => {
    getList()
  }, [])

  useEffect(() => {
    if (isRefreshComment) {
      getList()
    }
  }, [isRefreshComment])

  const onDeleteComment = (item: any) => {
    setIsVisible(true)
    setIsDeleteId(item.id)
  }

  const onDeleteConfirm = async () => {
    try {
      await deleteComment({ projectId, id: isDeleteId })
      message.success(t('common.deleteSuccess'))
      setIsDeleteId(0)
      setIsVisible(false)
      getList()
    } catch (error) {

      //
    }
  }

  const onAddComment = async (content: string) => {
    if (content.trim().length) {
      try {
        await addComment({ projectId, demandId, content: content.trim() })
        message.success(t('project.replaySuccess'))
        setAddValue('')
        getList()
      } catch (error) {

        //
      }
    }
  }

  const onPressEnter = (e: any) => {
    onAddComment(e.target.value)
  }

  return (
    <WrapRight>
      <DeleteConfirm
        text={t('mark.cd')}
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <Title>{t('common.comment')}</Title>
      <div style={{ maxHeight: isComment ? 600 : 400, overflow: 'auto' }}>
        {!!dataList?.list
          && (dataList?.list?.length > 0 ? (
            <div>
              {dataList?.list?.map((item: any) => (
                <CommentItem key={item.id}>
                  {item.avatar
                    ? <img src={item.avatar} alt="" />
                    : (
                        <SetHead>
                          {String(item.name?.substring(0, 1)).toLocaleUpperCase()}
                        </SetHead>
                      )}
                  <TextWrap>
                    <div className="textTop">
                      {isComment ? null : (
                        <IconFont
                          type="close"
                          hidden={item.userId !== userInfo.id}
                          onClick={() => onDeleteComment(item)}
                        />
                      )}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="name">{item.name}</span>
                        <span className="common">
                          <OmitText width={160}>{item.statusContent}</OmitText>
                        </span>
                      </div>
                      <div className="common" style={{ paddingRight: 30 }}>
                        {item.createdTime}
                      </div>
                    </div>
                    <div className="content">{item.content}</div>
                  </TextWrap>
                </CommentItem>
              ))}
            </div>
          )
            : <NoData />
          )}
      </div>
      {isComment ? null : (
        <TextareaWrap>
          <Input.TextArea
            placeholder={t('mark.editCom')}
            autoSize={{ minRows: 5, maxRows: 5 }}
            value={addValue}
            onChange={(e: any) => setAddValue(e.target.value)}
            onPressEnter={onPressEnter}
          />
          <Button type="primary" onClick={() => onAddComment(addValue)}>
            {t('project.replay')}
          </Button>
        </TextareaWrap>
      )}
    </WrapRight>
  )
}

export default WrapRightBox
