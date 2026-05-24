import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="site-brand" href="#top">
          Multilingual Mental Health Hub
        </a>
        <nav aria-label="Primary navigation">
          <ul className="nav-links">
            <li>
              <a href="#resources">Resources</a>
            </li>
            <li>
              <a href="#submit">Submit</a>
            </li>
            <li>
              <a href="#languages">Languages</a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Community Powered</p>
            <h1>Mental health resources in every language</h1>
            <p>
              A welcoming space to discover support tools and share trusted
              resources with multilingual communities.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#resources">
                Browse resources
              </a>
              <a className="secondary-btn" href="#submit">
                Submit a resource
              </a>
            </div>
          </div>
          <img
            src={heroImg}
            className="hero-image"
            width="320"
            height="337"
            alt="Illustration of supportive conversation"
          />
        </section>

        <section id="resources" className="info-grid">
          <article className="info-card">
            <h2>Find what helps</h2>
            <p>
              Search by language, topic, and format so people can quickly find
              support they understand.
            </p>
          </article>
          <article id="submit" className="info-card">
            <h2>Contribute safely</h2>
            <p>
              Community members can submit resources that will be reviewed and
              tagged for easier discovery.
            </p>
          </article>
          <article id="languages" className="info-card">
            <h2>Support many languages</h2>
            <p>
              We are building language tagging and translation support to reduce
              access barriers.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
