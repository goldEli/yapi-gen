/* eslint-disable array-callback-return */
import CommonIconFont from '@/components/CommonIconFont'
import CommonUserAvatar from '@/components/CommonUserAvatar'
import styled from '@emotion/styled'
import { Checkbox } from 'antd'

const TreeLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px 0 15px;
  height: 40px;
  border-radius: 6px;
  transition: all 0.3s;
  :hover {
    background-color: var(--hover-d2);
  }
  :hover svg {
    color: var(--primary-d1);
  }
  & .ant-checkbox-wrapper {
    display: flex;
    align-items: unset;
  }
`

const NewAddShowList = (props: any) => {
  const { selectKeys } = props

  const tap = (id: any) => {
    const tapDatas = props.treeData?.children.find((k: any) => id === k.id)

    props.getTapData(tapDatas)
  }

  const choose = (item: any) => {
    props.setKeys(item)
  }
  function getT(value: any, value2: any) {
    if (value) {
      return false
    }
    return value2
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
                    onChange={() => choose(i)}
                    indeterminate={getT(
                      i.children.every((item: any) => {
                        return selectKeys
                          .map((i: { id: any }) => i.id)
                          .includes(item.id)
                      }),
                      i.children.length > 0 &&
                        i.children.some((item: any) =>
                          selectKeys
                            .map((i: { id: any }) => i.id)
                            .includes(item.id),
                        ),
                    )}
                    checked={
                      i.children.length > 0 &&
                      i.children.every((item: any) => {
                        return selectKeys
                          .map((i: { id: any }) => i.id)
                          .includes(item.id)
                      })
                    }
                  >
                    <div>部门-- {i.name}</div>
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
        {props.treeData?.staffs.map((i: any) => {
          return (
            <TreeLine key={i.id}>
              <div>
                <Checkbox
                  onChange={() => choose(i)}
                  checked={selectKeys
                    .map((i: { id: any }) => i.id)
                    .includes(i.id)}
                >
                  <div
                    id="12"
                    style={{
                      marginTop: '-1px',
                    }}
                  >
                    <CommonUserAvatar
                      name={i.name}
                      fontSize={14}
                      avatar={i.avatar}
                    />
                  </div>
                </Checkbox>
              </div>
            </TreeLine>
          )
        })}
      </div>
    )
  }
  return (
    <div>
      {props.treeData?.children.map((i: any) => {
        if (i.team_id) {
          console.log('飞机')
          return (
            <TreeLine key={i.id}>
              <div>
                <Checkbox
                  onChange={() => choose(i)}
                  checked={selectKeys
                    .map((i: { id: any }) => i.id)
                    .includes(i.id)}
                >
                  <div
                    id="12"
                    style={{
                      marginTop: '-1px',
                    }}
                  >
                    <CommonUserAvatar
                      name={i.name}
                      fontSize={14}
                      avatar={i.avatar}
                    />
                  </div>
                </Checkbox>
              </div>
            </TreeLine>
          )
        }
        return (
          <TreeLine key={i.id}>
            <div>
              <Checkbox
                onChange={() => (i.children.length >= 1 ? choose(i) : null)}
                checked={
                  i.children.length > 0 &&
                  i.children.every((item: any) => {
                    return selectKeys
                      .map((i: { id: any }) => i.id)
                      .includes(item.id)
                  })
                }
                indeterminate={getT(
                  i.children.every((item: any) => {
                    return selectKeys
                      .map((i: { id: any }) => i.id)
                      .includes(item.id)
                  }),
                  i.children.length > 0 &&
                    i.children.some((item: any) =>
                      selectKeys
                        .map((i: { id: any }) => i.id)
                        .includes(item.id),
                    ),
                )}
              >
                <div>团队-- {i.name}</div>
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
      })}
    </div>
  )
}
export default NewAddShowList
