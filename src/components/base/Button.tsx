import classNames from 'classnames';
import * as React from 'react';
import { Colors } from './colors';

const theme = {
  theme: {
    button: {
      base: 'inline-flex items-center font-medium transition duration-200 ease-out',
      block: 'w-full justify-center items-center',
      size: {
        tiny: 'px-2.5 py-1.5 text-xs rounded',
        small: 'px-3 py-2 text-sm leading-4 rounded-md',
        regular: 'px-4 py-2 text-sm rounded-md',
        large: 'px-4 py-2 text-base rounded-md',
        larger: 'px-6 py-3 text-base rounded-md',
        icon: {
          larger: 'p-3 rounded-lg',
          large: 'p-3 rounded-lg',
          regular: 'p-2 rounded-lg',
          small: 'p-2 rounded-md',
          tiny: 'p-2 rounded-md',
        },
      },
      icon: {
        larger: 'h-5 w-5',
        large: 'h-5 w-5',
        regular: 'h-5 w-5',
        small: 'h-4 w-4',
        tiny: 'h-4 w-4',
        left: 'mr-2 -ml-1',
        right: 'ml-2 -mr-1',
      },
      primary: {
        base: 'group relative inline-flex w-full max-w-fit items-center justify-center overflow-hidden',
        active: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      secondary: {
        base: 'border border-transparent',
        active: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      outline: {
        base: 'shadow-sm border border-transparent',
        active: 'focus:ring-2 focus:ring-offset-2 focus:outline-none',
        disabled: 'opacity-50 cursor-not-allowed bg-gray-300',
      },
      colors: {
        brand: {
          primary:
            'bg-gradient-to-br from-purple-600 to-blue-500 text-gray-900 p-0.5 text-lg font-extrabold tracking-widest hover:text-white focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-gray-700',
          // 'bg-blue-900 active:bg-blue-900 focus:ring-blue-800 hover:bg-blue-800 hover:ring-blue-800 ',
          secondary:
            'text-blue-700 bg-blue-100 active:bg-blue-100 hover:bg-blue-200 focus:ring-blue-500',
          outline:
            'text-blue-900 border-blue-900 focus:ring-blue-800 hover:bg-gray-200 hover:ring-blue-800',
        },
        gray: {
          primary: 'bg-gray-600 active:bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
          secondary:
            'text-gray-700 bg-gray-100 active:bg-gray-100 hover:bg-gray-200 focus:ring-gray-500',
          outline: 'text-gray-500 border-gray-500 focus:ring-gray-500 hover:bg-gray-100',
        },
        success: {
          primary:
            'bg-success-600 active:bg-success-600 hover:bg-success-700 focus:ring-success-500',
          secondary:
            'text-success-700 bg-success-100 active:bg-success-100 hover:bg-success-200 focus:ring-success-500',
          outline: 'text-success-500 border-success-500 focus:ring-success-500 hover:bg-gray-100',
        },
        danger: {
          primary: 'bg-danger-600 active:bg-danger-600 hover:bg-danger-700 focus:ring-danger-500',
          secondary:
            'text-danger-700 bg-danger-100 active:bg-danger-100 hover:bg-danger-200 focus:ring-danger-500',
          outline: 'text-danger-500 border-danger-500 focus:ring-danger-500 hover:bg-gray-100',
        },
        warning: {
          primary:
            'bg-warning-500 active:bg-warning-500 hover:bg-warning-400 focus:ring-warning-500',
          secondary:
            'text-warning-500 bg-warning-100 active:bg-warning-100 hover:bg-warning-200 focus:ring-warning-500',
          outline: 'text-warning-500 border-blue-500 focus:ring-blue-500 hover:bg-gray-100',
        },
        info: {
          primary: 'bg-info-600 active:bg-info-600 hover:bg-info-700 focus:ring-info-500',
          secondary:
            'text-info-700 bg-info-100 active:bg-info-100 hover:bg-info-200 focus:ring-info-500',
          outline: 'text-info-500 border-info-500 focus:ring-info-500 hover:bg-gray-100',
        },
        link: {
          primary: 'bg-link-600 active:bg-link-600 hover:bg-link-700 focus:ring-link-500',
          secondary:
            'text-link-700 bg-link-100 active:bg-link-100 hover:bg-link-200 focus:ring-link-500',
          outline: 'text-link-500 border-link-500 focus:ring-link-500 hover:bg-gray-100',
        },
      },
    },
  },
};

type IconType =
  | string
  | React.FunctionComponent<{ className: string; 'aria-hidden': boolean }>
  | React.ComponentClass<{ className: string; 'aria-hidden': boolean }>;

export interface Props {
  children?: React.ReactNode;
  /**
   * Defines if the button is disabled
   */
  disabled?: boolean;
  /**
   * The size of the button
   */
  size?: 'small' | 'regular' | 'large' | 'larger';
  /**
   * Shows only one icon inside the button; defaults to left
   */
  icon?: IconType;
  /**
   * Shows an icon inside the button, left aligned
   */
  iconLeft?: IconType;
  /**
   * Shows an icon inside the button, right aligned
   */
  iconRight?: IconType;
  /**
   * The style of the button
   */
  layout?: 'primary' | 'outline' | 'secondary';
  /**
   * Shows the button as a block (full width)
   */
  block?: boolean;

  /**
   * The color of the button
   */
  buttonColor?: Colors;
}

export interface ButtonAsButtonProps extends Props, React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The element that should be rendered as a button
   */
  tag?: 'button';
  /**
   * The native HTML button type
   */
  type?: 'button' | 'submit' | 'reset';
}

export interface ButtonAsAnchorProps extends Props, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  tag: 'a';
}

export interface ButtonAsOtherProps extends Props, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  tag: string;
}

export type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps | ButtonAsOtherProps;

type Ref = React.ReactNode | HTMLElement | string;

export const Button = React.forwardRef<Ref, ButtonProps>(function Button(props, ref) {
  const {
    tag = 'button',
    type = tag === 'button' ? 'button' : undefined,
    disabled = false,
    size = 'regular',
    layout = 'primary',
    block = false,
    icon,
    iconLeft,
    iconRight,
    className,
    children,
    buttonColor,
    ...other
  } = props;
  const {
    theme: { button },
  } = React.useContext(React.createContext(theme));

  function hasIcon() {
    return !!icon || !!iconLeft || !!iconRight;
  }

  const IconLeft = iconLeft || icon;
  const IconRight = iconRight;

  const baseStyle = button.base;
  const blockStyle = button.block;
  const sizeStyles = {
    larger: button.size.larger,
    large: button.size.large,
    regular: button.size.regular,
    small: button.size.small,
    tiny: button.size.tiny,
  };
  const iconSizeStyles = {
    larger: button.size.icon.larger,
    large: button.size.icon.large,
    regular: button.size.icon.regular,
    small: button.size.icon.small,
  };
  const iconStyle = button.icon[size];
  const layoutStyles = {
    primary: button.primary.base,
    outline: button.outline.base,
    secondary: button.secondary.base,
  };
  const activeStyles = {
    primary: button.primary.active,
    outline: button.outline.active,
    secondary: button.secondary.active,
  };
  const disabledStyles = {
    primary: button.primary.disabled,
    outline: button.outline.disabled,
    secondary: button.secondary.disabled,
  };
  const color = (color?: Colors) => {
    return button.colors[color!] ?? button.colors.brand;
  };
  const bColor = {
    primary: color(buttonColor).primary,
    outline: color(buttonColor).outline,
    secondary: color(buttonColor).secondary,
  };
  const buttonStyles = classNames(
    baseStyle,
    // has icon but no children
    hasIcon() && !children && iconSizeStyles[size],
    // has icon and children
    hasIcon() && children && sizeStyles[size],
    // does not have icon
    !hasIcon() && sizeStyles[size],
    layoutStyles[layout],
    disabled ? disabledStyles[layout] : activeStyles[layout],
    block ? blockStyle : null,
    bColor[layout],
    className
  );

  const iconLeftStyles = classNames(iconStyle, children ? button.icon.left : '');
  const iconRightStyles = classNames(iconStyle, children ? button.icon.right : '');

  return React.createElement(
    tag,
    {
      className: buttonStyles,
      ref,
      disabled,
      type,
      ...other,
    },
    IconLeft
      ? React.createElement(IconLeft, {
          className: iconLeftStyles,
          'aria-hidden': true,
        })
      : null,
    children,
    IconRight
      ? React.createElement(IconRight, {
          className: iconRightStyles,
          'aria-hidden': true,
        })
      : null
  );
});
