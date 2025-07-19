import Skeleton from "@mui/material/Skeleton";

function NavSkeleton() {
  const bgcolor = "#f0f8ff";
  return (
    <>
      <Skeleton sx={{ bgcolor }} variant="text" width={100} height={40} />
      <Skeleton sx={{ bgcolor }} variant="text" width={150} height={40} />
      <Skeleton sx={{ bgcolor }} variant="text" width={100} height={40} />
      <Skeleton
        sx={{ bgcolor }}
        variant="rectangular"
        width={100}
        height={40}
      />
    </>
  );
}

export default NavSkeleton;
