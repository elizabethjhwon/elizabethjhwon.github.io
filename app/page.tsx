const work = [
  {
    number: "01",
    year: "2026",
    kind: "Research",
    title: "Two-Dimensional Fourier Continuation on Domains with Corners",
    note: "Applied mathematics · manuscript in preparation",
    id: "research",
  },
  {
    number: "02",
    year: "2025",
    kind: "Essay",
    title: "Metaphors for Artificial Intelligence in Law",
    note: "Law, technology, and literature",
    id: "writing",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a className="wordmark" href="#top" aria-label="Elizabeth Won, home">
          Elizabeth Won
        </a>
        <nav aria-label="Primary navigation">
          <a href="#writing">Writing</a>
          <a href="#research">Research</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section className="hero shell" id="top">
        <aside className="index-rail" aria-label="Areas of interest">
          <p>
            Mathematics
            <br />
            Law
            <br />
            Technology
            <br />
            Literature
          </p>
          <span aria-hidden="true" className="crosshair" />
          <p className="coordinates">34.1377° N<br />118.1253° W</p>
        </aside>

        <div className="hero-copy">
          <p className="eyebrow">Writer · Mathematician</p>
          <h1>Elizabeth Won</h1>
          <p className="dek">
            I write about mathematics, law, technology, and literature.
          </p>
          <a className="text-link" href="#selected-work">
            Browse selected work <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="work shell" id="selected-work">
        <div className="section-heading">
          <h2>Selected work</h2>
          <span />
        </div>

        <div className="work-list">
          {work.map((item) => (
            <a className="work-row" href={`#${item.id}`} key={item.number}>
              <span className="work-number">{item.number}</span>
              <span className="work-year">{item.year}</span>
              <span className="work-main">
                <span className="work-kind">{item.kind}</span>
                <span className="work-title">{item.title}</span>
                <span className="work-note">{item.note}</span>
              </span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      </section>

      <section className="detail shell" id="research">
        <div className="detail-label">Research</div>
        <div className="detail-copy">
          <h2>Computational mathematics and singularity formation</h2>
          <p>
            My work centers on numerical analysis and partial differential
            equations: from Fourier continuation methods for nonperiodic
            problems to computations of self-similar singularities in fluid
            models.
          </p>
          <p className="availability">Papers and preprints will be added here.</p>
        </div>
      </section>

      <section className="detail shell" id="writing">
        <div className="detail-label">Essays &amp; criticism</div>
        <div className="detail-copy">
          <h2>Law, language, and technology</h2>
          <p>
            My essays explore how metaphors, narrative, and science fiction
            shape the legal imagination—particularly the ways we assign
            agency, responsibility, and power to artificial intelligence.
          </p>
          <p className="availability">Selected essays will be added here.</p>
        </div>
      </section>

      <section className="about shell" id="about">
        <div className="section-heading">
          <h2>About</h2>
          <span />
        </div>
        <div className="about-grid">
          <p className="about-lead">
            I am a mathematician and writer interested in problems that sit
            between proof and interpretation.
          </p>
          <p>
            I studied applied and computational mathematics and English at
            Caltech. Across research and writing, I am drawn to questions that
            demand both technical precision and careful attention to language.
          </p>
        </div>
      </section>

      <footer className="site-footer shell">
        <p>Elizabeth Won</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
