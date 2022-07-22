/* eslint-disable @typescript-eslint/naming-convention */
import { Upload } from 'antd'

interface Props {
  addWrap: React.ReactElement
}

const UploadAttach = (props: Props) => {
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

export default UploadAttach
