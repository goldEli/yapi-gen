/* eslint-disable array-callback-return */
import CommonIconFont from '@/components/CommonIconFont'
import styled from '@emotion/styled'
import { Checkbox } from 'antd'
import React from 'react'

const TreeLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px 0 15px;
  height: 40px;
  transition: all 0.3s;
  :hover {
    background-color: #f6f7f9;
  }
`

const NewAddShowList = (props: any) => {
  console.log(props.treeData, '传进来的树')

  const { selectKeys } = props

  const tap = (id: any) => {
    const tapDatas = props.treeData?.children.find((k: any) => id === k.id)

    props.getTapData(tapDatas)
  }

  const choose = (item: any) => {
    props.setKeys(item)
  }
  if (props.isDe) {
    return (
      <div>
        {props.treeData?.children.map((i: any) => {
          if (i.children && i.children.length >= 1) {
            return (
              <TreeLine key={i.id}>
                <div>
                  <Checkbox
                    checked={
                      i.children.length > 0 &&
                      i.children.every((item: any) => {
                        return selectKeys
                          .map((i: { id: any }) => i.id)
                          .includes(item.id)
                      })
                    }
                    indeterminate={
                      i.children.length > 0 &&
                      i.children.some((item: any) =>
                        selectKeys
                          .map((i: { id: any }) => i.id)
                          .includes(item.id),
                      )
                    }
                  >
                    <div
                      onClick={() => choose(i)}
                      style={{ display: 'flex', alignItems: 'end' }}
                    >
                      部门-- {i.name}
                    </div>
                  </Checkbox>
                </div>

                {i.children && i.children.length >= 1 ? (
                  <CommonIconFont
                    onClick={() =>
                      i.children && i.children.length >= 1 ? tap(i.id) : null
                    }
                    type="right"
                  />
                ) : null}
              </TreeLine>
            )
          }
        })}
        {/* 成员渲染 */}
        {props.isDe
          ? props.treeData?.staffs.map((i: any) => {
              return (
                <TreeLine key={i.id}>
                  <div>
                    <Checkbox
                      checked={selectKeys
                        .map((i: { id: any }) => i.id)
                        .includes(i.id)}
                    >
                      <div
                        onClick={() => choose(i)}
                        style={{ display: 'flex', alignItems: 'end' }}
                      >
                        成员-- {i.name}
                      </div>
                    </Checkbox>
                  </div>
                </TreeLine>
              )
            })
          : null}
      </div>
    )
  }
  return (
    <div>
      {props.treeData?.children.map((i: any) => {
        if (i.children && i.children.length >= 1) {
          return (
            <TreeLine key={i.id}>
              <div>
                <Checkbox
                  checked={
                    i.children.length > 0 &&
                    i.children.every((item: any) => {
                      return selectKeys
                        .map((i: { id: any }) => i.id)
                        .includes(item.id)
                    })
                  }
                  indeterminate={
                    i.children.length > 0 &&
                    i.children.some((item: any) =>
                      selectKeys
                        .map((i: { id: any }) => i.id)
                        .includes(item.id),
                    )
                  }
                >
                  <div
                    onClick={() => choose(i)}
                    style={{ display: 'flex', alignItems: 'end' }}
                  >
                    团队-- {i.name}
                  </div>
                </Checkbox>
              </div>

              {i.children && i.children.length >= 1 ? (
                <CommonIconFont
                  onClick={() =>
                    i.children && i.children.length >= 1 ? tap(i.id) : null
                  }
                  type="right"
                />
              ) : null}
            </TreeLine>
          )
        }
        return (
          <TreeLine key={i.id}>
            <div>
              <Checkbox>
                <div
                  onClick={() => choose(i)}
                  style={{ display: 'flex', alignItems: 'end' }}
                >
                  成员-- {i.name}
                </div>
              </Checkbox>
            </div>
          </TreeLine>
        )
      })}
    </div>
  )
}
export default NewAddShowList
