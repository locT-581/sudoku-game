/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function Save({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      fill="none"
      viewBox="0 0 18 18"
      className={className}
    >
      <path
        fill={color}
        d="M2 2v14h14V4.828L13.172 2H2ZM1 0h13l3.707 3.707a1 1 0 0 1 .293.707V17a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1Zm8 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM3 3h9v4H3V3Z"
      />
    </svg>
  );
}

export default Save;
