import styled from '@emotion/styled'
import { css } from '@emotion/css'
import CommonButton from '@/components/CommonButton'
import React from 'react'

interface iProps {

}
const ScheduleInfoFooterBox = styled.div`
 color: var(--neutral-n3);
 display: flex;
 align-items: start;
 justify-content: flex-end;
 padding-right: 16px;
 box-sizing: border-box;
 button{
	margin-left: 16px;
 }
`

const ScheduleInfoFooter: React.FC<iProps> = props => {
	return (
		<ScheduleInfoFooterBox>
			<CommonButton type='light'>接收</CommonButton>
			<CommonButton type='light'>拒绝</CommonButton>
			<CommonButton type='light'>待定</CommonButton>
		</ScheduleInfoFooterBox>
	)
}

export default ScheduleInfoFooter
