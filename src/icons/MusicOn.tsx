/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function MusicOn({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 133 133"
      className={className}
    >
      <path
        fill={color}
        d="M33.682 33.676a34.884 34.884 0 0 0-12.895 2.453 33.78 33.78 0 0 0-10.93 7.006 32.239 32.239 0 0 0-7.302 10.49A31.166 31.166 0 0 0 0 66c0 8.573 3.549 16.794 9.865 22.856 6.317 6.062 14.884 9.468 23.817 9.468h6.937L80 132V0L40.619 33.676h-6.937ZM93 38l40-12.375V5L93 38Zm40 40V54L93 66.008 133 78Zm0 49v-20.619L93 94l40 33Z"
      />
    </svg>
  );
}

export default MusicOn;
