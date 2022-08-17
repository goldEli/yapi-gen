/* eslint-disable class-methods-use-this */
import { type IButtonMenu } from '@wangeditor/editor'
import { currentLanguage } from '../../locals/index'
import { type NewIDomEditor } from './Editor'

class FullScreenButtonMenu implements IButtonMenu {
  readonly title = currentLanguage === 'zh' ? '全屏' : 'fullscreen'

  readonly iconSvg
    = '<svg viewBox="0 0 1024 1024"><path d="M133.705143 335.433143V133.851429h201.581714a29.622857 29.622857 0 0 0 29.622857-29.549715V68.754286a29.622857 29.622857 0 0 0-29.622857-29.622857H61.732571A22.893714 22.893714 0 0 0 38.765714 62.025143V335.725714c0 16.310857 13.238857 29.622857 29.622857 29.622857h35.547429a29.842286 29.842286 0 0 0 29.696-29.842285zM690.980571 133.851429h201.581715v201.654857c0 16.310857 13.238857 29.549714 29.622857 29.549714h35.547428a29.622857 29.622857 0 0 0 29.549715-29.549714V61.952a22.893714 22.893714 0 0 0-22.820572-22.893714h-273.554285a29.622857 29.622857 0 0 0-29.549715 29.622857v35.547428c0 16.310857 13.238857 29.696 29.622857 29.696zM335.286857 892.781714H133.705143V691.2a29.622857 29.622857 0 0 0-29.622857-29.622857H68.534857a29.622857 29.622857 0 0 0-29.549714 29.622857v273.554286c0 12.653714 10.24 22.893714 22.820571 22.893714h273.554286a29.622857 29.622857 0 0 0 29.696-29.622857v-35.547429a29.769143 29.769143 0 0 0-29.769143-29.696z m557.348572-201.581714v201.581714H690.907429a29.622857 29.622857 0 0 0-29.622858 29.622857v35.547429c0 16.310857 13.238857 29.622857 29.622858 29.622857h273.554285c12.580571 0 22.893714-10.313143 22.893715-22.893714V691.2a29.622857 29.622857 0 0 0-29.622858-29.622857h-35.547428a29.622857 29.622857 0 0 0-29.696 29.622857z"></path></svg>'

  readonly tag = 'button'

  getValue(): string | boolean {
    return ''
  }

  isActive(): boolean {
    return false
  }

  isDisabled(): boolean {
    return false
  }

  exec(editor: NewIDomEditor) {
    const el = document.querySelector('#editorWrap') as HTMLDivElement
    if (el) {
      el.style.cssText
        = 'position:fixed;left:0;bottom:0;right:0;top:0;z-index: 99;height:100vh;width:100vw'
      if (editor.changeEditor) {
        editor.changeEditor(false, 'cancelCustomFullScreen')
      }
    }
  }
}

const fullscreenMenu = {
  key: 'customFullScreen',
  factory() {
    return new FullScreenButtonMenu()
  },
}

export default fullscreenMenu
