/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable complexity */
/* eslint-disable consistent-return */
/* eslint-disable multiline-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
import { StepBoxWrap } from '@/components/StyleCommon'
import styled from '@emotion/styled'
import IconFont from '@/components/IconFont'
import { Upload, Table, message, Spin, Space } from 'antd'
import { AsyncButton as Button } from '@staryuntech/ant-pro'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatFileSize, uploadFile } from '@/services/cos'
import FieldsTemplate from './FieldsTemplate'
import { useModel } from '@/models'
import { useSearchParams } from 'react-router-dom'
import { getParamsData } from '@/tools'

const Wrap = styled.div({
  height: 570,
  paddingRight: 20,
})

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

const ImportDemand = () => {
  const [step, setStep] = useState(1)
  const [tabs, setTabs] = useState(2)
  const [fileList, setFileList] = useState<any>([])
  const [t] = useTranslation()
  const [spinLoading, setSpinLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const {
    getImportDownloadModel,
    getImportExcel,
    importExcel,
    getImportExcelUpdate,
  } = useModel('demand')
  const { setIsRefresh } = useModel('user')
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
    const blob = new Blob([result.body], {
      type: result.headers['content-type'],
    })
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = '下载模板'
    a.href = blobUrl
    a.click()
    setIsVisible(false)
  }

  return (
    <Wrap>
      {isVisible && (
        <FieldsTemplate
          visible={isVisible}
          title="导入需求字段选择"
          importState={tabs}
          onClose={() => setIsVisible(false)}
          onConfirm={onConfirmTemplate}
        />
      )}
      <StepWrap>
        <StepBoxWrap active={step === 1}>
          <div className="circle">1</div>
          <span>上传需求</span>
        </StepBoxWrap>
        <div
          style={{
            width: 160,
            height: 1,
            background: '#EBEDF0',
            margin: '0 8px',
          }}
        />
        <StepBoxWrap active={step === 2}>
          <div className="circle">2</div>
          <span>系统导入</span>
        </StepBoxWrap>
        <div
          style={{
            width: 160,
            height: 1,
            background: '#EBEDF0',
            margin: '0 8px',
          }}
        />
        <StepBoxWrap active={step === 3}>
          <div className="circle">3</div>
          <span>导入完成</span>
        </StepBoxWrap>
      </StepWrap>
      {step === 1 ? (
        <>
          <TabsWrap>
            <TabsItem active={tabs === 2} onClick={() => setTabs(2)}>
              导入新建
            </TabsItem>
            <TabsItem active={tabs === 1} onClick={() => setTabs(1)}>
              导入更新
            </TabsItem>
          </TabsWrap>
          {tabs === 1 ? (
            <TextWrap>
              <div>
                1.请先下载模板，在模板中填写需要导入的信息，然后上传该文件导入的需求个数需小于100,需求字段不符合规则，整条需求不予以导入
              </div>
              <span>1）“需求类别”字段为必填项；</span>
              <span>2）“标题”字段为必填项；</span>
              <span>3）“优先级”请填写：极高、高、中、低、极低；</span>
              <span>
                4）“父需求”请填写ID，请满足如下条件：1 父需求在本项目下；
              </span>
              <span>5）人员类型字段请填写人员的昵称；</span>
              <span>6）日期型字段格式为：YYYY/MM/DD；</span>
              <span>
                7）多选类型的自定义字段格式为：a|b|c,请用‘|’隔开多个选项；
              </span>
              <span>8）其他字段值，请确保与项目中配置的值保持一致。</span>
            </TextWrap>
          ) : (
            <TextWrap>
              <div>
                1.请先下载模板，在模板中填写需要导入的信息，然后上传该文件导入的需求个数需小于100,需求字段不符合规则，整条需求不予以导入
              </div>
              <span>1）ID字段必须在excel中（为必填）；</span>
              <span>2）优先级请填写：极高、高、中、低、极低；</span>
              <span>3）人员类型字段请填写人员的昵称；</span>
              <span>4）日期型字段格式为：YYYY/MM/DD；</span>
              <span>
                5）多选类型的自定义字段格式为：a|b|c,请用‘|’隔开多个选项；
              </span>
              <span>6）其他字段值，请确保与项目中配置的值保持一致；</span>
              <span>
                7）
                更新方式填写“1”空数据字段覆盖原来字段参数为空；填写“0”空数据不覆盖原来字段参数；
              </span>
              <span>8）不支持对不在访问范围的需求进行更新。</span>
            </TextWrap>
          )}
          <Button
            onClick={() => setIsVisible(true)}
            style={{ background: '#F0F4FA', color: '#2877ff', marginTop: 24 }}
          >
            下载模板
          </Button>
          {fileList?.length > 0 ? (
            <>
              {fileList?.map((ele: any) => (
                <div
                  key={ele.uid}
                  style={{
                    marginTop: 24,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <IconFont
                    style={{ fontSize: 24, marginRight: 4 }}
                    type="colorXLS"
                  />
                  <span>
                    {ele.name} ({formatFileSize(ele.size)})
                  </span>
                </div>
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
                  重新选择
                </Button>
                <Button type="primary" onClick={onConfirmUpload}>
                  开始上传
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
                点击或将文件拖拽到这里上传
              </div>
              <span style={{ color: '#969799', fontSize: 12 }}>
                目前支持的文件类型为*.xls，*.xlsx
              </span>
            </UploadDragger>
          )}
        </>
      ) : null}

      {step === 2 ? (
        <>
          {spinLoading ? (
            <CommonWrap style={{ height: 443 }}>
              <Spin spinning={spinLoading} />
              <div style={{ fontSize: 18, color: '#323233', marginTop: 20 }}>
                正在导入，请稍后...
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: '#646566',
                  margin: '8px 0 56px 0',
                }}
              >
                温馨提示：请勿关闭窗口，否则可能导致数据错误
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
                  type="close-circle-fill"
                  style={{ fontSize: 80, color: '#FF5C5E' }}
                />
                <div style={{ fontSize: 18, color: '#323233', marginTop: 20 }}>
                  导入失败！
                </div>
                <span style={{ fontSize: 14, color: '#646566', marginTop: 8 }}>
                  共计导入需求数量：{importExcel?.successCount || 0}，
                  其中导入错误数量：{importExcel?.errorCount}，
                  本次整个表格都未导入，请对照错误原型修改后重新导入
                </span>
                <ItemWrap style={{ marginTop: 16 }}>
                  <ContentWrap width={120} hasBg>
                    错误行号
                  </ContentWrap>
                  <ContentWrap width={616} hasBg>
                    错误原因
                  </ContentWrap>
                </ItemWrap>
                {importExcel?.errorList
                  && Object.keys(importExcel?.errorList)?.map((i: any) => (
                    <ItemWrap key={i}>
                      <ContentWrap width={120}>{i}</ContentWrap>
                      <ContentWrap width={616}>
                        {importExcel?.errorList[i].join(';')}
                      </ContentWrap>
                    </ItemWrap>
                  ))}
              </div>
              <div
                style={{
                  textAlign: 'right',
                  width: '100%',
                  margin: '32px 0 24px 0',
                }}
              >
                <Button type="primary" onClick={onClear}>
                  重新导入
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
                导入成功！
              </div>
              <span style={{ fontSize: 14, color: '#646566', marginTop: 8 }}>
                共计导入需求数量：{importExcel?.successCount}
              </span>
              <Space size={16} style={{ margin: '56px 0' }}>
                <Button
                  style={{ color: '#2877ff', background: '#F0F4FA' }}
                  onClick={onClear}
                >
                  继续导入
                </Button>
                <Button type="primary" onClick={onClear}>
                  完成
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
