import React, { ReactNode } from 'react'
import { type Editor } from '@tiptap/react'
import { Dropdown, Menu, Popover, Tooltip } from 'antd'
import {
    Action,
    Actions,
    Button,
    Buttons,
    ButtonText,
    DropdownIconButton,
    DropdownOverlay,
    EmojiItem,
    EmojiList,
    MixinButton,
    MoreAction,
    MoreButtons,
    Separator,
    Wrap,
  } from './style'
  import Icon from '../../../assets/icons'
  

export type ActionData = {
  tip?: any
  key: string
  type?: 'button' | 'select' | 'mixin' | 'separator' | 'dropdown'
  title?: string | ((editor?: Editor | null) => string)
  icon?: string | ((editor?: Editor | null) => string)
  iconNode?: ReactNode
  active?: boolean | ((editor?: Editor | null) => boolean | void)
  disabled?: boolean | ((editor?: Editor | null) => boolean | void)
  selectWidth?: number
  value?: string | ((editor?: Editor | null) => string | void)
  forceValue?: ReactNode
  defaultValue?: any
  options?:
    | { key: string; label: ReactNode }[]
    | ((editor?: Editor | null) => { key: string; label: ReactNode }[])
  overlay?: ReactNode
}

const getPopupContainer = (triggerNode: HTMLElement) =>
  (triggerNode.closest('[data-action-bar]') || document.body) as HTMLElement

export const mapActionToNode = (
  action: ActionData,
  extra?: {
    editor?: Editor | null
    hiddenKeys?: string[]
    dispatch?(key: string, data?: unknown): void
  },
) => {
  const isActive =
    typeof action.active === 'function'
      ? action.active(extra?.editor)
      : action.active

  const icon =
    typeof action.icon === 'function' ? action.icon(extra?.editor) : action.icon

  switch (action.type) {
    case 'select':
        
      const options =
        typeof action.options === 'function'
          ? action.options(extra?.editor)
          : action.options

      const value =
        typeof action.value === 'function'
          ? action.value(extra?.editor)
          : action.value
      return (
        <div>
          <Tooltip title={action.tip}>
            <Action
              key={action.key}
              data-key={action.key}
              isHidden={extra?.hiddenKeys?.includes(action.key)}
            >
              <Dropdown
                overlay={
                  <Menu
                    items={options}
                    onClick={data => extra?.dispatch?.(action.key, data.key)}
                  />
                }
                trigger={['click']}
                getPopupContainer={getPopupContainer}
              >
                <Button
                  onClick={() => extra?.editor?.commands.focus()}
                  style={{ width: action.selectWidth }}
                >
                  <ButtonText>
                    {action.forceValue || (
                      <span>
                        {options?.find(i => i.key === String(value))?.label ||
                          action.defaultValue}
                      </span>
                    )}

                    <Icon type="arrow-down" data-options-arrow />
                  </ButtonText>
                </Button>
              </Dropdown>
            </Action>
          </Tooltip>
        </div>
      )
    case 'separator':
      return (
        <Tooltip title={action.tip}>
          {' '}
          <Separator
            key={action.key}
            data-key={action.key}
            isHidden={extra?.hiddenKeys?.includes(action.type)}
          />
        </Tooltip>
      )
    case 'dropdown':
      return (
        <Tooltip title={action.tip}>
          <Action
            key={action.key}
            data-key={action.key}
            isHidden={extra?.hiddenKeys?.includes(action.key)}
          >
            <Dropdown
              placement="bottomRight"
              overlay={
                <DropdownOverlay items={[{ key: '', label: action.overlay }]} />
              }
              trigger={['click']}
              getPopupContainer={getPopupContainer}
            >
              <Button data-active={isActive}>
                <Icon type={icon!} />
              </Button>
            </Dropdown>
          </Action>
        </Tooltip>
      )
    case 'mixin':
      return (
        <Tooltip title={action.tip}>
          <Action
            key={action.key}
            data-key={action.key}
            isHidden={extra?.hiddenKeys?.includes(action.key)}
          >
            <Button data-no-background>
              <MixinButton
                data-active={isActive}
                onClick={() => extra?.dispatch?.(action.key)}
              >
                {action.iconNode}
              </MixinButton>
              <Dropdown
                placement="bottomLeft"
                overlay={
                  <DropdownOverlay
                    items={[{ key: '', label: action.overlay }]}
                  />
                }
                trigger={['click']}
                getPopupContainer={getPopupContainer}
              >
                <DropdownIconButton>
                  <Icon type="arrow-down" />
                </DropdownIconButton>
              </Dropdown>
            </Button>
          </Action>
        </Tooltip>
      )
    case 'button':
    default:
      return (
        <Tooltip title={action.tip}>
          <Action
            key={action.key}
            data-key={action.key}
            isHidden={extra?.hiddenKeys?.includes(action.key)}
          >
            <Button
              data-active={isActive}
              onClick={() => extra?.dispatch?.(action.key)}
            >
              <Icon type={icon!} />
            </Button>
          </Action>
        </Tooltip>
      )
  }
}
