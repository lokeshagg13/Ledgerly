function PageLayout({ bgImage, children }) {
  return (
    <div className="page-layout">
      <div
        className="page-bg-overlay"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      {children}
    </div>
  );
}

export default PageLayout;
