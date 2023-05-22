// @flow
import React, { Component } from 'react'
import styled from '@emotion/styled'
import { colors } from '@atlaskit/theme'
import { grid, borderRadius } from './constants'
import QuoteList from './primatives/quote-list'
import Title from './primatives/title'
import type { Quote } from './types'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${colors.N30};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.G50};
  }
`

type Props = {
  title: string
  quotes: Quote[]
  index: number
  isScrollable?: boolean
  isCombineEnabled?: boolean
  useClone?: boolean
}

export default class Column extends Component<Props> {
  render() {
    const title: string = this.props.title
    const quotes: Quote[] = this.props.quotes
    const index: number = this.props.index
    return (
      <Draggable draggableId={title} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <Header>
              <Title
                // isDragging={snapshot.isDragging}
                {...provided.dragHandleProps}
                aria-label={`${title} quote list`}
              >
                {title}
              </Title>
            </Header>
            <QuoteList
              listId={title}
              listType="QUOTE"
              style={{
                backgroundColor: snapshot.isDragging ? colors.G50 : null,
              }}
              quotes={quotes}
              internalScroll={this.props.isScrollable}
              isCombineEnabled={Boolean(this.props.isCombineEnabled)}
              useClone={Boolean(this.props.useClone)}
            />
          </Container>
        )}
      </Draggable>
    )
  }
}
