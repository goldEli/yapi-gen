/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/naming-convention */
import { Input, Button, message } from 'antd'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { useModel } from '@/models'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirm from '@/components/DeleteConfirm'
import { useTranslation } from 'react-i18next'

const WrapRight = styled.div({
  width: '424px',
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

const WrapRightBox = () => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('id')
  const demandId = searchParams.get('demandId')
  const [isVisible, setIsVisible] = useState(false)
  const [isDeleteId, setIsDeleteId] = useState(0)
  const [addValue, setAddValue] = useState('')
  const { getCommentList, addComment, deleteComment } = useModel('demand')
  const { userInfo } = useModel('user')
  const { projectInfo } = useModel('project')
  const [dataList, setDataList] = useState<any>([])
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
  }

  useEffect(() => {
    getList()
  }, [])

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
        message.success('回复成功')
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
        text="确认删除当前评论？"
        isVisible={isVisible}
        onChangeVisible={() => setIsVisible(!isVisible)}
        onConfirm={onDeleteConfirm}
      />
      <Title>评论</Title>
      <div style={{ maxHeight: isComment ? 600 : 400, overflow: 'auto' }}>
        {dataList?.list?.map((item: any) => (
          <CommentItem key={item.id}>
            <img src={item.avatar} alt="" />
            <TextWrap>
              <div className="textTop">
                {isComment
                  ? null
                  : (
                      <IconFont
                        type="close"
                        hidden={item.userId !== userInfo.id}
                        onClick={() => onDeleteComment(item)}
                      />
                    )}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="name">{item.name}</span>
                  <span className="common">{item.statusContent}</span>
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
      {isComment
        ? null
        : (
            <TextareaWrap>
              <Input.TextArea
                placeholder="输入评论，按Enter快速发布"
                autoSize={{ minRows: 5, maxRows: 5 }}
                value={addValue}
                onChange={(e: any) => setAddValue(e.target.value)}
                onPressEnter={onPressEnter}
              />
              <Button type="primary" onClick={() => onAddComment(addValue)}>
            回复
              </Button>
            </TextareaWrap>
          )}
    </WrapRight>
  )
}

export default WrapRightBox
