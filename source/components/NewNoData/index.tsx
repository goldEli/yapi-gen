import { Box, Text } from './style'

const NewNoData = (props: any) => {
  const { url, text } = props
  return (
    <Box style={{ ...props.style }}>
      <div>
        <img src={url} alt="" />
      </div>
      <Text>{text}</Text>
    </Box>
  )
}

export default NewNoData
