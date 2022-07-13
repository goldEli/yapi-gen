import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'
import { css } from '@emotion/css'
import Table from '../../components/动态表格高级/app'

const buttonCss = css``
const StyledUpload = styled.div``

export default () => {
  const [state, setState] = useState()

  const navigate = useNavigate()

  useEffect(() => {}, [])
  return <Table></Table>
}
