import React from 'react';

/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  disable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function Heart({ size = '25', disable = false, className, style }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      fill="none"
      viewBox="0 0 45 39"
      className={className}
      style={style}
    >
      <path
        fill="#897D63"
        d="M18.648 36.213C12.8 31.316-.944 24.713.084 12.085 1.112-.543 16.317-3.844 21.807 7.699c0 0 4.018-5.85 9.39-7.33C36.57-1.11 44.925 3.31 45 14.208c.075 10.898-15.24 19.222-18.206 21.228-3.926 2.633-4.285 4.012-8.146.777Z"
        opacity=".6"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        fill={disable ? '#6B6969' : 'url(#a)'}
        d="M17.278 33.815C11.497 29.002-.96 24.38.06 11.935 1.079-.508 16.1-3.76 21.497 7.608c0 0 3.977-5.75 9.291-7.221s12.44 1.02 12.532 11.75c.092 10.731-15.038 18.947-18.004 20.894-3.877 2.616-4.203 3.97-8.038.785Z"
      />
      <path
        fill={disable ? '#51403F' : 'url(#b)'}
        d="M30.786.385c-5.313 1.471-9.29 7.221-9.29 7.221C16.099-3.76 1.06-.517.057 11.936-.945 24.387 11.495 29 17.277 33.815c3.81 3.183 4.177 1.83 8.02-.761C28.23 31.082 43.37 22.867 43.302 12.16 43.235 1.455 36.1-1.086 30.786.385Zm6.116 19.59a46.16 46.16 0 0 1-6.575 5.85c-2.607 1.864-5.631 3.469-8.355 5.14-1.17.702-.835 1.58-2.74.084-2.24-1.772-5.924-4.246-7.394-5.433-3.927-3.184-8.355-7.045-8.999-12.41-.417-3.343.326-7.773 3.484-9.77a8.854 8.854 0 0 1 9.116-.385c3.341 1.914 5.154 5.575 6.29 9.194.068-.298.154-.591.26-.878a16.966 16.966 0 0 1 3.475-5.75C27.78 3.06 32.25 1.012 35.641 2.625c6.684 3.176 5.522 12.704 1.261 17.35Z"
        opacity=".5"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        fill={disable ? '#797579' : 'url(#c)'}
        d="M8.78 2.894a8.614 8.614 0 0 0-5.7 7.946c-.409 6.778 5.565 11.701 10.77 16.055.209.167.443 0 .317-.242-1.955-3.301-5.096-6.11-6.149-9.879-1.93-6.878 4.587-12.97 10.745-7.88.902.743 1.303.409 1.094-.068-1.587-3.577-4.745-6.644-8.639-6.426a8.736 8.736 0 0 0-2.44.493Z"
        style={{ mixBlendMode: 'screen' }}
      />
      <path
        fill={disable ? '#3B363B' : 'url(#d)'}
        d="M30.696 2.767a7.332 7.332 0 0 0-1.53.393c-2.932 1.153-5.12 4.38-6.123 7.246v.042c-.15.225-.284.45-.418.677-.134.225.2.35.343.192 3.425-3.677 9.257-9.327 13.818-3.928.335.4 1.212.317 1.22-.318.034-3.978-3.993-5.248-7.31-4.304Z"
        style={{ mixBlendMode: 'screen' }}
      />
      <path
        fill={disable ? '#5C475C' : 'url(#e)'}
        d="M40.26 9.454c-.2 7.589-7.636 13.163-15.038 18.921-1.546 1.212-5.013 3.343-4.88 3.285 6.685-3.51 16.928-10.43 19.476-16.657a8.36 8.36 0 0 0 .443-5.549Z"
        style={{ mixBlendMode: 'screen' }}
      />
      <defs>
        <radialGradient
          id="a"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(-7.322 -29893.633 -71966.66) scale(1525.77 1256.26)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EF7C75" />
          <stop offset=".34" stopColor="#F02300" />
          <stop offset=".44" stopColor="#EB2200" />
          <stop offset=".54" stopColor="#DE2000" />
          <stop offset=".66" stopColor="#C71B00" />
          <stop offset=".77" stopColor="#A71600" />
          <stop offset=".88" stopColor="#820F00" />
        </radialGradient>
        <radialGradient
          id="b"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(19.72255 -2.53421 2.53497 19.7284 21.256 16.598)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EF7C75" />
          <stop offset=".34" stopColor="#F02300" />
          <stop offset=".66" stopColor="#A41500" />
          <stop offset=".79" stopColor="#820F00" />
        </radialGradient>
        <radialGradient
          id="e"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="rotate(-7.322 -14971.966 -35279.006) scale(374.957 412.158)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".04" stopColor="#FFF4FF" />
          <stop offset=".17" stopColor="#FAD8B3" />
          <stop offset=".95" stopColor="#DF2100" />
        </radialGradient>
        <linearGradient
          id="c"
          x1="3.005"
          x2="12.353"
          y1="9.33"
          y2="14.025"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".04" stopColor="#FFF4FF" />
          <stop offset=".17" stopColor="#FAD8B3" />
          <stop offset=".95" stopColor="#DF2100" />
        </linearGradient>
        <linearGradient
          id="d"
          x1="3622.32"
          x2="3623.2"
          y1="-869.026"
          y2="-792.398"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".04" stopColor="#FFF4FF" />
          <stop offset=".17" stopColor="#FAD8B3" />
          <stop offset=".95" stopColor="#DF2100" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Heart;
