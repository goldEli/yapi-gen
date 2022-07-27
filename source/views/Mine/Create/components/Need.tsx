import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Hehavior,
  PaginationWrap,
  StaffTableWrap,
  MyInput,
  SearchLine,
  SetButton,
  StyledTable,
} from '@/components/StyleCommon'
import IconFont from '@/components/IconFont'
import { Button, Dropdown, Menu, Pagination } from 'antd'
import type { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { useDynamicColumns } from './CreatePrejectTableColum'
import { OptionalFeld } from '@/components/OptionalFeld'
import { useModel } from '@/models'
import TableFilter from '@/components/TableFilter'

const Need = (props: any) => {
  const { getMineCreacteList, getField, getSearchField } = useModel('mine')
  const [listData, setListData] = useState<any>([])
  const [plainOptions, setPlainOptions] = useState<any>([])
  const [plainOptions2, setPlainOptions2] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [pagesize, setPagesize] = useState<number>(10)
  const [total, setTotal] = useState<number>()
  const [orderKey, setOrderKey] = useState<any>()
  const [order, setOrder] = useState<any>(3)
  const [keyword, setKeyword] = useState<string>('')
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [titleList, setTitleList] = useState<any[]>([])
  const [titleList2, setTitleList2] = useState<any[]>([])
  const [searchList, setSearchList] = useState<any[]>([])
  const [filterBasicsList, setFilterBasicsList] = useState<any[]>([])
  const [filterSpecialList, setFilterSpecialList] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const updateOrderkey = (key: any, order: any) => {
    setOrderKey(key)
    setOrder(order)
  }

  const columns = useDynamicColumns({ orderKey, order, updateOrderkey })

  const selectColum: any = useMemo(() => {
    const arr = [...titleList, ...titleList2]
    const newList = []
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        if (arr[i] === columns[j].key) {
          newList.push(columns[j])
        }
      }
    }
    return newList
  }, [titleList, columns])
  const getShowkey = async () => {
    const res2 = await getField(props.id || 0)

    setPlainOptions(res2.plainOptions)
    setPlainOptions2(res2.plainOptions2)
    setTitleList(res2.titleList)
    setTitleList2(res2.titleList2)
  }
  const getSearchKey = async () => {
    const res = await getSearchField(props.id || 0)

    setSearchList(res.allList)
    setFilterBasicsList(res.filterBasicsList)
    setFilterSpecialList(res.filterSpecialList)
  }
  const init = async () => {
    const res = await getMineCreacteList({
      projectId: props.id,
      keyword,
      status: '',
      tag: '',
      userId: '',
      usersName: '',
      usersCopysendName: '',
      order,
      orderkey: orderKey,
      page,
      pagesize,
    })

    setListData(res.list)
    setTotal(res.pager.total)
  }

  const onChangePage = (newPage: any) => {
    setPage(newPage)
  }
  const onShowSizeChange = (current: any, size: any) => {
    setPagesize(size)
  }
  const onPressEnter = (e: any) => {
    setKeyword(e.target.value)
  }
  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pagesize, keyword, orderKey, order, props.id])
  useEffect(() => {
    getSearchKey()
  }, [props.id])

  useEffect(() => {
    getShowkey()
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }
  const close2 = () => {
    setIsModalVisible(false)
  }

  const getCheckList = (
    list: CheckboxValueType[],
    list2: CheckboxValueType[],
  ) => {
    setTitleList(list)
    setTitleList2(list2)
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <Button onClick={showModal}>设置显示字段</Button>,
        },
      ]}
    />
  )
  return (
    <>
      <Hehavior>
        <div>
          <MyInput
            suffix={
              <IconFont
                type="search"
                style={{ color: '#BBBDBF', fontSize: 20 }}
              />
            }
            onPressEnter={onPressEnter}
            placeholder="请输入昵称姓名邮箱电话"
            allowClear
          />
        </div>
        <div style={{ marginRight: '40px', display: 'flex' }}>
          <SetButton>
            <IconFont type="filter" style={{ fontSize: 20 }} />
          </SetButton>
          <Dropdown overlay={menu} placement="bottomLeft">
            <SetButton>
              <IconFont
                type="set-default
              "
                style={{ fontSize: 20 }}
              />
            </SetButton>
          </Dropdown>
        </div>
      </Hehavior>

      <TableFilter
        list={searchList}
        basicsList={filterBasicsList}
        specialList={filterSpecialList}
      />
      <StaffTableWrap>
        <StyledTable
          rowKey="key"
          columns={selectColum}
          dataSource={listData}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </StaffTableWrap>
      <PaginationWrap>
        <Pagination
          defaultCurrent={1}
          current={1}
          showSizeChanger
          showQuickJumper
          total={total}
          showTotal={newTotal => `Total ${newTotal} items`}
          pageSizeOptions={['10', '20', '50']}
          onChange={onChangePage}
          onShowSizeChange={onShowSizeChange}
          hideOnSinglePage
        />
      </PaginationWrap>
      {isModalVisible
        ? (
            <OptionalFeld
              plainOptions={plainOptions}
              plainOptions2={plainOptions2}
              checkList={titleList}
              checkList2={titleList2}
              isVisible={isModalVisible}
              onClose={close2}
              getCheckList={getCheckList}
            />
          )
        : null}
    </>
  )
}

export default Need
