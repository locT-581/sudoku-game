/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function Restart({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      fill="none"
      viewBox="0 0 157 157"
      className={className}
    >
      <path
        fill={color}
        d="M117.712 117.712c21.67-21.67 21.67-56.804 0-78.475-21.67-21.67-56.805-21.67-78.475 0-21.67 21.67-21.67 56.805 0 78.475 21.67 21.67 56.805 21.67 78.475 0Z"
      />
      <path
        fill="#3D435B"
        d="M110.925 75.214a34.81 34.81 0 1 0-34.64 38.08v-13.06a21.761 21.761 0 0 1-6.268-42.609 21.76 21.76 0 0 1 27.748 17.61h-13.05l19.33 25.569 19.33-25.57-12.45-.02Z"
      />
    </svg>
  );
}

export default Restart;
