/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable react/jsx-no-useless-fragment */
import { StepBoxWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Upload, message, Spin, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatFileSize } from '@/services/cos'
import FieldsTemplate from './FieldsTemplate'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

const Wrap = styled.div<{ language: any }>(
  {
    paddingRight: 20,
  },
  ({ language }) => ({
    minHeight: language === 'zh' ? 570 : 594,
  }),
)

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
    color: active ? '#2877ff' : '#323233',
    borderBottom: active ? '3px solid #2877ff' : '3px solid white',
    fontWeight: active ? 'bold' : 400,
  }),
)

const TextWrap = styled.div({
  color: '#969799',
  fontSize: 12,
  lineHeight: '20px',
  display: 'flex',
  flexDirection: 'column',
  div: {
    marginBottom: 8,
  },
})

const UploadDragger = styled(Upload.Dragger)({
  height: '122px!important',
  background: 'white!important',
  border: '1px dashed #D5D6D9!important',
  marginTop: 24,
})

const CommonWrap = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const ContentWrap = styled.div<{ hasBg?: true; width: number }>(
  {
    height: 32,
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: 12,
    color: '#323233',
  },
  ({ width, hasBg }) => ({
    width,
    background: hasBg ? '#F2F2F4' : '',
  }),
)

const ItemWrap = styled.div({
  display: 'flex',
  alignItems: 'center',
})

const IconFontWrap = styled(IconFont)({
  fontSize: 16,
  color: '#969799',
  cursor: 'pointer',
  '&: hover': {
    color: '#2877ff',
  },
})

const FilesItems = styled.div({
  marginTop: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const ImportDemand = () => {
  const [step, setStep] = useState(1)
  const [tabs, setTabs] = useState(2)
  const [fileList, setFileList] = useState<any>([])
  const [t, i18n] = useTranslation()
  const [spinLoading, setSpinLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const {
    getImportDownloadModel,
    getImportExcel,
    importExcel,
    getImportExcelUpdate,
  } = useModel('demand')
  const { setIsRefresh } = useModel('user')
  const { projectInfo } = useModel('project')
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const projectId = paramsData.id

  const onUploadBefore = (file: any) => {
    const acceptArr = ['xlsx', 'xls']
    const urlType = file.name.split('.')
    if (!acceptArr.includes(urlType[urlType.length - 1])) {
      message.warning(t('project.incorrectFormat'))
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
      tabs === 1
        ? await getImportExcelUpdate({ projectId, filePath: result })
        : await getImportExcel({ projectId, filePath: result })
      setSpinLoading(false)
      setStep(3)
      setIsRefresh(true)
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
        message.error(obj.message)
      }
    } else {
      const blob = new Blob([result.body], {
        type: result.headers['content-type'],
      })
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = `${projectInfo?.name} - ${
        tabs === 2 ? t('newlyAdd.importCreate') : t('newlyAdd.importUpdate')
      }`
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
      {isVisible && (
        <FieldsTemplate
          visible={isVisible}
          title={t('newlyAdd.importChoose')}
          importState={tabs}
          onClose={() => setIsVisible(false)}
          onConfirm={onConfirmTemplate}
          isExport={false}
        />
      )}
      <StepWrap>
        <StepBoxWrap active={step === 1}>
          <div className="circle">1</div>
          <span>{t('newlyAdd.uploadDemand')}</span>
        </StepBoxWrap>
        <div
          style={{
            width: i18n.language === 'zh' ? 160 : 148,
            height: 1,
            background: '#EBEDF0',
            margin: '0 8px',
          }}
        />
        <StepBoxWrap active={step === 2}>
          <div className="circle">2</div>
          <span>{t('newlyAdd.systemImport')}</span>
        </StepBoxWrap>
        <div
          style={{
            width: i18n.language === 'zh' ? 160 : 148,
            height: 1,
            background: '#EBEDF0',
            margin: '0 8px',
          }}
        />
        <StepBoxWrap active={step === 3}>
          <div className="circle">3</div>
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
              <div>{t('newlyAdd.importText1')}</div>
              <span>{t('newlyAdd.importText2')}</span>
              <span>{t('newlyAdd.importText3')}</span>
              <span>{t('newlyAdd.importText4')}</span>
              <span>{t('newlyAdd.importText5')}</span>
              <span>{t('newlyAdd.importText6')}</span>
              <span>{t('newlyAdd.importText7')}</span>
              <span>{t('newlyAdd.importText8')}</span>
              <span>{t('newlyAdd.importText9')}</span>
            </TextWrap>
          )}
          {tabs === 1 && (
            <TextWrap>
              <div>{t('newlyAdd.importText1')}</div>
              <span>{t('newlyAdd.importText10')}</span>
              <span>{t('newlyAdd.importText4')}</span>
              <span>{t('newlyAdd.importText6')}</span>
              <span>{t('newlyAdd.importText7')}</span>
              <span>{t('newlyAdd.importText8')}</span>
              <span>{t('newlyAdd.importText9')}</span>
              <span>{t('newlyAdd.importText11')}</span>
              <span>{t('newlyAdd.importText12')}</span>
            </TextWrap>
          )}
          <Button
            onClick={() => setIsVisible(true)}
            style={{ background: '#F0F4FA', color: '#2877ff', marginTop: 24 }}
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
                      type="colorXLS"
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
                <Button
                  style={{ marginRight: 16 }}
                  onClick={() => setFileList([])}
                >
                  {t('newlyAdd.aginChoose')}
                </Button>
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
                style={{ color: '#646566', fontSize: 40, marginBottom: 8 }}
                type="upload"
              />
              <div
                style={{
                  color: '#646566',
                  fontSize: 14,
                  lineHeight: '14px',
                }}
              >
                {t('newlyAdd.clickOrDrag')}
              </div>
              <span style={{ color: '#969799', fontSize: 12 }}>
                {t('newlyAdd.uploadLimit')}
              </span>
            </UploadDragger>
          )}
        </>
      )}

      {step === 2 ? (
        <>
          {spinLoading ? (
            <CommonWrap style={{ height: 443 }}>
              <Spin spinning={spinLoading} />
              <div style={{ fontSize: 18, color: '#323233', marginTop: 20 }}>
                {t('newlyAdd.importIng')}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: '#646566',
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
                <div style={{ fontSize: 18, color: '#323233', marginTop: 20 }}>
                  {t('newlyAdd.importError')}
                </div>
                <span style={{ fontSize: 14, color: '#646566', marginTop: 8 }}>
                  {t('newlyAdd.importSuccessTotal')}
                  {importExcel?.successCount || 0}，
                  {t('newlyAdd.importErrorTotal')}
                  {importExcel?.errorCount}，{t('newlyAdd.importErrorToast')}
                </span>
                <ItemWrap style={{ marginTop: 16 }}>
                  <ContentWrap width={120} hasBg>
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
                        <ContentWrap width={120}>{i}</ContentWrap>
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
                type="checked-poster"
                style={{ fontSize: 80, color: '#43BA9A' }}
              />
              <div style={{ fontSize: 18, color: '#323233', marginTop: 20 }}>
                {t('newlyAdd.importSuccess')}
              </div>
              <span style={{ fontSize: 14, color: '#646566', marginTop: 8 }}>
                {t('newlyAdd.importSuccessTotal')}
                {importExcel?.successCount}
              </span>
              <Space size={16} style={{ margin: '56px 0' }}>
                <Button
                  style={{ color: '#2877ff', background: '#F0F4FA' }}
                  onClick={onClear}
                >
                  {t('newlyAdd.continueImport')}
                </Button>
                <Button type="primary" onClick={onClear}>
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

export default ImportDemand
