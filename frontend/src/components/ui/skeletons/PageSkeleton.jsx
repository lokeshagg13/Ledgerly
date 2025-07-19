import Skeleton from "@mui/material/Skeleton";

function PageSkeleton() {
  return (
    <div className="skeleton-wrapper">
      <Skeleton
        variant="rectangular"
        width="90%"
        height="90%"
        sx={{ bgcolor: "#dcdcdc", borderRadius: "2rem" }}
      />
    </div>
  );
}

export default PageSkeleton;
