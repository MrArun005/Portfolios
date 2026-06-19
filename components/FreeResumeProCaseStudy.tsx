import "./folkgrove-cs.css";

/** Free Resume Pro (AI SaaS) case study, shown in an in-page modal. */
export function FreeResumeProCaseStudy({ onClose }: { onClose?: () => void }) {
  return (
    <div className="cs">
      {/* HERO */}
      <header className="hero">
        <div className="hero__grid" />
        <div className="cswrap hero__inner">
          <p className="eyebrow">Free Resume Pro · AI SaaS</p>
          <h1 className="h1">ATS-aware résumé tooling — with zero data stored.</h1>
          <p className="lead">
            A full-stack AI SaaS built and launched solo, end to end. The Gemini API drives ATS
            scoring, job-description matching, and résumé rewriting over a retrieval-augmented (RAG)
            flow — with a privacy-first design that persists nothing.
          </p>
          <div className="hero__meta">
            <span className="pill">Next.js</span>
            <span className="pill">React</span>
            <span className="pill">Node.js</span>
            <span className="pill">Gemini API</span>
            <span className="pill">Vercel</span>
          </div>

          <div className="trace">
            <p className="trace__caption">How a résumé gets scored</p>
            <div className="trace__pipe">
              <div className="node">
                <span className="node__idx">01 · INPUT</span>
                <span className="node__name">Résumé + JD</span>
                <span className="node__tech">nothing persisted</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">02 · EMBED</span>
                <span className="node__name">Embeddings</span>
                <span className="node__tech">vectorize the inputs</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">03 · RETRIEVE</span>
                <span className="node__name">Vector retrieval</span>
                <span className="node__tech">RAG over relevant context</span>
              </div>
              <div className="connector" />
              <div className="node node--db">
                <span className="node__idx">04 · GENERATE</span>
                <span className="node__name">Gemini</span>
                <span className="node__tech">structured prompt engineering</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">05 · OUT</span>
                <span className="node__name">Score + rewrite</span>
                <span className="node__tech">ATS score · gaps · on-spec rewrite</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AT A GLANCE */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">At a glance</p>
            <h2 className="h2">Shipped solo, end to end.</h2>
          </div>
          <div className="stats">
            <div className="stat"><span className="stat__num">12<span>+</span></span><span className="stat__label">customizable templates</span></div>
            <div className="stat"><span className="stat__num"><span>0</span></span><span className="stat__label">user data stored</span></div>
            <div className="stat"><span className="stat__num">1</span><span className="stat__label">person · full lifecycle</span></div>
            <div className="stat"><span className="stat__num">RAG</span><span className="stat__label">embeddings + retrieval</span></div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">Capabilities</p>
            <h2 className="h2">Scoring, rewriting, and a privacy-first core.</h2>
          </div>
          <div className="layers">
            <div className="layer">
              <span className="layer__tag">Scoring</span>
              <div className="layer__items">
                <span className="chip">ATS scoring</span>
                <span className="chip">job-description matching</span>
                <span className="chip">gap surfacing vs. target role</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Rewrite</span>
              <div className="layer__items">
                <span className="chip">structured prompt engineering</span>
                <span className="chip">consistent, on-spec output</span>
                <span className="chip">RAG over embeddings</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Privacy</span>
              <div className="layer__items">
                <span className="chip">zero-storage by design</span>
                <span className="chip">JWT auth</span>
                <span className="chip">nothing persisted</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Build</span>
              <div className="layer__items">
                <span className="chip">12+ templates · inline editing</span>
                <span className="chip">scaled on Vercel</span>
                <span className="chip">pragmatic, ship-fast trade-offs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="cswrap">
          <p className="foot__line"><b>Free Resume Pro</b> — AI résumé SaaS · built &amp; launched solo</p>
          <p className="foot__line muted">Gemini API · RAG · ATS scoring · zero-storage · scaled on Vercel.</p>
          <a className="foot__cta" href="#contact" onClick={onClose}>Work with me →</a>
        </div>
      </footer>
    </div>
  );
}
