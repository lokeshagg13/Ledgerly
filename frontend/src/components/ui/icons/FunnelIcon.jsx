export default function FunnelIcon({
  width = "1em",
  height = "1em",
  fill = "white",
  stroke = "black",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
    >
      <path
        d="M3 4H21L14 12V20L10 22V12L3 4Z"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
