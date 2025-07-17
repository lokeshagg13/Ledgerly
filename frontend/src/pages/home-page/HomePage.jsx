import { Button } from "react-bootstrap";
import bgImage from "../../images/fin-image.png";

function HomePage() {
  return (
    <div className="home-container">
      <main className="hero">
        {/* Background image for small screens */}
        <div
          className="bg-overlay"
          style={{ backgroundImage: `url(${bgImage})` }}
        ></div>

        <div className="hero-text">
          <h1>Track money. Stay organized.</h1>
          <p>
            Manage user accounts, log transactions, and stay in control of your
            finances. Ledgerly brings you clean summaries, smart categorization,
            and powerful reports.
          </p>
          <div className="cta-buttons">
            <Button className="btn-blue" href="/register">
              Try Ledgerly →
            </Button>
            <button className="btn-outline">See what"s new</button>
          </div>
        </div>

        <div className="hero-image">
          <img src={bgImage} alt="Ledgerly dashboard illustration" />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
