/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function Play({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      fill="none"
      viewBox="0 0 32 32"
      className={className}
    >
      <path
        fill={color}
        d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16Z"
      />
      <path fill="#3D435B" d="M10 26V7l17 9.501L10 26Z" />
    </svg>
  );
}

export default Play;
