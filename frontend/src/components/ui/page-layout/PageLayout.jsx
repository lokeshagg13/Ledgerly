function PageLayout({ bgImage, children }) {
  return (
    <div className="page-layout">
      <div
        className="page-bg-overlay"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="page-content-wrapper">{children}</div>
    </div>
  );
}

export default PageLayout;
