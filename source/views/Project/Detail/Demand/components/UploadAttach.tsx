import { Upload } from 'antd'

interface Props {
  addWrap: React.ReactElement
}

export default (props: Props) => {
  return (
    <Upload
      progress={{
        strokeColor: {
          '0%': '#108ee9',
          '100%': '#87d068',
        },
        strokeWidth: 3,
        format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
      }}
    >
      {props.addWrap}
    </Upload>
  )
}
