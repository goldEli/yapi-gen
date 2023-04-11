import CommonButton from '@/components/CommonButton'
import { CommonIconFont } from '@/components/CommonIconFont'
import {
  CheckboxWrap,
  MainWrap,
  OperationWrap,
  PermissionItem,
  TitleGroup,
} from '@/views/ProjectSetting/components/ProjectSet'
import { Breadcrumb, message } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { First, Wrap } from './style'
import { useDispatch, useSelector } from '@store/index'
import { editMyAllNoteSet } from '@/services/SiteNotifications'
import { setMyConfiguration } from '@store/SiteNotifications'
import { log } from 'console'

const Setting = () => {
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const [selectKeys, setSelectKeys] = useState<any>()
  const configurations = useSelector(
    store => store.siteNotifications.configuration,
  )
  const myConfiguration = useSelector(
    store => store.siteNotifications.myConfiguration,
  )
  const myEmailConfiguration = useSelector(
    store => store.siteNotifications.myEmailConfiguration,
  )
  const [activeDetail, setActiveDetail] = useState<any>({})
  // const obj = {
  //   list: [
  //     {
  //       name: '需求',
  //       children: [
  //         {
  //           label: '创建需求',
  //           value: 19,
  //           checked: true,
  //         },
  //         {
  //           label: '删除需求',
  //           value: 20,
  //           checked: true,
  //         },
  //         {
  //           label: '编辑需求',
  //           value: 21,
  //           checked: true,
  //         },
  //         {
  //           label: '附件上传',
  //           value: 22,
  //           checked: true,
  //         },
  //         {
  //           label: '附件下载',
  //           value: 23,
  //           checked: true,
  //         },
  //         {
  //           label: '需求筛选',
  //           value: 24,
  //           checked: true,
  //         },
  //         {
  //           label: '参与评论',
  //           value: 25,
  //           checked: true,
  //         },
  //         {
  //           label: '导入需求',
  //           value: 37,
  //           checked: true,
  //         },
  //         {
  //           label: '需求分类管理',
  //           value: 38,
  //           checked: true,
  //         },
  //         {
  //           label: '导出需求',
  //           value: 40,
  //           checked: true,
  //         },
  //         {
  //           label: '批量操作',
  //           value: 43,
  //           checked: true,
  //         },
  //       ],
  //     },
  //     {
  //       name: '迭代',
  //       children: [
  //         {
  //           label: '创建迭代',
  //           value: 26,
  //           checked: true,
  //         },
  //         {
  //           label: '删除迭代',
  //           value: 27,
  //           checked: true,
  //         },
  //         {
  //           label: '编辑迭代',
  //           value: 28,
  //           checked: true,
  //         },
  //         {
  //           label: '迭代状态更改',
  //           value: 29,
  //           checked: true,
  //         },
  //         {
  //           label: '迭代筛选',
  //           value: 30,
  //           checked: true,
  //         },
  //         {
  //           label: '迭代成果查看',
  //           value: 41,
  //           checked: true,
  //         },
  //         {
  //           label: '迭代成果编辑',
  //           value: 42,
  //           checked: true,
  //         },
  //       ],
  //     },
  //     {
  //       name: '项目设置',
  //       children: [
  //         {
  //           label: '添加项目成员',
  //           value: 31,
  //           checked: true,
  //         },
  //         {
  //           label: '编辑项目成员',
  //           value: 32,
  //           checked: true,
  //         },
  //         {
  //           label: '移除项目成员',
  //           value: 33,
  //           checked: true,
  //         },
  //         {
  //           label: '项目权限组设置',
  //           value: 34,
  //           checked: true,
  //         },
  //         {
  //           label: '需求设置',
  //           value: 35,
  //           checked: true,
  //         },
  //         {
  //           label: '查看成员详情',
  //           value: 36,
  //           checked: true,
  //         },
  //         {
  //           label: 'role.项目通知配置',
  //           value: 54,
  //           checked: false,
  //         },
  //       ],
  //     },
  //   ],
  // }

  const onSave = async () => {
    const res = await editMyAllNoteSet(
      selectKeys,
      // Array.from(new Set([...myEmailConfiguration, ...selectKeys])),
    )

    if (res.code === 0) {
      message.success(t('succeed'))
    }
    dispatch(setMyConfiguration(selectKeys))
  }
  useEffect(() => {
    console.log(myConfiguration)

    setSelectKeys(myConfiguration)
  }, [myConfiguration])

  return (
    <Wrap>
      <First>
        <Breadcrumb
          separator={
            <CommonIconFont
              type="right"
              size={14}
              color="var(--neutral-n1-d1)"
            />
          }
        >
          <Breadcrumb.Item>
            <span style={{ color: 'var(--neutral-n1-d1)' }}>
              {t('notification')}
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{t('notification_settings')}</Breadcrumb.Item>
        </Breadcrumb>
        <CommonButton onClick={onSave} type="primary">
          <span>{t('common.save')}</span>
        </CommonButton>
      </First>
      <div>
        <TitleGroup>
          <CheckboxWrap>{t('setting.all')}</CheckboxWrap>
          <OperationWrap>{t('operand')}</OperationWrap>
          <span>{t('common.permission')}</span>
        </TitleGroup>
        <MainWrap>
          {configurations.map((i: any) => (
            <PermissionItem
              key={i.id}
              item={i}
              onChange={setSelectKeys}
              value={selectKeys}
              activeDetail={activeDetail}
            />
          ))}
        </MainWrap>
      </div>
    </Wrap>
  )
}

export default Setting
