import PageNotFoundImage from "../images/404.png";

function Page404() {
  return (
    <div className="page-404">
      <img
        src={PageNotFoundImage}
        alt="Page Not Found"
        className="page-404-image-full"
      />
    </div>
  );
}

export default Page404;
