/* eslint-disable react/require-default-props */
interface Props {
  size?: string;
  color?: string;
  className?: string;
}

function MusicOff({ size = '25', color = '#FEFAE0', className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 26 22"
      className={className}
    >
      <path
        fill={color}
        d="M5.633 6.028A4.946 4.946 0 0 0 .69 10.972a4.944 4.944 0 0 0 4.944 4.944h1.009l5.782 5.15V.88L6.643 6.028h-1.01Zm17.591 4.944 2.002-2.002a1.609 1.609 0 0 0 0-2.26l-.411-.41a1.609 1.609 0 0 0-2.26 0l-2.001 2.004-2.004-2.005a1.609 1.609 0 0 0-2.26 0l-.409.412a1.596 1.596 0 0 0 0 2.26l2.002 2-2.002 2.005a1.596 1.596 0 0 0 0 2.26l.41.408a1.597 1.597 0 0 0 2.259 0l2.004-2.002 2.002 2.002a1.596 1.596 0 0 0 2.259 0l.411-.409a1.609 1.609 0 0 0 0-2.259l-2.002-2.004Z"
      />
    </svg>
  );
}

export default MusicOff;
