import DragMoveContainer from '@/components/DragMoveContainer/DragMoveContainer'
import { useRef, useState } from 'react'
import { DetailInfoWrap, InfoItem, Label, TextWrap } from '../style'
import { useTranslation } from 'react-i18next'
import { Editor } from '@xyfe/uikit'
import TagComponent from '@/components/TagComponent'
import { AddWrap } from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import UploadAttach from '@/components/UploadAttach'

const SprintDetailInfo = () => {
  const [t] = useTranslation()
  const LeftDom = useRef<HTMLDivElement>(null)
  const [isDelVisible, setIsDelVisible] = useState(false)
  const [tagList, setTagList] = useState<any>([])
  const demandInfo = {
    info: '12112',
    attachment: [],
  }

  //   添加附件
  const onAddInfoAttach = async (data: any) => {
    //
  }

  //   删除附件
  const onDeleteInfoAttach = async (file: any) => {
    //
  }

  const onBottom = () => {
    const dom: any = LeftDom?.current
    dom.scrollTop = dom.scrollHeight
  }

  return (
    <DragMoveContainer
      max="65vw"
      min="30vw"
      width="65vw"
      height="calc(100vh - 176px)"
    >
      <DetailInfoWrap ref={LeftDom}>
        <InfoItem
          style={{
            marginTop: '0px',
          }}
        >
          <Label>{t('mine.demandInfo')}</Label>
          {demandInfo?.info ? (
            <Editor
              value={demandInfo?.info}
              getSuggestions={() => []}
              readonly
            />
          ) : (
            // <div dangerouslySetInnerHTML={{ __html: demandInfo?.info }} />
            <TextWrap>--</TextWrap>
          )}
        </InfoItem>

        <InfoItem>
          <Label>{t('common.attachment')}</Label>
          <div>
            {/* {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length > 0 && ( */}
            <UploadAttach
              onBottom={onBottom}
              defaultList={demandInfo?.attachment?.map((i: any) => ({
                url: i.attachment.path,
                id: i.id,
                size: i.attachment.size,
                time: i.created_at,
                name: i.attachment.name,
                suffix: i.attachment.ext,
                username: i.user_name ?? '--',
              }))}
              canUpdate
              onC
              del={onDeleteInfoAttach}
              add={onAddInfoAttach}
              addWrap={
                <AddWrap
                  hasColor
                  style={{
                    marginBottom: '10px',
                    color: 'var(--primary-d2)F',
                  }}
                >
                  <IconFont
                    style={{
                      color: 'var(--primary-d2)',
                    }}
                    type="plus"
                  />
                  <div
                    style={{
                      color: 'var(--primary-d2)',
                    }}
                  >
                    {t('p2.addAdjunct')}
                  </div>
                </AddWrap>
              }
            />
            {/* )} */}
            {/* {projectInfo?.projectPermissions?.filter(
              (i: any) => i.name === '附件上传',
            ).length <= 0 && <span>--</span>} */}
          </div>
        </InfoItem>
        <InfoItem>
          <Label>{t('common.tag')}</Label>
          <TagComponent
            defaultList={tagList}
            canAdd
            addWrap={
              <AddWrap hasDash>
                <IconFont type="plus" />
              </AddWrap>
            }
          />
        </InfoItem>
        {/* <DeleteConfirm
          text={t('p2.del')}
          isVisible={isDelVisible}
          onChangeVisible={() => setIsDelVisible(!isDelVisible)}
          onConfirm={onDeleteConfirm}
        /> */}
      </DetailInfoWrap>
    </DragMoveContainer>
  )
}

export default SprintDetailInfo
