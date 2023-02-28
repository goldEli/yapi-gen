import InputSearch from '../InputSearch'
import { SearchBox } from './style'

interface Props {
  onInputSearch(value: string): void
}

const ProjectCommonOperation = (props: Props) => {
  return (
    <SearchBox>
      <div>121212</div>
      <div style={{ width: 184 }}>
        <InputSearch
          leftIcon
          placeholder="请输入"
          onChangeSearch={props.onInputSearch}
        />
      </div>
    </SearchBox>
  )
}

export default ProjectCommonOperation
