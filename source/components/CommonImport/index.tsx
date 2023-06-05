// 需求主页-导入需求

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-useless-fragment */
import { StepBoxWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Upload, Spin, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import CommonButton from '@/components/CommonButton'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatFileSize } from '@/services/cos'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'
import { useDispatch, useSelector } from '@store/index'
import { setIsRefresh } from '@store/user'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import { getMessage } from '@/components/Message'
import FieldsTemplate from './FieldsTemplate'

const Wrap = styled.div<{ language: any }>`
  padding-right: 20px;
  min-height: ${({ language }) => (language === 'zh' ? '570px' : '594px')};
  .ant-upload.ant-upload-drag.ant-upload-drag-hover {
    border: 1px dashed transparent !important;
  }
  .ant-upload.ant-upload-drag.ant-upload-drag-hover .uploadModal {
    background-color: rgba(255, 255, 255, 0.8);
  }
  .ant-upload.ant-upload-drag.ant-upload-drag-hover .uploadModal .content {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    flex-direction: column;
    z-index: 99;
    pointer-events: none;
  }
`

const StepWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '8px 0 40px 0',
})

const TabsWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 16,
  padding: '0 24px',
})

const TabsItem = styled.div<{ active?: boolean }>(
  {
    fontSize: 14,
    fontWeight: 400,
    paddingBottom: 13,
    marginRight: 32,
    cursor: 'pointer',
  },
  ({ active }) => ({
    color: active ? 'var(--primary-d2)' : 'var(--neutral-n2)',
    borderBottom: active
      ? '3px solid var(--primary-d2)'
      : '3px solid  var(--neutral-white-d5)',
    fontFamily: active ? 'SiYuanMedium' : '',
  }),
)

const TextWrap = styled.div({
  color: 'var(--neutral-n3)',
  fontSize: 12,
  lineHeight: '20px',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '24px',
  div: {
    marginBottom: 8,
  },
})

const UploadDragger = styled(Upload.Dragger)`
  height: 122px !important;
  background: white !important;
  border: 1px dashed #d5d6d9 !important;
  margin: 24px 0px 0 24px;
  width: 97% !important;
  position: relative;
  .uploadModal {
    position: absolute;
    height: 122px !important;
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0px;
    background-color: rgba(255, 255, 255, 0);
    .content {
      display: none;
      pointer-events: none;
      .circle {
        width: 48px;
        height: 48px;
        background: var(--primary-d1);
        border-radius: 60px 60px 60px 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .text {
        margin-top: 8px;
        font-size: 14px;
        font-family: SiYuanMedium;
        font-weight: 500;
        color: var(--primary-d1);
      }
    }
  }
`

const CommonWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const ContentWrap = styled.div<{ hasBg?: true; width: number }>(
  {
    minHeight: 32,
    lineHeight: '32px',
    textAlign: 'left',
    fontSize: 12,
    color: 'var(--neutral-n1-d1)',
  },
  ({ width, hasBg }) => ({
    width,
    background: hasBg ? 'var(--neutral-n7)' : '',
  }),
)

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const IconFontWrap = styled(IconFont)({
  fontSize: 16,
  color: 'var(--neutral-n3)',
  cursor: 'pointer',
  '&: hover': {
    color: 'var(--primary-d2)',
  },
})

const FilesItems = styled.div({
  marginTop: 24,
  marginLeft: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

interface CommonImportProps {
  // 传入提示文案
  tips: any
  // step1的标题
  stepText: string
  // 导入需要的接口
  interfaces: {
    getImportDownloadModel: any
    getImportExcel: any
    getImportExcelUpdate: any
  }
  // template字段modal需要的接口
  templateInterfaces: any
  // template字段modal的标题
  templateTitle: string
  // 导入后更新
  onUpdate(): void
}

const CommonImport = (props: CommonImportProps) => {
  const {
    tips,
    stepText,
    interfaces: {
      getImportDownloadModel,
      getImportExcel,
      getImportExcelUpdate,
    },
    templateInterfaces,
    templateTitle,
    onUpdate,
  } = props
  const [step, setStep] = useState(1)
  const [tabs, setTabs] = useState(2)
  const [fileList, setFileList] = useState<any>([])
  const [t, i18n] = useTranslation()
  const [spinLoading, setSpinLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [importExcel, setImportExcel] = useState<any>({})
  const dispatch = useDispatch()
  const { projectInfo } = useSelector(store => store.project)
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  const onUploadBefore = (file: any) => {
    const acceptArr = ['xlsx', 'xls']
    const urlType = file.name.split('.')
    if (!acceptArr.includes(urlType[urlType.length - 1])) {
      getMessage({ msg: t('project.incorrectFormat'), type: 'warning' })
      return Upload.LIST_IGNORE
    }
    return ''
  }

  const onUploadFileClick = async (option: any) => {
    const { file } = option
    if (file instanceof File) {
      setFileList([file])
    }
  }

  const onUpload = async (result: any) => {
    try {
      setImportExcel({})
      let resultExcel: any = {}
      if (tabs === 1) {
        resultExcel = await getImportExcelUpdate({
          projectId,
          filePath: result,
        })
      } else {
        resultExcel = await getImportExcel({ projectId, filePath: result })
      }
      setImportExcel(resultExcel)
      setSpinLoading(false)
      setStep(3)
      dispatch(setIsRefresh(true))
    } catch (error) {
      setStep(1)
      setSpinLoading(false)
    }
  }

  const onConfirmUpload = async () => {
    setStep(2)
    setSpinLoading(true)
    onUpload(fileList[0])
  }

  const onClear = () => {
    setFileList([])
    setStep(1)
    setTabs(2)
  }

  const onConfirmTemplate = async (arr: any) => {
    const result = await getImportDownloadModel({
      projectId,
      isUpdate: tabs,
      fields: arr.join(','),
    })
    if (result.body.type === 'application/json') {
      const reader = new FileReader()
      reader.readAsText(result.body, 'utf-8')
      reader.onload = function () {
        const obj = JSON.parse(reader.result as any)
        getMessage({ msg: obj.message, type: 'error' })
      }
    } else {
      const blob = new Blob([result.body], {
        type: result.headers['content-type'],
      })
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = `${projectInfo?.name} - ${
        tabs === 2 ? t('newlyAdd.importCreate') : t('newlyAdd.importUpdate')
      }.xlsx`
      a.href = blobUrl
      a.click()
      setIsVisible(false)
    }
  }

  const onChangeTabs = (value: any) => {
    setTabs(value)
    setFileList([])
  }

  // 删除已上传的文件
  const onDelFile = (item: any) => {
    setFileList(fileList?.filter((i: any) => i.uid !== item.uid))
  }

  return (
    <Wrap language={i18n.language}>
      <FieldsTemplate
        visible={isVisible}
        title={templateTitle}
        importState={tabs}
        onClose={() => setIsVisible(false)}
        onConfirm={onConfirmTemplate}
        isExport={false}
        interfaces={templateInterfaces}
      />

      <StepWrap>
        <StepBoxWrap active={step === 1}>
          <div className="border">
            <div className="circle">1</div>
          </div>
          <span>{stepText}</span>
        </StepBoxWrap>
        <div
          style={{
            width: i18n.language === 'zh' ? 160 : 148,
            height: 1,
            background: 'var(--neutral-n6-d1)',
            margin: '0 8px',
          }}
        />
        <StepBoxWrap active={step === 2}>
          <div className="border">
            <div className="circle">2</div>
          </div>
          <span>{t('newlyAdd.systemImport')}</span>
        </StepBoxWrap>
        <div
          style={{
            width: i18n.language === 'zh' ? 160 : 148,
            height: 1,
            background: 'var(--neutral-n6-d1)',
            margin: '0 8px',
          }}
        />
        <StepBoxWrap active={step === 3}>
          <div className="border">
            <div className="circle">3</div>
          </div>
          <span>{t('newlyAdd.importSuccess')}</span>
        </StepBoxWrap>
      </StepWrap>
      {step === 1 && (
        <>
          <TabsWrap>
            <TabsItem active={tabs === 2} onClick={() => onChangeTabs(2)}>
              {t('newlyAdd.importCreate')}
            </TabsItem>
            <TabsItem active={tabs === 1} onClick={() => onChangeTabs(1)}>
              {t('newlyAdd.importUpdate')}
            </TabsItem>
          </TabsWrap>
          {tabs === 2 && (
            <TextWrap>
              <div style={{ color: 'var(--neutral-n2)' }}>
                {t('newlyAdd.importText1')}
              </div>
              {tips.tab1}
            </TextWrap>
          )}
          {tabs === 1 && (
            <TextWrap>
              <div style={{ color: 'var(--neutral-n2)' }}>
                {t('newlyAdd.importText1')}
              </div>
              {tips.tab2}
            </TextWrap>
          )}
          <Button
            onClick={() => setIsVisible(true)}
            style={{
              background: 'var(--hover-d2)',
              border: 'none',
              color: 'var(--primary-d2)',
              margin: '24px 0 0 24px',
            }}
          >
            {t('newlyAdd.downloadTemplate')}
          </Button>
          {fileList?.length > 0 ? (
            <>
              {fileList?.map((ele: any) => (
                <FilesItems key={ele.uid}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconFont
                      style={{ fontSize: 24, marginRight: 4 }}
                      type="colorXLS-76p4mekd"
                    />
                    <span>
                      {ele.name} ({formatFileSize(ele.size)})
                    </span>
                  </div>
                  <IconFontWrap
                    type="close"
                    style={{ fontSize: 16 }}
                    onClick={() => onDelFile(ele)}
                  />
                </FilesItems>
              ))}
              <div
                style={{
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  position: 'absolute',
                  bottom: 0,
                  right: 24,
                }}
              >
                <CommonButton
                  type="light"
                  style={{ marginRight: 16 }}
                  onClick={() => setFileList([])}
                >
                  {t('newlyAdd.aginChoose')}
                </CommonButton>
                <Button type="primary" onClick={onConfirmUpload}>
                  {t('newlyAdd.startUpload')}
                </Button>
              </div>
            </>
          ) : (
            <UploadDragger
              beforeUpload={onUploadBefore}
              customRequest={onUploadFileClick}
              showUploadList={false}
              maxCount={1}
            >
              <IconFont
                style={{
                  color: 'var(--neutral-n2)',
                  fontSize: 40,
                  marginBottom: 8,
                }}
                type="upload"
              />
              <div
                style={{
                  color: 'var(--neutral-n2)',
                  fontSize: 14,
                  lineHeight: '14px',
                }}
              >
                {t('newlyAdd.clickOrDrag')}
              </div>
              <span style={{ color: 'var(--neutral-n3)', fontSize: 12 }}>
                {t('newlyAdd.uploadLimit')}
              </span>
              <div className="uploadModal">
                <div className="content">
                  <div className="circle">
                    <IconFont
                      style={{
                        color: '#FFFFFF',
                        fontSize: 24,
                      }}
                      type="upload"
                    />
                  </div>
                  <span className="text">{t('common.uploadFile')}</span>
                </div>
              </div>
            </UploadDragger>
          )}
        </>
      )}

      {step === 2 ? (
        <>
          {spinLoading ? (
            <CommonWrap style={{ height: 443 }}>
              <Spin
                indicator={<NewLoadingTransition />}
                spinning={spinLoading}
              />
              <div
                style={{
                  fontSize: 18,
                  color: 'var(--neutral-n1-d1)',
                  marginTop: 20,
                }}
              >
                {t('newlyAdd.importIng')}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: 'var(--neutral-n2)',
                  margin: '8px 0 56px 0',
                }}
              >
                {t('newlyAdd.uploadToast')}
              </span>
            </CommonWrap>
          ) : null}
        </>
      ) : null}

      {step === 3 ? (
        <>
          {importExcel?.errorCount ? (
            <CommonWrap>
              <div
                style={{
                  height: 415,
                  textAlign: 'center',
                }}
              >
                <IconFont
                  type="Warning"
                  style={{ fontSize: 80, color: '#FA9746' }}
                />
                <div
                  style={{
                    fontSize: 18,
                    color: 'var(--neutral-n1-d1)',
                    marginTop: 20,
                  }}
                >
                  {t('newlyAdd.importError')}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    color: 'var(--neutral-n2)',
                    marginTop: 8,
                  }}
                >
                  {t('newlyAdd.importSuccessTotal')}
                  {importExcel?.successCount || 0}，
                  {t('newlyAdd.importErrorTotal')}
                  {importExcel?.errorCount}，{t('newlyAdd.importErrorToast')}
                </span>
                <ItemWrap style={{ marginTop: 16 }}>
                  <ContentWrap width={120} hasBg style={{ paddingLeft: 16 }}>
                    {t('newlyAdd.lineError')}
                  </ContentWrap>
                  <ContentWrap width={616} hasBg style={{ textAlign: 'left' }}>
                    {t('newlyAdd.errorReason')}
                  </ContentWrap>
                </ItemWrap>
                <div style={{ maxHeight: 228, overflow: 'auto' }}>
                  {importExcel?.errorList &&
                    Object.keys(importExcel?.errorList)?.map((i: any) => (
                      <ItemWrap key={i}>
                        <ContentWrap width={120} style={{ paddingLeft: 16 }}>
                          {i}
                        </ContentWrap>
                        <ContentWrap width={616} style={{ textAlign: 'left' }}>
                          {importExcel?.errorList[i].join(';')}
                        </ContentWrap>
                      </ItemWrap>
                    ))}
                </div>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  width: '100%',
                  margin: '32px 0 24px 0',
                }}
              >
                <Button type="primary" onClick={onClear}>
                  {t('newlyAdd.aginImport')}
                </Button>
              </div>
            </CommonWrap>
          ) : (
            <CommonWrap
              style={{
                height: 503,
                textAlign: 'center',
              }}
            >
              <IconFont
                type="check-circle"
                style={{ fontSize: 80, color: '#43BA9A' }}
              />
              <div
                style={{
                  fontSize: 18,
                  color: 'var(--neutral-n1-d1)',
                  marginTop: 20,
                }}
              >
                {t('newlyAdd.importSuccess')}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: 'var(--neutral-n2)',
                  marginTop: 8,
                }}
              >
                {t('newlyAdd.importSuccessTotal')}
                {importExcel?.successCount}
              </span>
              <Space size={16} style={{ margin: '56px 0' }}>
                <CommonButton type="light" onClick={onClear}>
                  {t('newlyAdd.continueImport')}
                </CommonButton>
                <Button
                  type="primary"
                  onClick={() => {
                    onClear()
                    onUpdate()
                  }}
                >
                  {t('container.finish')}
                </Button>
              </Space>
            </CommonWrap>
          )}
        </>
      ) : null}
    </Wrap>
  )
}

export default CommonImport
