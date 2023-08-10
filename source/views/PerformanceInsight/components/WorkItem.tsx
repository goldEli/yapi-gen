/* eslint-disable react/jsx-handler-names */
import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import MultipleAvatar from '@/components/MultipleAvatar'
import StateTag from '@/components/StateTag'
import { getParamsData } from '@/tools'
import { encryptPhp } from '@/tools/cryptoPhp'
import { Select, Space } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Detail from './Detail'
import DetailHeader from './DetailHeader'
import { useTranslation } from 'react-i18next'
import NewLoadingTransition from '@/components/NewLoadingTransition'
import {
  TableStyle,
  Title,
  Text,
  FilterType,
  MainStyle,
  UserMsg,
  UserInfo,
  RowTableCol,
  SpinStyle,
} from './style'
import Table from './Table'
interface Props {
  spinning: boolean
  visible: boolean
  status: Array<Model.Sprint.StatusInfo1>
  userInfo: Model.Sprint.UserInfo2
  type: string
  ids: number[]
  memberWorkList: API.Sprint.EfficiencyMemberWorkList.Result | undefined
  onPageNum: (id: number) => void
  onCancel: () => void
  onChange: (value: API.Sprint.EfficiencyMemberWorkList.Params) => void
  statusType: string
}
interface UserInfo {
  statusType: string
  userInfo: Model.Sprint.UserInfo2
  status: Array<Model.Sprint.StatusInfo1>
  memberWorkList: API.Sprint.EfficiencyMemberWorkList.Result | undefined
  onChange: (value: API.Sprint.EfficiencyMemberWorkList.Params) => void
}
const Main = (props: UserInfo) => {
  const [t] = useTranslation()
  const [searchParams] = useSearchParams()
  const paramsData = getParamsData(searchParams)
  const navigate = useNavigate()
  const columns = [
    {
      title: t('common.serialNumber'),
      dataIndex: 'story_prefix_key',
      render: (
        text: string,
        record: {
          id: number
          project_id: number
          category_attachment: string
          project_type: number
          story_type: number
        },
      ) => {
        return (
          <RowTableCol>
            <div className="text" onClick={() => onGoTo(record)}>
              {text}
            </div>
          </RowTableCol>
        )
      },
    },
    {
      title: t('common.title'),
      dataIndex: 'name',
      render: (text: string, record: { category_attachment: string }) => {
        return (
          <RowTableCol>
            <img style={{ width: 18 }} src={record.category_attachment} />
            <div className="text">{text}</div>
          </RowTableCol>
        )
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      render: (text: number, record: any) => {
        return (
          <StateTag name={record.story_config_status.content} state={text} />
        )
      },
    },
    {
      title: t('common.createName'),
      dataIndex: 'expected_start_at',
      render: (
        text: string,
        record: { user: { avatar: string; name: string } },
      ) => {
        return <MultipleAvatar max={1} list={[record.user]} />
      },
    },
    {
      title: t('common.dealName'),
      dataIndex: 'expected_start_at',
      render: (
        text: string,
        record: {
          relate_users: Array<{ name: string; avatar: string; id: number }>
        },
      ) => {
        return (
          <MultipleAvatar
            max={record.relate_users.length === 1 ? 1 : 3}
            list={record.relate_users}
          />
        )
      },
    },
    {
      title: t('common.createTime'),
      dataIndex: 'created_at',
      width: 200,
      render: (text: string, record: { category_attachment: string }) => {
        return <div className="text">{text}</div>
      },
    },
  ]
  const onGoTo = (row: {
    id: number
    project_type: number
    story_type: number
    project_id: number
  }) => {
    // 事务
    if (row.project_type === 2) {
      const params = encryptPhp(
        JSON.stringify({
          id: row.project_id,
          detailId: row.id,
          isOpenScreenDetail: true,
          changeIds: [],
          specialType: 1,
        }),
      )
      const url = `SprintProjectManagement/Affair?data=${params}`
      window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
    } else if (row.project_type === 1 && row.story_type === 2) {
      // 缺陷
      const params = encryptPhp(
        JSON.stringify({
          id: row.project_id,
          detailId: row.id,
          isOpenScreenDetail: true,
          changeIds: [],
          specialType: 2,
        }),
      )
      const url = `ProjectManagement/Defect?data=${params}`
      window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
    } else {
      // 需求
      const params = encryptPhp(
        JSON.stringify({
          id: row.project_id,
          detailId: row.id,
          isOpenScreenDetail: true,
          changeIds: [],
          specialType: 3,
        }),
      )
      const url = `ProjectManagement/Demand?data=${params}`
      window.open(`${window.origin}${import.meta.env.__URL_HASH__}${url}`)
    }
  }
  return (
    <MainStyle>
      <UserMsg>
        <CommonUserAvatar size="large" avatar={props.userInfo.avatar} />
        <UserInfo>
          <div>
            {props.userInfo?.name}（
            {props.userInfo?.email ? props.userInfo?.email : '--'}）
          </div>
          <div className="msg">
            <Space size={4}>
              {props.userInfo.departments?.map((el, index: number) => (
                <>
                  <span>{el.name}</span>
                  {index !== props.userInfo.departments.length - 1 && (
                    <CommonIconFont
                      type="right"
                      size={14}
                      color="var(--neutral-n3)"
                    />
                  )}
                </>
              ))}
            </Space>
          </div>
        </UserInfo>
      </UserMsg>
      <FilterType>
        <Title>
          {props.memberWorkList?.total?.name}：
          {props.memberWorkList?.total?.value}
          {props.memberWorkList?.total?.unit}
        </Title>
        {paramsData.homeType !== 'all' && (
          <Text
            onClick={() => {
              const params = encryptPhp(
                JSON.stringify({
                  id: paramsData.projectId,
                  isMember: true,
                  userId: props.userInfo.id,
                }),
              )
              navigate(`/MemberInfo/Profile?data=${params}`)
            }}
          >
            {/* 需要跳转到他的页面 概况待办 */}
            <span className="text">{t('watcjAll')}</span>
            <CommonIconFont
              type="right"
              size={16}
              color="var(--auxiliary-text-t2-d2)"
            />
          </Text>
        )}
      </FilterType>
      <Select
        style={{
          width: 184,
        }}
        placeholder={t('s')}
        onChange={(newValue: any) => {
          props.onChange({
            user_id: props.userInfo.id,
            type: props.statusType,
            status_name: newValue,
          })
        }}
        suffixIcon={<CommonIconFont type="down" />}
        options={props.status}
        notFoundContent={null}
      />
      <TableStyle>
        <Table
          paginationShow={false}
          columns={columns}
          dataSource={props.memberWorkList?.list || []}
          isSpinning={false}
          data={{
            currentPage: 2,
            total: 80,
            pageSize: 20,
          }}
          onChangePage={(pageNum, pageSize) => 123}
        />
      </TableStyle>
    </MainStyle>
  )
}
const WorkItem = (props: Props) => {
  return (
    <Detail
      children={
        <div className="workItem">
          <SpinStyle
            spinning={props.spinning}
            indicator={<NewLoadingTransition />}
          >
            <DetailHeader
              ids={props.ids}
              onCancel={() => props.onCancel()}
              infoId={props.userInfo.id}
              onPageNum={props.onPageNum}
            />
            <Main
              statusType={props.statusType}
              onChange={props.onChange}
              memberWorkList={props.memberWorkList}
              userInfo={props.userInfo}
              status={props.status}
            />
          </SpinStyle>
        </div>
      }
      visible={props.visible}
    />
  )
}
export default WorkItem
