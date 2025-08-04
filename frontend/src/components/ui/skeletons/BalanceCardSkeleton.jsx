import Skeleton from "@mui/material/Skeleton";

function BalanceCardSkeleton() {
  const bgcolor = "#c0c0c0";
  return (
    <>
      <Skeleton sx={{ bgcolor }} variant="text" width={180} height={30} />
      <Skeleton sx={{ bgcolor }} variant="text" width={100} height={20} />
    </>
  );
}

export default BalanceCardSkeleton;
