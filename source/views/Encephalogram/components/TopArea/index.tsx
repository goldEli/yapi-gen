import { useEffect, useState } from 'react'
import { TYPE_ENCEPHALOGRAM } from '@/constants'
import {
  TopAreaWrap,
  TopAreaBox,
  TypeBox,
  Row,
  Bgc,
  Text,
  TypeSelectBox,
  PopoverBtn,
  Content,
  HeaderPopover,
  MianHeader,
  Title,
  Msg,
  HeaderMsg,
  Type,
  CenterWrap,
  TimeWrap,
  TextWrap,
  CustomSelectWrap,
  RangePickerWrap,
  PersonMain,
  RowTree,
  TextTree,
} from '@/views/Encephalogram/styles'
import { Checkbox, Input, Popover, Space, Image } from 'antd'
import IconFont from '@/components/IconFont'
import MoreSelect from '@/components/MoreSelect'
import RangePicker from '@/components/RangePicker'
import moment from 'moment'
import MyBreadcrumb from '@/components/MyBreadcrumb'
import { useDispatch } from 'react-redux'
import { setEncephalogramParams } from '@store/encephalogram'
import { useSelector } from '@store/index'
import { getIterateList } from '@/services/iterate'
import { useTranslation } from 'react-i18next'
import { getMapMembers } from '@/services/map'
import useMapData from '@/views/Encephalogram/hook/useMapData'
import _ from 'lodash'

const TopArea = () => {
  const [t] = useTranslation()
  const [clickeMsg, setClickeMsg] = useState(false)
  const [clickePerson, setClickePerson] = useState(false)
  const [date, setDate] = useState<any>(null)
  const [personData, setPersonData] = useState<any>()
  const value: any = []
  const [personVal, setPersonVal] = useState(value)
  const [dataList, setDataList] = useState<any>()
  const [search, setSearch] = useState('')
  const [length, setLength] = useState(0)
  const [stateVal, setStateVal] = useState([])
  const dispatch = useDispatch()
  // 状态的
  const [priorityList, setPriorityList] = useState()
  // 迭代的
  const [interateList, setInterateList] = useState()
  const { projectInfoValues, projectInfo } = useSelector(store => store.project)
  const { searchParamsRef, getRenderData } = useMapData()
  const searchData = _.debounce(getRenderData, 1000)
  useEffect(() => {
    // 状态的
    const list = projectInfoValues
      .find(item => item.key === 'status')
      ?.children?.filter((l: any) => l.id > 0)
    const newData = list?.map((v: { name: any; statuss: any[] }) => ({
      label: v.name,
      children: v?.statuss?.map((val: any) => ({
        label: val.content_txt || val.content,
        value: val?.pivot?.id,
        id: val?.pivot?.id,
      })),
    }))
    setPriorityList(newData)
  }, [projectInfoValues])
  // 项目人员
  const getProject = async () => {
    const res = await getMapMembers({
      project_id: projectInfo.id,
    })
    // 组装项目成员的数据
    const newChild: any = res.map((el: any) => ({
      ...el,
      fold: true,
      len: el.members.length,
      checked:
        el.members.length ===
        el.members.filter((item: any) => value.includes(item.id)).length,
      children: el.members.map((item: any) => ({
        ...item,
        checked: value.includes(item.id),
      })),
    }))
    let len = 0
    newChild.forEach((el: { len: number }) => {
      len += el.len
    })
    setLength(len)
    setPersonVal([...value])
    setPersonData(newChild)
    setDataList(newChild)
  }
  const getInterateList = async () => {
    // 获取迭代下拉数据
    const response = await getIterateList({
      projectId: projectInfo.id,
    })
    setInterateList(
      response?.list?.map((i: any) => ({
        label: i.name,
        value: i.id,
      })),
    )
  }
  useEffect(() => {
    // 项目人员
    getProject()
    // 迭代下拉
    getInterateList()
  }, [])
  const content = () => {
    const statusArr = [
      {
        id: 1,
        name: t('inProgress'),
        color: '#43BA9A',
        bg: 'rgba(67,186,154,0.1)',
      },
      {
        id: 2,
        name: t('completed'),
        color: '#A176FB',
        bg: 'rgba(161,118,251,0.1)',
      },
      {
        id: 3,
        name: t('paused'),
        color: '#FA9746',
        bg: 'rgba(250,151,70,0.1)',
      },
      {
        id: 4,
        name: t('hasNotStarted'),
        color: '#6688FF',
        bg: 'rgba(102,136,255,0.1)',
      },
    ]
    return (
      <Content>
        <HeaderPopover>
          <span>项目介绍</span>
          <IconFont
            onClick={() => setClickeMsg(false)}
            type="close"
            style={{ color: 'var(--neutral-n2)' }}
          />
        </HeaderPopover>
        <MianHeader>
          <div className="leftWrap">
            <img src={projectInfo.cover} />
            <HeaderMsg>
              <Title>{projectInfo.name}</Title>
              <Msg>项目负责人：{projectInfo.leaderName}</Msg>
            </HeaderMsg>
          </div>
          <Type
            color={
              statusArr?.find((i: any) => i.id === projectInfo.status)?.color ||
              ''
            }
            bgc={
              statusArr?.find((i: any) => i.id === projectInfo.status)?.bg || ''
            }
          >
            <div className="border" />
            <div>
              {statusArr?.find((i: any) => i.id === projectInfo.status)?.name}
            </div>
          </Type>
        </MianHeader>
        <CenterWrap>
          <div className="col">
            <span>{projectInfo.storyCount || 0}</span>
            <span>任务</span>
          </div>
          <div className="col">
            <span>{projectInfo.iterateCount || 0}</span>
            <span>冲刺</span>
          </div>
          <div className="col">
            <span>{projectInfo.memberCount || 0}</span>
            <span>项目成员</span>
          </div>
        </CenterWrap>
        <TimeWrap>
          <Row className="timeRow">
            <span>开始时间：</span>
            <span>{projectInfo.expected_start_at || '--'}</span>
          </Row>
          <Row className="timeRow">
            <span>预计结束：</span>
            <span>{projectInfo.expected_end_at || '--'}</span>
          </Row>
        </TimeWrap>
        <TextWrap>{projectInfo.info || '--'}</TextWrap>
      </Content>
    )
  }
  // 点击父级，设置勾选获取value
  const onChangeF = (e: any, i: any) => {
    const newChild: any = personData.map((el: any) => ({
      ...el,
      checked: i.id === el.id ? e.target.checked : el.checked,
      children:
        i.id === el.id
          ? el.children.map((item: any) => ({
              ...item,
              checked: e.target.checked,
            }))
          : el.children,
    }))
    // 重装数据
    setPersonData(newChild)
    let newVal: any = []
    newVal = i.children.map((el: any) => el.id)
    // 组value
    if (e.target.checked) {
      const val = [...personVal, ...newVal]
      setPersonVal(val)
      searchParamsRef.current.person = val
      dispatch(
        setEncephalogramParams({
          person: val,
        }),
      )
    } else {
      const val = personVal.filter((el: any) => !newVal?.includes(el))
      searchParamsRef.current.person = val
      setPersonVal(val)
      dispatch(
        setEncephalogramParams({
          person: personVal.filter(val),
        }),
      )
    }
    searchData()
  }
  // 点击子级,设置勾选获取value
  const onChangeS = (e: any, i: any) => {
    const Child: any = personData.map((el: any) => ({
      ...el,
      children: el.children.map((item: any) => ({
        ...item,
        checked: i.id === item.id ? e.target.checked : item.checked,
      })),
    }))
    const newChild: any = Child.map((el: any) => ({
      ...el,
      checked:
        el.children.length ===
        el.children.filter((item: any) => item.checked).length,
    }))
    setPersonData(newChild)
    // 组value
    if (e.target.checked) {
      const val = [...personVal, i.id]
      searchParamsRef.current.person = val
      setPersonVal(val)
      dispatch(
        setEncephalogramParams({
          person: val,
        }),
      )
    } else {
      const val = personVal.filter((el: any) => el !== i.id)
      searchParamsRef.current.person = val
      setPersonVal(val)
      dispatch(
        setEncephalogramParams({
          person: val,
        }),
      )
    }
    searchData()
  }
  // 折叠
  const foldIcon = (e: { id: number; fold: boolean }) => {
    setPersonData(
      personData.map((el: any) => ({
        ...el,
        fold: el.id === e.id ? !el.fold : el.fold,
      })),
    )
  }
  // 人员搜索
  const onInput = (e: any) => {
    const str: string = e.target.value
    setPersonVal([])
    if (!str) {
      reset()
      return
    }
    setSearch(str)
    const newData: {
      name: string
      id: number
      fold: boolean
      len: number
      checked: boolean
      children: { name: string; id: number; fold: boolean; checked: boolean }[]
    }[] = []
    dataList.forEach((el: any) => {
      if (
        el.children.filter(
          (item: { name: string | string[] }) =>
            item.name.includes(str) || item.name === str,
        )?.length >= 1
      ) {
        newData.push({
          id: el.id,
          name: el.name,
          fold: false,
          len: el.len,
          checked: el.checked,
          children: el.children.filter((item: { name: string | string[] }) =>
            item.name.includes(str),
          ),
        })
      }
    })
    setPersonData(newData)
  }
  // 重置
  const reset = async () => {
    setSearch('')
    setPersonVal([])
    const newChild = dataList.map((el: any) => ({
      ...el,
      fold: true,
      len: el.members.length,
      checked: false,
      children: el.members.map((item: any) => ({
        ...item,
        checked: false,
      })),
    }))
    setPersonData(newChild)
    searchParamsRef.current.person = []
    dispatch(
      setEncephalogramParams({
        person: [],
      }),
    )
    searchData()
  }
  const contentPerson = () => {
    return (
      <Content>
        <HeaderPopover>
          <span>项目人员</span>
          <IconFont
            onClick={() => setClickePerson(false)}
            type="close"
            style={{ color: 'var(--neutral-n2)' }}
          />
        </HeaderPopover>
        <Input
          value={search}
          placeholder="搜索成员姓名"
          onInput={(e: any) => onInput(e)}
        />
        <Row>
          <div className="text">
            <span>已选</span>
            <span>
              （{personVal.length || 0}/{length}）
            </span>
          </div>
          <div className="text" onClick={reset}>
            重置
          </div>
        </Row>
        <PersonMain>
          {personData.map((el: any) => (
            <>
              <RowTree key={el.name}>
                <div className="rowChild">
                  <Checkbox
                    checked={el.checked}
                    onChange={e => onChangeF(e, el)}
                  />
                  <TextTree onClick={() => foldIcon(el)}>{el.name}</TextTree>
                </div>
                <IconFont
                  onClick={() => foldIcon(el)}
                  type={el.fold ? 'down' : 'up'}
                  style={{ color: 'var(--auxiliary-text-t2-d1)' }}
                />
              </RowTree>
              <div
                style={{
                  display: el.fold ? 'none' : 'block',
                  transition: 'all 0.5s',
                }}
              >
                {el.children?.length >= 1 &&
                  el.children?.map((item: any) => (
                    <RowTree key={item.name}>
                      <div className="rowChild">
                        <Checkbox
                          onChange={e => onChangeS(e, item)}
                          checked={item.checked}
                        />
                        <img
                          src={
                            item.avatar ||
                            'https://mj-system-1308485183.cos.accelerate.myqcloud.com/public/light.png'
                          }
                          width={32}
                          height={32}
                          style={{ borderRadius: 16 }}
                        />
                        <TextTree>{item.name}</TextTree>
                      </div>
                      <span className="rowChildtext">
                        {item.job_name || '--'}
                      </span>
                    </RowTree>
                  ))}
              </div>
            </>
          ))}
        </PersonMain>
      </Content>
    )
  }
  // 选中任务状态
  const onClickSearch = (value: []) => {
    searchParamsRef.current.state = value || []
    setStateVal(value || [])
    dispatch(
      setEncephalogramParams({
        state: value || [],
      }),
    )
    searchData()
  }
  // 选中迭代
  const onChangeSelect = (value: Array<number>) => {
    searchParamsRef.current.iterationVal = value || []
    dispatch(
      setEncephalogramParams({
        iterationVal: value || [],
      }),
    )
    searchData()
  }
  // 时间选择
  const onChangeTime = (dates: any) => {
    if (dates) {
      let s = moment(dates[0]).format('YYYY-MM-DD') || ''
      let d = moment(dates[1]).format('YYYY-MM-DD') || ''
      if (s === '1970-01-01') {
        searchParamsRef.current.time = []
        setDate(null)
        dispatch(
          setEncephalogramParams({
            time: [],
          }),
        )
        return
      }
      searchParamsRef.current.time = [s, d]
      setDate([s, d])
      dispatch(
        setEncephalogramParams({
          time: [s, d],
        }),
      )
    } else {
      setDate(null)
      searchParamsRef.current.time = []
      dispatch(
        setEncephalogramParams({
          time: [],
        }),
      )
    }
    searchData()
  }

  return (
    <TopAreaWrap>
      <MyBreadcrumb />
      <TopAreaBox>
        <TypeBox>
          {TYPE_ENCEPHALOGRAM.map(el => (
            <Row key={el.color}>
              <Bgc color={el.color} />
              <Text>{el.text}</Text>
            </Row>
          ))}
        </TypeBox>
        <TypeSelectBox className="selectBgc">
          <Space size={20}>
            <CustomSelectWrap
              mode="multiple"
              placeholder="选择迭代"
              showArrow
              showSearch
              getPopupContainer={(node: any) => node}
              allowClear
              optionFilterProp="label"
              onChange={onChangeSelect}
              options={interateList}
            />
            <MoreSelect
              showArrow
              mode="multiple"
              selectWidth={100}
              placeholder="任务状态"
              showSearch
              optionFilterProp="label"
              placement="bottomRight"
              width={200}
              value={stateVal}
              allowClear
              options={priorityList}
              onChange={(value: any) => onClickSearch(value)}
            />
            <RangePickerWrap type={date?.length >= 1}>
              <RangePicker
                isShowQuick
                placement="bottomRight"
                onChange={dates => onChangeTime(dates)}
              />
              {date?.length >= 1 ? (
                <span className="timeText">
                  {date[0]}~{date[1]}
                </span>
              ) : (
                <span className="timeText">时间</span>
              )}
            </RangePickerWrap>
            <Popover
              onOpenChange={(val: boolean) => setClickeMsg(val)}
              getPopupContainer={node => node}
              content={content}
              trigger="click"
              open={clickeMsg}
            >
              <PopoverBtn onClick={() => setClickeMsg(!clickeMsg)}>
                <IconFont type="intro" />
                <span>项目简介</span>
              </PopoverBtn>
            </Popover>
            <Popover
              onOpenChange={(val: boolean) => setClickePerson(val)}
              getPopupContainer={node => node}
              content={contentPerson}
              trigger="click"
              open={clickePerson}
            >
              <PopoverBtn onClick={() => setClickePerson(!clickePerson)}>
                <IconFont type="intro" />
                <span>项目人员</span>
              </PopoverBtn>
            </Popover>
          </Space>
        </TypeSelectBox>
      </TopAreaBox>
    </TopAreaWrap>
  )
}

export default TopArea
