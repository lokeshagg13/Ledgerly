export default function DownloadIcon({
  width = "1em",
  height = "1em",
  fill = "black",
  stroke = "black",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      strokeWidth={20}
    >
      <path d="M16 316.8a16 16 0 0 1 16 16v80a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32v-80a16 16 0 0 1 32 0v80a64 64 0 0 1-64 64H64a64 64 0 0 1-64-64v-80a16 16 0 0 1 16-16" />
      <path d="M245.7 379.2a16 16 0 0 0 22.6 0l96-96a16 16 0 0 0-22.6-22.6L272 329.4V48a16 16 0 0 0-32 0v281.4l-69.7-69.8a16 16 0 1 0-22.6 22.6z" />
    </svg>
  );
}