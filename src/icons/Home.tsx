/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function Home({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      fill="none"
      viewBox="0 0 42 39"
      className={className}
    >
      <path
        fill={color}
        d="M36.273 37.015c0 .526-.201 1.031-.56 1.404a1.873 1.873 0 0 1-1.35.581H7.637c-.506 0-.992-.21-1.35-.581a2.026 2.026 0 0 1-.559-1.404V19.151H0L19.715.517C20.067.184 20.525 0 21 0c.475 0 .933.184 1.285.517L42 19.15h-5.727v17.864Z"
      />
    </svg>
  );
}

export default Home;
