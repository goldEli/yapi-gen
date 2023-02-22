import CommonButton from '@/components/CommonButton'
import CreateActionBar from '@/components/CreateActionBar'
import CustomDropdown from '@/components/CustomDropdown'
import IconFont from '@/components/IconFont'
import InputSearch from '@/components/InputSearch'
import LeftTitle from '@/components/LeftTitle'
import ProjectCard from '@/components/ProjectCard'
import { HoverIcon } from '@/components/ProjectCard/style'
import ViewPort from '@/components/ViewPort'
import { changeCreateVisible } from '@store/create-propject'
import { useDispatch } from '@store/index'
import { useState } from 'react'
import { Wrap } from './style'

const ProjectManagementOptimization = () => {
  const row = new Array(10).fill(1)
  const dispatch = useDispatch()
  const [order, setOrder] = useState<any>({ value: 'asc', key: 'name' })
  const [isGrid, setIsGrid] = useState(true)
  const [activeType, setActiveType] = useState(0)
  const [pageObj, setPageObj] = useState<any>({ page: 1, size: 20 })
  const [groupId, setGroupId] = useState<any>(null)
  const [searchVal, setSearchVal] = useState('')
  const [isHidden, setIsHidden] = useState(false)

  const onChange = (key: string) => {
    switch (key) {
      case 'edit':
        dispatch(changeCreateVisible(true))
        break
      case 'over':
        break
      case 'del':
        break

      default:
        break
    }
  }
  const onChangeType = (type: number) => {
    setActiveType(type)
    setGroupId(null)
    setPageObj({
      page: 1,
      size: 10,
    })
  }

  const onChangeHidden = (hidden: boolean) => {
    setIsHidden(hidden)
    setPageObj({
      page: 1,
      size: 10,
    })
  }

  const onChangeSort = (str: string) => {
    setOrder({ value: 'asc', key: str })
    setPageObj({
      page: 1,
      size: 10,
    })
  }

  const onChangeSearch = (value: string) => {
    if (searchVal !== value) {
      setSearchVal(value)
      setPageObj({
        page: 1,
        size: 10,
      })
    }
  }

  const onChangeGrid = (val: boolean) => {
    setIsGrid(val)
    setPageObj({
      page: 1,
      size: pageObj.size,
    })
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '32px',
          padding: '20px 24px',
          marginBottom: '20px',
        }}
      >
        <LeftTitle title="企业全部" />
        <div>
          <InputSearch
            width={184}
            value={searchVal}
            bgColor="var(--neutral-white-d4)"
            length={12}
            placeholder="请输入昵称姓名邮箱电话"
            onSearch={(value: string) => setSearchVal(value)}
            onChange={(value: string) => setSearchVal(value)}
            onClear={() => setSearchVal('')}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '32px',
          padding: '20px 24px',
          margin: '20px 0 ',
        }}
      >
        <CommonButton
          type="primary"
          onClick={() => dispatch(changeCreateVisible(true))}
        >
          <span>
            <IconFont type="plus" style={{ fontSize: 15 }} />
            创建项目
          </span>
        </CommonButton>

        <ViewPort />
        <CreateActionBar
          sort={order.key}
          isGrid={isGrid}
          activeType={activeType}
          onChangeSort={onChangeSort}
          onChangeFormat={onChangeGrid}
          onChangeHidden={onChangeHidden}
          onChangeSearch={onChangeSearch}
        />
      </div>
      <Wrap>
        {row.map(item => (
          <ProjectCard key={item}>
            <CustomDropdown onChange={onChange}>
              <HoverIcon>
                <IconFont
                  style={{
                    color: 'var(--neutral-n3)',
                  }}
                  type="more"
                />
              </HoverIcon>
            </CustomDropdown>
          </ProjectCard>
        ))}
      </Wrap>
    </div>
  )
}

export default ProjectManagementOptimization
