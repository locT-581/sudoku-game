/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function Back({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      fill="none"
      viewBox="0 0 25 25"
      className={className}
    >
      <path
        fill={color}
        d="M0 12.495 12.816 0v7.41h9.952c.592 0 1.16.266 1.578.74A2.7 2.7 0 0 1 25 9.933v5.123a2.7 2.7 0 0 1-.654 1.784c-.418.474-.986.74-1.578.74h-9.952V25L0 12.495Z"
      />
    </svg>
  );
}

export default Back;
