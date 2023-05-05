/* eslint-disable */
//@ts-nocheck
import Icon from 'antd/lib/icon'
import './listsort.css'
import React from 'react'
import ListSort from '../MyDrag'

class ListSortDemo extends React.Component {
  static defaultProps = {
    className: 'list-sort-demo',
  }

  render() {
    return (
      <div className={`${this.props.className}-wrapper`}>
        <div className={this.props.className}>
          <ListSort
            dragClassName="list-drag-selected"
            appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
          >
            {this.props.children}
          </ListSort>
        </div>
      </div>
    )
  }
}

export default ListSortDemo
