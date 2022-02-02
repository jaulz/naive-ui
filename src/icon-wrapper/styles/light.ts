import { commonLight } from '../../_styles/common'
import type { ThemeCommonVars } from '../../_styles/common'
import type { Theme } from '../../_mixins'

export const self = (vars: ThemeCommonVars) => {
  const { primaryColor } = vars
  return {
    color: primaryColor
  }
}

export type IconWrapperThemeVars = ReturnType<typeof self>

const iconWrapperLight: Theme<'IconWrapper', IconWrapperThemeVars> = {
  name: 'IconWrapper',
  common: commonLight,
  self
}

export default iconWrapperLight
export type IconWrapperTheme = typeof iconWrapperLight
