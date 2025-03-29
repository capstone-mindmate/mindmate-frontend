import React from 'react'
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

interface IconProps {
  width?: number
  height?: number
  color?: string
  className?: string
  strokeWidth?: number
  alertCount?: number
  fontSize?: number
}

const iconStyle = css`
  transition: transform 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`

const containerStyle = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const AlarmIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'alarm-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9M15 17H18.5905C18.973 17 19.1652 17 19.3201 16.9478C19.616 16.848 19.8475 16.6156 19.9473 16.3198C19.9997 16.1643 19.9997 15.9715 19.9997 15.5859C19.9997 15.4172 19.9995 15.3329 19.9863 15.2524C19.9614 15.1004 19.9024 14.9563 19.8126 14.8312C19.7651 14.7651 19.7048 14.7048 19.5858 14.5858L19.1963 14.1963C19.0706 14.0706 19 13.9001 19 13.7224V10C19 6.134 15.866 2.99999 12 3C8.13401 3.00001 5 6.13401 5 10V13.7224C5 13.9002 4.92924 14.0706 4.80357 14.1963L4.41406 14.5858C4.29476 14.7051 4.23504 14.765 4.1875 14.8312C4.09766 14.9564 4.03815 15.1004 4.0132 15.2524C4 15.3329 4 15.4172 4 15.586C4 15.9715 4 16.1642 4.05245 16.3197C4.15225 16.6156 4.3848 16.848 4.68066 16.9478C4.83556 17 5.02701 17 5.40956 17H9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const BackIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'alarm-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M15 6L9.3535  11.6464C9.15829 11.8417 9.15829 12.1583 9.35355 12.3536L15 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  </div>
)

export const CheckIconBig: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'check-icon-big ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <g clipPath="url(#clip0_169_4136)">
        <circle
          cx="12"
          cy="12"
          r="11"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <path
          d="M7 12.5L10.6364 16L17 9"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      </g>
      <defs>
        <clipPath id="clip0_169_4136">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
)

export const CheckIconSmall: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'check-icon-small ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M15 10L11 14L9 12M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const ErrorIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'error-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M5.75 5.75L18.25 18.25M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const ImageIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'image-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M3.00005 18.0001C3 17.9355 3 17.8689 3 17.8002V6.2002C3 5.08009 3 4.51962 3.21799 4.0918C3.40973 3.71547 3.71547 3.40973 4.0918 3.21799C4.51962 3 5.08009 3 6.2002 3H17.8002C18.9203 3 19.4801 3 19.9079 3.21799C20.2842 3.40973 20.5905 3.71547 20.7822 4.0918C21 4.5192 21 5.07899 21 6.19691V17.8031C21 18.2881 21 18.6679 20.9822 18.9774M3.00005 18.0001C3.00082 18.9884 3.01337 19.5058 3.21799 19.9074C3.40973 20.2837 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H17.8036C18.9215 21 19.4805 21 19.9079 20.7822C20.2842 20.5905 20.5905 20.2837 20.7822 19.9074C20.9055 19.6654 20.959 19.3813 20.9822 18.9774M3.00005 18.0001L7.76798 12.4375L7.76939 12.436C8.19227 11.9426 8.40406 11.6955 8.65527 11.6064C8.87594 11.5282 9.11686 11.53 9.33643 11.6113C9.58664 11.704 9.79506 11.9539 10.2119 12.4541L12.8831 15.6595C13.269 16.1226 13.463 16.3554 13.6986 16.4489C13.9065 16.5313 14.1357 16.5406 14.3501 16.4773C14.5942 16.4053 14.8091 16.1904 15.2388 15.7607L15.7358 15.2637C16.1733 14.8262 16.3921 14.6076 16.6397 14.5361C16.8571 14.4734 17.0896 14.4869 17.2988 14.5732C17.537 14.6716 17.7302 14.9124 18.1167 15.3955L20.9822 18.9774M20.9822 18.9774L21 18.9996M15 9C14.4477 9 14 8.55228 14 8C14 7.44772 14.4477 7 15 7C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const InfoIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'info-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M12 11V16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12.0498 8V8.1L11.9502 8.1002V8H12.0498Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const KebabIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'kebab-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M11 18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 6C11 6.55228 11.4477 7 12 7C12.5523 7 13 6.55228 13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const ListIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'list-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M9 17H19M9 12H19M9 7H19M5.00195 17V17.002L5 17.002V17H5.00195ZM5.00195 12V12.002L5 12.002V12H5.00195ZM5.00195 7V7.002L5 7.00195V7H5.00195Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const PlusIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'plus-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M8 12H12M12 12H16M12 12V16M12 12V8M4 16.8002V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4801 4 18.9079 4.21799C19.2842 4.40973 19.5905 4.71547 19.7822 5.0918C20.0002 5.51962 20.0002 6.07967 20.0002 7.19978V16.7998C20.0002 17.9199 20.0002 18.48 19.7822 18.9078C19.5905 19.2841 19.2842 19.5905 18.9079 19.7822C18.4805 20 17.9215 20 16.8036 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2842 4.21799 18.9079C4 18.4801 4 17.9203 4 16.8002Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const SearchIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'search-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const SendIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'send-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M10.3078 13.6923L15.1539 8.84619M20.1113 5.88867L16.0207 19.1833C15.6541 20.3747 15.4706 20.9707 15.1544 21.1683C14.8802 21.3396 14.5406 21.3683 14.2419 21.2443C13.8975 21.1014 13.618 20.5433 13.0603 19.428L10.4694 14.2461C10.3809 14.0691 10.3366 13.981 10.2775 13.9043C10.225 13.8363 10.1645 13.7749 10.0965 13.7225C10.0215 13.6647 9.93486 13.6214 9.76577 13.5369L4.57192 10.9399C3.45662 10.3823 2.89892 10.1032 2.75601 9.75879C2.63207 9.4601 2.66033 9.12023 2.83169 8.84597C3.02928 8.52974 3.62523 8.34603 4.81704 7.97932L18.1116 3.88867C19.0486 3.60038 19.5173 3.45635 19.8337 3.57253C20.1094 3.67373 20.3267 3.89084 20.4279 4.16651C20.544 4.48283 20.3999 4.95126 20.1119 5.88729L20.1113 5.88867Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const SettingIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'setting-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M20.3499 8.92293L19.9837 8.7192C19.9269 8.68756 19.8989 8.67169 19.8714 8.65524C19.5983 8.49165 19.3682 8.26564 19.2002 7.99523C19.1833 7.96802 19.1674 7.93949 19.1348 7.8831C19.1023 7.82677 19.0858 7.79823 19.0706 7.76998C18.92 7.48866 18.8385 7.17515 18.8336 6.85606C18.8331 6.82398 18.8332 6.79121 18.8343 6.72604L18.8415 6.30078C18.8529 5.62025 18.8587 5.27894 18.763 4.97262C18.6781 4.70053 18.536 4.44993 18.3462 4.23725C18.1317 3.99685 17.8347 3.82534 17.2402 3.48276L16.7464 3.1982C16.1536 2.85658 15.8571 2.68571 15.5423 2.62057C15.2639 2.56294 14.9765 2.56561 14.6991 2.62789C14.3859 2.69819 14.0931 2.87351 13.5079 3.22396L13.5045 3.22555L13.1507 3.43741C13.0948 3.47091 13.0665 3.48779 13.0384 3.50338C12.7601 3.6581 12.4495 3.74365 12.1312 3.75387C12.0992 3.7549 12.0665 3.7549 12.0013 3.7549C11.9365 3.7549 11.9024 3.7549 11.8704 3.75387C11.5515 3.74361 11.2402 3.65759 10.9615 3.50224C10.9334 3.48658 10.9056 3.46956 10.8496 3.4359L10.4935 3.22213C9.90422 2.86836 9.60915 2.69121 9.29427 2.62057C9.0157 2.55807 8.72737 2.55634 8.44791 2.61471C8.13236 2.68062 7.83577 2.85276 7.24258 3.19703L7.23994 3.1982L6.75228 3.48124L6.74688 3.48454C6.15904 3.82572 5.86441 3.99672 5.6517 4.23614C5.46294 4.4486 5.32185 4.69881 5.2374 4.97018C5.14194 5.27691 5.14703 5.61896 5.15853 6.3027L5.16568 6.72736C5.16676 6.79166 5.16864 6.82362 5.16817 6.85525C5.16343 7.17499 5.08086 7.48914 4.92974 7.77096C4.9148 7.79883 4.8987 7.8267 4.86654 7.88237C4.83436 7.93809 4.81877 7.96579 4.80209 7.99268C4.63336 8.26452 4.40214 8.49186 4.12733 8.65572C4.10015 8.67193 4.0715 8.68752 4.01521 8.71871L3.65365 8.91908C3.05208 9.25245 2.75137 9.41928 2.53256 9.65669C2.33898 9.86672 2.19275 10.1158 2.10349 10.3872C2.00259 10.6939 2.00267 11.0378 2.00424 11.7255L2.00551 12.2877C2.00706 12.9708 2.00919 13.3122 2.11032 13.6168C2.19979 13.8863 2.34495 14.134 2.53744 14.3427C2.75502 14.5787 3.05274 14.7445 3.64974 15.0766L4.00808 15.276C4.06907 15.3099 4.09976 15.3266 4.12917 15.3444C4.40148 15.5083 4.63089 15.735 4.79818 16.0053C4.81625 16.0345 4.8336 16.0648 4.8683 16.1255C4.90256 16.1853 4.92009 16.2152 4.93594 16.2452C5.08261 16.5229 5.16114 16.8315 5.16649 17.1455C5.16707 17.1794 5.16658 17.2137 5.16541 17.2827L5.15853 17.6902C5.14695 18.3763 5.1419 18.7197 5.23792 19.0273C5.32287 19.2994 5.46484 19.55 5.65463 19.7627C5.86915 20.0031 6.16655 20.1745 6.76107 20.5171L7.25478 20.8015C7.84763 21.1432 8.14395 21.3138 8.45869 21.379C8.73714 21.4366 9.02464 21.4344 9.30209 21.3721C9.61567 21.3017 9.90948 21.1258 10.4964 20.7743L10.8502 20.5625C10.9062 20.5289 10.9346 20.5121 10.9626 20.4965C11.2409 20.3418 11.5512 20.2558 11.8695 20.2456C11.9015 20.2446 11.9342 20.2446 11.9994 20.2446C12.0648 20.2446 12.0974 20.2446 12.1295 20.2456C12.4484 20.2559 12.7607 20.3422 13.0394 20.4975C13.0639 20.5112 13.0885 20.526 13.1316 20.5519L13.5078 20.7777C14.0971 21.1315 14.3916 21.3081 14.7065 21.3788C14.985 21.4413 15.2736 21.4438 15.5531 21.3855C15.8685 21.3196 16.1657 21.1471 16.7586 20.803L17.2536 20.5157C17.8418 20.1743 18.1367 20.0031 18.3495 19.7636C18.5383 19.5512 18.6796 19.3011 18.764 19.0297C18.8588 18.7252 18.8531 18.3858 18.8417 17.7119L18.8343 17.2724C18.8332 17.2081 18.8331 17.1761 18.8336 17.1445C18.8383 16.8247 18.9195 16.5104 19.0706 16.2286C19.0856 16.2007 19.1018 16.1726 19.1338 16.1171C19.166 16.0615 19.1827 16.0337 19.1994 16.0068C19.3681 15.7349 19.5995 15.5074 19.8744 15.3435C19.9012 15.3275 19.9289 15.3122 19.9838 15.2818L19.9857 15.2809L20.3472 15.0805C20.9488 14.7472 21.2501 14.5801 21.4689 14.3427C21.6625 14.1327 21.8085 13.8839 21.8978 13.6126C21.9981 13.3077 21.9973 12.9658 21.9958 12.2861L21.9945 11.7119C21.9929 11.0287 21.9921 10.6874 21.891 10.3828C21.8015 10.1133 21.6555 9.86561 21.463 9.65685C21.2457 9.42111 20.9475 9.25526 20.3517 8.92378L20.3499 8.92293Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00033 12C8.00033 14.2091 9.79119 16 12.0003 16C14.2095 16 16.0003 14.2091 16.0003 12C16.0003 9.79082 14.2095 7.99996 12.0003 7.99996C9.79119 7.99996 8.00033 9.79082 8.00033 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const SmileIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'smile-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <circle cx="9.25" cy="9.4502" r="1.25" fill={color} />
      <circle cx="14.75" cy="9.4502" r="1.25" fill={color} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 13.0005C7.50026 15.5411 9.55992 17.6006 12.1006 17.6006C14.6413 17.6006 16.7009 15.5411 16.7012 13.0005H7.5Z"
        fill={color}
      />
    </svg>
  </div>
)

export const StarIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'star-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M2.33496 10.3363C2.02171 10.0466 2.19187 9.5229 2.61557 9.47267L8.61914 8.76058C8.79182 8.7401 8.94181 8.63166 9.01465 8.47376L11.5469 2.98397C11.7256 2.59654 12.2764 2.59646 12.4551 2.9839L14.9873 8.47365C15.0601 8.63155 15.2092 8.74028 15.3818 8.76075L21.3857 9.47267C21.8094 9.5229 21.9791 10.0468 21.6659 10.3364L17.2278 14.4414C17.1001 14.5595 17.0433 14.7352 17.0771 14.9058L18.255 20.8355C18.3382 21.2539 17.8928 21.5782 17.5205 21.3698L12.2451 18.4161C12.0934 18.3312 11.9091 18.3316 11.7573 18.4165L6.48144 21.369C6.10913 21.5774 5.66294 21.2539 5.74609 20.8354L6.92414 14.9061C6.95803 14.7356 6.90134 14.5594 6.77367 14.4414L2.33496 10.3363Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const TextIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'text-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M10 19H12M12 19H14M12 19V5M12 5H6V6M12 5H18V6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const UploadIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'upload-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M15 11L12 8M12 8L9 11M12 8V16M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const WarningIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'warning-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M12 9.00006V13.0001M4.37891 15.1999C3.46947 16.775 3.01489 17.5629 3.08281 18.2092C3.14206 18.7729 3.43792 19.2851 3.89648 19.6182C4.42204 20.0001 5.3309 20.0001 7.14853 20.0001H16.8515C18.6691 20.0001 19.5778 20.0001 20.1034 19.6182C20.5619 19.2851 20.8579 18.7729 20.9172 18.2092C20.9851 17.5629 20.5307 16.775 19.6212 15.1999L14.7715 6.79986C13.8621 5.22468 13.4071 4.43722 12.8135 4.17291C12.2957 3.94236 11.704 3.94236 11.1862 4.17291C10.5928 4.43711 10.1381 5.22458 9.22946 6.79845L4.37891 15.1999ZM12.0508 16.0001V16.1001L11.9502 16.1003V16.0001H12.0508Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const AttachmentIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'attachment-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M9.1718 14.8288L14.8287 9.17192M7.05086 11.293L5.63664 12.7072C4.07455 14.2693 4.07409 16.8022 5.63619 18.3643C7.19829 19.9264 9.7317 19.9259 11.2938 18.3638L12.7065 16.9498M11.2929 7.05L12.7071 5.63579C14.2692 4.07369 16.8016 4.07397 18.3637 5.63607C19.9258 7.19816 19.9257 9.73085 18.3636 11.2929L16.9501 12.7071"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const CameraIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'camera-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M7.5 7.58065H8.5V6.58065C8.5 5.70768 9.20768 5 10.0806 5H13.9194C14.7923 5 15.5 5.70768 15.5 6.58065V7.58065H16.5H19C20.1046 7.58065 21 8.47608 21 9.58065V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V9.58065C3 8.47608 3.89543 7.58065 5 7.58065H7.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="12" cy="13" r="3" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  </div>
)

const ChatAlerticonStyle = (fontSize: number) => css`
  position: absolute;
  font-size: ${fontSize}px;
  color: #ffffff;
  z-index: 2;
  font-weight: bold;
  user-select: none;
  margin-bottom: 1px;
  margin-left: 1px;
`

// width, height, className, alertCount
export const ChatAlertIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  className = '',
  alertCount = 1,
  fontSize = 12,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'chat-alert-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12.5" cy="11.5" r="9.5" fill="#FB4F50" />
    </svg>
    <span css={ChatAlerticonStyle(fontSize)} className="alert-count">
      {alertCount}
    </span>
  </div>
)

export const ChatBoxIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'chat-box-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M16 8H20C20.5523 8 21 8.44772 21 9V20L17.667 17.231C17.4875 17.0818 17.2608 17 17.0273 17H9C8.44771 17 8 16.5523 8 16V13M16 8V5C16 4.44772 15.5523 4 15 4H4C3.44772 4 3 4.44772 3 5V16.0003L6.33301 13.2308C6.51255 13.0817 6.73924 13 6.97266 13H8M16 8V12C16 12.5523 15.5523 13 15 13H8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const ChatBubbleIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'chat-bubble-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M7.50977 19.8018C8.83126 20.5639 10.3645 21 11.9996 21C16.9702 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6351 3.43604 15.1684 4.19819 16.4899L4.20114 16.495C4.27448 16.6221 4.31146 16.6863 4.32821 16.7469C4.34401 16.804 4.34842 16.8554 4.34437 16.9146C4.34003 16.9781 4.3186 17.044 4.27468 17.1758L3.50586 19.4823L3.50489 19.4853C3.34268 19.9719 3.26157 20.2152 3.31938 20.3774C3.36979 20.5187 3.48169 20.6303 3.62305 20.6807C3.78482 20.7384 4.02705 20.6577 4.51155 20.4962L4.51758 20.4939L6.82405 19.7251C6.95537 19.6813 7.02214 19.6591 7.08559 19.6548C7.14475 19.6507 7.19578 19.6561 7.25293 19.6719C7.31368 19.6887 7.37783 19.7257 7.50563 19.7994L7.50977 19.8018Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const CoinIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'coin-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M4.54514 12.95L11.3784 19.6283C11.5724 19.8179 11.6694 19.9127 11.7773 19.9565C11.9201 20.0145 12.0799 20.0145 12.2227 19.9565C12.3306 19.9127 12.4276 19.8179 12.6216 19.6283L19.4549 12.95C21.2938 11.1528 21.519 8.26955 19.9815 6.20787L19.5825 5.6729C17.6946 3.14135 13.7895 3.5551 12.4723 6.42622C12.2868 6.83051 11.7132 6.83051 11.5277 6.42622C10.2105 3.5551 6.3054 3.14135 4.41749 5.6729L4.01853 6.20787C2.48101 8.26955 2.70622 11.1528 4.54514 12.95Z"
        fill={color}
      />
    </svg>
  </div>
)

export const HomeIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'home-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const MessageIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'message-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M4 6L10.1076 10.6123L10.1097 10.614C10.7878 11.1113 11.1271 11.3601 11.4988 11.4562C11.8272 11.5412 12.1725 11.5412 12.501 11.4562C12.8729 11.36 13.2132 11.1105 13.8926 10.6123C13.8926 10.6123 17.8101 7.60594 20 6M3 15.8002V8.2002C3 7.08009 3 6.51962 3.21799 6.0918C3.40973 5.71547 3.71547 5.40973 4.0918 5.21799C4.51962 5 5.08009 5 6.2002 5H17.8002C18.9203 5 19.4796 5 19.9074 5.21799C20.2837 5.40973 20.5905 5.71547 20.7822 6.0918C21 6.5192 21 7.07899 21 8.19691V15.8036C21 16.9215 21 17.4805 20.7822 17.9079C20.5905 18.2842 20.2837 18.5905 19.9074 18.7822C19.48 19 18.921 19 17.8031 19H6.19691C5.07899 19 4.5192 19 4.0918 18.7822C3.71547 18.5905 3.40973 18.2842 3.21799 17.9079C3 17.4801 3 16.9203 3 15.8002Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const NormalPlusIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'normal-plus-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M7 12H12M12 12H17M12 12V17M12 12V7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const CloseIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'close-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <path
        d="M6.65662 6.65685L12.3135 12.3137M12.3135 12.3137L17.9703 17.9706M12.3135 12.3137L6.65662 17.9706M12.3135 12.3137L17.9703 6.65685"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

export const UserIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = '#000000',
  className = '',
  strokeWidth = 2,
}) => (
  <div className="icon-container" css={containerStyle}>
    <svg
      className={'user-icon ' + className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={iconStyle}
    >
      <circle
        cx="12"
        cy="7.5"
        r="3.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <path
        d="M9.66667 14H14.3333C17.4629 14 20 16.5371 20 19.6667C20 19.8508 19.8508 20 19.6667 20H4.33333C4.14924 20 4 19.8508 4 19.6667C4 16.5371 6.53705 14 9.66667 14Z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  </div>
)
