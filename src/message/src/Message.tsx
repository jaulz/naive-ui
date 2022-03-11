import {
  computed,
  h,
  defineComponent,
  inject,
  VNodeChild,
  CSSProperties,
  PropType
} from 'vue'
import {
  InfoIcon,
  SuccessIcon,
  WarningIcon,
  ErrorIcon
} from '../../_internal/icons'
import {
  NIconSwitchTransition,
  NBaseLoading,
  NBaseIcon,
  NBaseClose
} from '../../_internal'
import { render, createKey } from '../../_utils'
import { useConfig, useTheme, useThemeClass } from '../../_mixins'
import { messageLight } from '../styles'
import { messageProps } from './message-props'
import type { MessageType, MessageRenderMessage } from './types'
import { messageProviderInjectionKey } from './context'
import style from './styles/index.cssr'

const iconMap = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />
}

export default defineComponent({
  name: 'Message',
  props: {
    ...messageProps,
    render: Function as PropType<MessageRenderMessage>
  },
  setup (props) {
    const { inlineThemeDisabled } = useConfig()
    const {
      props: messageProviderProps,
      mergedClsPrefixRef
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = inject(messageProviderInjectionKey)!
    const themeRef = useTheme(
      'Message',
      '-message',
      style,
      messageLight,
      messageProviderProps,
      mergedClsPrefixRef
    )
    const cssVarsRef = computed(() => {
      const { type } = props
      const {
        common: { cubicBezierEaseInOut },
        self: {
          padding,
          margin,
          maxWidth,
          iconMargin,
          closeMargin,
          closeSize,
          iconSize,
          fontSize,
          lineHeight,
          borderRadius,
          iconColorInfo,
          iconColorSuccess,
          iconColorWarning,
          iconColorError,
          iconColorLoading,
          [createKey('textColor', type)]: textColor,
          [createKey('boxShadow', type)]: boxShadow,
          [createKey('color', type)]: color,
          [createKey('closeColor', type)]: closeColor,
          [createKey('closeColorPressed', type)]: closeColorPressed,
          [createKey('closeColorHover', type)]: closeColorHover
        }
      } = themeRef.value
      return {
        '--n-bezier': cubicBezierEaseInOut,
        '--n-margin': margin,
        '--n-padding': padding,
        '--n-max-width': maxWidth,
        '--n-font-size': fontSize,
        '--n-icon-margin': iconMargin,
        '--n-icon-size': iconSize,
        '--n-close-size': closeSize,
        '--n-close-margin': closeMargin,
        '--n-text-color': textColor,
        '--n-color': color,
        '--n-box-shadow': boxShadow,
        '--n-icon-color-info': iconColorInfo,
        '--n-icon-color-success': iconColorSuccess,
        '--n-icon-color-warning': iconColorWarning,
        '--n-icon-color-error': iconColorError,
        '--n-icon-color-loading': iconColorLoading,
        '--n-close-color': closeColor,
        '--n-close-color-pressed': closeColorPressed,
        '--n-close-color-hover': closeColorHover,
        '--n-line-height': lineHeight,
        '--n-border-radius': borderRadius
      }
    })
    const themeClassHandle = inlineThemeDisabled
      ? useThemeClass(
        'message',
        computed(() => props.type[0]),
        cssVarsRef,
        {}
      )
      : undefined
    return {
      mergedClsPrefix: mergedClsPrefixRef,
      messageProviderProps,
      handleClose () {
        props.onClose?.()
      },
      cssVars: inlineThemeDisabled ? undefined : inlineThemeDisabled,
      themeClass: themeClassHandle?.themeClass,
      onRender: themeClassHandle?.onRender,
      placement: messageProviderProps.placement
    }
  },
  render () {
    const {
      render: renderMessage,
      type,
      closable,
      content,
      mergedClsPrefix,
      cssVars,
      themeClass,
      onRender,
      icon,
      handleClose,
      showIcon
    } = this
    onRender?.()
    return (
      <div
        class={[`${mergedClsPrefix}-message-wrapper`, themeClass]}
        onMouseenter={this.onMouseenter}
        onMouseleave={this.onMouseleave}
        style={[
          {
            alignItems: this.placement.startsWith('top')
              ? 'flex-start'
              : 'flex-end'
          },
          cssVars as CSSProperties
        ]}
      >
        {renderMessage ? (
          renderMessage(this.$props)
        ) : (
          <div
            class={`${mergedClsPrefix}-message ${mergedClsPrefix}-message--${type}-type`}
          >
            {showIcon ? (
              <div
                class={`${mergedClsPrefix}-message__icon ${mergedClsPrefix}-message__icon--${type}-type`}
              >
                <NIconSwitchTransition>
                  {{
                    default: () => [
                      createIconVNode(icon, type, mergedClsPrefix)
                    ]
                  }}
                </NIconSwitchTransition>
              </div>
            ) : null}
            <div class={`${mergedClsPrefix}-message__content`}>
              {render(content)}
            </div>
            {closable ? (
              <NBaseClose
                clsPrefix={mergedClsPrefix}
                class={`${mergedClsPrefix}-message__close`}
                onClick={handleClose}
              />
            ) : null}
          </div>
        )}
      </div>
    )
  }
})

function createIconVNode (
  icon: undefined | (() => VNodeChild),
  type: MessageType,
  clsPrefix: string
): VNodeChild {
  if (typeof icon === 'function') {
    return icon()
  } else {
    return (
      <NBaseIcon clsPrefix={clsPrefix} key={type}>
        {{
          default: () =>
            type === 'loading' ? (
              <NBaseLoading
                clsPrefix={clsPrefix}
                strokeWidth={24}
                scale={0.85}
              />
            ) : (
              iconMap[type]
            )
        }}
      </NBaseIcon>
    )
  }
}
