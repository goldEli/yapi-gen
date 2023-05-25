import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from 'react'
import { Select } from 'antd'
import styled from '@emotion/styled'
import CommonIconFont from '../CommonIconFont'
import NoData from '../NoData'
import { storyConfigCategoryList } from '@/services/project'
import useCategoryList from '@/hooks/useCategoryList'
const Wrap = styled(Select)`
  margin-bottom: 10px;
`
const TypeBox = styled.div`
  color: var(--neutral-n3);
  font-size: var(--font12);
  margin-bottom: 6px;
`
const CategoryBox = styled.div`
  color: var(--neutral-n2);
  font-size: var(--font14);
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    margin-right: 4px;
    vertical-align: sub;
  }
`
const DropBox = styled.div`
  padding: 6px 16px;
  cursor: pointer;
  color: var(--primary-d2);
`
interface IProps {
  width?: number
  value?: string
  onChangeCallBack?(data: Model.Project.Category): void
  onClearCallback?(): void
  projectId: number
  is_select: number
}
const CategoryDrop = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { onClearCallback, onChangeCallBack, projectId, is_select } = props
  const [options, setOptions] = useState<Model.Project.CategoryList[]>([])
  const { getTypeCategory } = useCategoryList()
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }
  const init = async () => {
    const params = { projectId, is_select }
    const res = await storyConfigCategoryList(params)
    const data = getTypeCategory(res.list, 'work_type')
    console.log(data)
    if (!data) {
      return
    }
    setOptions(data)
  }

  const memoProjectId = useMemo(() => projectId, [])
  useEffect(() => {
    init()
  }, [memoProjectId])

  return (
    <Wrap
      value={props.value ?? ''}
      placeholder="选择类别"
      dropdownRender={() => {
        const menu = options?.map(item => (
          <div key={item.name} className="rc-virtual-list">
            <TypeBox>{item.name}</TypeBox>
            {item.children.map(item => (
              <CategoryBox
                key={item.name}
                onClick={() => onChangeCallBack && onChangeCallBack(item)}
              >
                <span>
                  {' '}
                  <img style={{ width: '18px' }} src={item.attachmentPath} />
                  <span
                    style={{
                      color:
                        props.value === item.name ? 'var(--primary-d2)' : '',
                    }}
                  >
                    {item.name}
                  </span>
                </span>
                {props.value === item.name && (
                  <CommonIconFont
                    type="check"
                    color={props.value === item.name ? 'var(--primary-d2)' : ''}
                  ></CommonIconFont>
                )}
              </CategoryBox>
            ))}
          </div>
        ))
        return <DropBox>{menu ? menu : <NoData></NoData>}</DropBox>
      }}
      style={{ width: props.width ?? '100%' }}
      open={isOpen}
      onClick={toggleOpen}
      allowClear
      onClear={() => {
        setIsOpen(false)
        onClearCallback && onClearCallback()
      }}
    ></Wrap>
  )
}
export default forwardRef(CategoryDrop)
