import pageNotFoundImage from "../images/404.png";

function Page404() {
  return (
    <div className="page-404">
      <img
        className="page-404-image"
        src={pageNotFoundImage}
        alt="Page not found"
      />
    </div>
  );
}

export default Page404;
