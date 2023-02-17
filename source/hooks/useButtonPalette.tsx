// 按钮颜色

import { useSelector } from '@store/index'

const useButtonPalette = () => {
  const { theme } = useSelector(store => store.global)

  return {
    primary: {
      normal: {
        background: theme.themeColors.auxiliaryB1,
        text: theme.themeColors.auxiliaryTextT1,
      },
      hover: {
        background: theme.themeColors.auxiliaryB2,
        text: theme.themeColors.auxiliaryTextT1,
      },
      active: {
        background: theme.themeColors.auxiliaryB3,
        text: theme.themeColors.auxiliaryTextT1,
      },
      disable: {
        background: theme.themeColors.auxiliaryB10,
        text: theme.themeColors.auxiliaryTextT4,
      },
    },
    light: {
      normal: {
        background: theme.themeColors.auxiliaryB4,
        text: theme.themeColors.auxiliaryTextT2,
      },
      hover: {
        background: theme.themeColors.auxiliaryB4,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      active: {
        background: theme.themeColors.auxiliaryB5,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      disable: {
        background: theme.themeColors.auxiliaryB10,
        text: theme.themeColors.auxiliaryTextT4,
      },
    },
    secondary: {
      normal: {
        background: theme.themeColors.auxiliaryB4,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      hover: {
        background: theme.themeColors.auxiliaryB5,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      active: {
        background: theme.themeColors.auxiliaryB6,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      disable: {
        background: theme.themeColors.auxiliaryB10,
        text: theme.themeColors.auxiliaryTextT4,
      },
    },
    danger: {
      normal: {
        background: theme.themeColors.auxiliaryB7,
        text: theme.themeColors.auxiliaryTextT3,
      },
      hover: {
        background: theme.themeColors.auxiliaryB8,
        text: theme.themeColors.auxiliaryTextT3,
      },
      active: {
        background: theme.themeColors.auxiliaryB9,
        text: theme.themeColors.auxiliaryTextT3,
      },
      disable: {
        background: theme.themeColors.auxiliaryB10,
        text: theme.themeColors.auxiliaryTextT4,
      },
    },
    primaryText: {
      normal: {
        background: 'transparent',
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      hover: {
        background: theme.themeColors.auxiliaryB4,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      active: {
        background: theme.themeColors.auxiliaryB5,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      disable: {
        background: theme.themeColors.auxiliaryB10,
        text: theme.themeColors.auxiliaryTextT4,
      },
    },
    secondaryText: {
      normal: {
        background: 'transparent',
        text: theme.themeColors.auxiliaryTextT2,
      },
      hover: {
        background: theme.themeColors.auxiliaryB4,
        text: theme.themeColors.auxiliaryTextT2,
      },
      active: {
        background: theme.themeColors.auxiliaryB5,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      disable: {
        background: theme.themeColors.auxiliaryB10,
        text: theme.themeColors.auxiliaryTextT4,
      },
    },
    icon: {
      normal: {
        background: theme.themeColors.auxiliaryB7,
        text: theme.themeColors.auxiliaryTextT2,
      },
      hover: {
        background: theme.themeColors.auxiliaryB4,
        text: theme.themeColors.auxiliaryTextT2,
      },
      active: {
        background: theme.themeColors.auxiliaryB5,
        text: theme.themeColors.auxiliaryTextT1S1,
      },
      disable: {
        background: theme.themeColors.auxiliaryB10,
        text: theme.themeColors.auxiliaryTextT4,
      },
    },
  }
}

export default useButtonPalette
