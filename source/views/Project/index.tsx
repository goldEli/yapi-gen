import styled from '@emotion/styled'
import SearchComponent from '@/components/SearchComponent'

const SearchWrap = styled.div({
  height: 64,
  alignItems: 'center',
})

export default () => {
  return (
    <div>
      <SearchWrap>
        <SearchComponent text="创建项目" />
      </SearchWrap>
    </div>
  )
}
