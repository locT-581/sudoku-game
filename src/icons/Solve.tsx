/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function Solve({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      fill="none"
      viewBox="0 0 45 45"
      className={className}
    >
      <path
        fill={color}
        d="M21.562 3.75c-9.825 0-17.812 7.987-17.812 17.812 0 9.825 7.987 17.813 17.812 17.813 9.825 0 17.813-7.988 17.813-17.813S31.387 3.75 21.562 3.75Zm0 22.031h-5.625a1.416 1.416 0 0 1-1.406-1.406c0-.769.637-1.407 1.406-1.407h5.625c.769 0 1.406.638 1.406 1.407 0 .768-.637 1.406-1.406 1.406Zm5.625-5.625h-11.25a1.416 1.416 0 0 1-1.406-1.406c0-.769.637-1.407 1.406-1.407h11.25c.769 0 1.406.638 1.406 1.407 0 .768-.637 1.406-1.406 1.406Zm12.752 21.091c-.338 0-.675-.131-.919-.375l-3.488-3.487a1.324 1.324 0 0 1 0-1.857 1.324 1.324 0 0 1 1.857 0l3.487 3.488a1.324 1.324 0 0 1 0 1.856c-.262.244-.6.375-.937.375Z"
      />
    </svg>
  );
}

export default Solve;
