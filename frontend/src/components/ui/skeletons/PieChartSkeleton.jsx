import { Box, Skeleton } from "@mui/material";

function PieChartSkeleton() {
  const bgcolor = "#c0c0c0";
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="1rem"
      sx={{ width: "100%", padding: 2 }}
    >
      <Skeleton sx={{ bgcolor }} variant="circular" width={160} height={160} />
      <Skeleton sx={{ bgcolor }} variant="text" width={160} height={40} />
    </Box>
  );
}

export default PieChartSkeleton;
