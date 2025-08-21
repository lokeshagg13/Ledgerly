import { Box, Skeleton } from "@mui/material";

function LineChartSkeleton() {
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
      <Skeleton
        sx={{ bgcolor, width: "100%", borderRadius: "1rem" }}
        variant="text"
        height={50}
      />
      <Skeleton
        sx={{ bgcolor, width: "100%", borderRadius: "1rem" }}
        variant="rectangular"
        height={200}
      />
    </Box>
  );
}

export default LineChartSkeleton;
