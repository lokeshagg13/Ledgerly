import officeImage from "../../images/office-bg.png";

function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <div
        className="page-bg-overlay"
        style={{ backgroundImage: `url(${officeImage})` }}
      ></div>
      {children}
    </div>
  );
}

export default PageLayout;
