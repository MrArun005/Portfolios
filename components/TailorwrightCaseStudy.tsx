import "./folkgrove-cs.css";

/** Tailorwright (multi-surface AI agent) case study, shown in an in-page modal. */
export function TailorwrightCaseStudy({ onClose }: { onClose?: () => void }) {
  return (
    <div className="cs">
      {/* HERO */}
      <header className="hero">
        <div className="hero__grid" />
        <div className="cswrap hero__inner">
          <p className="eyebrow">Tailorwright · AI Agent</p>
          <h1 className="h1">One agent core, shipped as four products.</h1>
          <p className="lead">
            An open-source AI résumé-tailoring agent — a planner/executor loop with multi-step
            tool-calling and a delegated subagent — delivered as a web app, a Claude Code skill, a
            custom subagent, and a CLI, all from a single shared core.
          </p>
          <div className="hero__meta">
            <span className="pill">Claude API</span>
            <span className="pill">TypeScript</span>
            <span className="pill">Next.js</span>
            <span className="pill">NestJS</span>
            <span className="pill">Node.js</span>
            <span className="pill">CLI</span>
          </div>

          <div className="trace">
            <p className="trace__caption">The agent loop, end to end</p>
            <div className="trace__pipe">
              <div className="node">
                <span className="node__idx">01 · INPUT</span>
                <span className="node__name">Résumé + JD</span>
                <span className="node__tech">raw text in</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">02 · PLAN</span>
                <span className="node__name">Planner</span>
                <span className="node__tech">decides the next action</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">03 · ACT</span>
                <span className="node__name">Tool call</span>
                <span className="node__tech">multi-step · delegated subagent</span>
              </div>
              <div className="connector" />
              <div className="node node--db">
                <span className="node__idx">04 · CHECK</span>
                <span className="node__name">Schema validate</span>
                <span className="node__tech">no-fabrication guardrail</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">05 · CORRECT</span>
                <span className="node__name">Self-correct</span>
                <span className="node__tech">retry on mismatch / failure</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">06 · OUT</span>
                <span className="node__name">Tailored résumé</span>
                <span className="node__tech">grounded, validated</span>
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
            <h2 className="h2">One core, four surfaces, zero fabrication.</h2>
          </div>
          <div className="stats">
            <div className="stat"><span className="stat__num">4</span><span className="stat__label">delivery surfaces</span></div>
            <div className="stat"><span className="stat__num">1</span><span className="stat__label">shared agent core</span></div>
            <div className="stat"><span className="stat__num">100<span>%</span></span><span className="stat__label">schema-validated output</span></div>
            <div className="stat"><span className="stat__num"><span>0</span> keys</span><span className="stat__label">local mode · no server</span></div>
          </div>
        </div>
      </section>

      {/* SURFACES + CORE */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">Architecture</p>
            <h2 className="h2">Four surfaces over a single shared core.</h2>
            <p className="lead muted">
              The same planner, prompts, tools and scoring power every surface — write the agent
              once, ship it everywhere.
            </p>
          </div>
          <div className="layers">
            <div className="layer">
              <span className="layer__tag">Surfaces</span>
              <div className="layer__items">
                <span className="chip"><b>web app</b> — Next.js UI</span>
                <span className="chip"><b>skill</b> — Claude Code skill</span>
                <span className="chip"><b>subagent</b> — delegated agent</span>
                <span className="chip"><b>cli</b> — terminal</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Agent core</span>
              <div className="layer__items">
                <span className="chip">system prompts</span>
                <span className="chip">multi-step tool-calling</span>
                <span className="chip">planner / executor loop</span>
                <span className="chip">delegated subagent</span>
                <span className="chip">self-correction on failure</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Guardrails</span>
              <div className="layer__items">
                <span className="chip">no-fabrication rule</span>
                <span className="chip">structured-output schemas</span>
                <span className="chip">retry on schema mismatch</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Quality</span>
              <div className="layer__items">
                <span className="chip">deterministic scoring core</span>
                <span className="chip">evals across cases</span>
                <span className="chip">prompt iteration → higher pass rate</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Safety</span>
              <div className="layer__items">
                <span className="chip">local mode — no API key, no server</span>
                <span className="chip">SSRF-hardened web app</span>
                <span className="chip">malicious-input hardening</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="cswrap">
          <p className="foot__line"><b>Tailorwright</b> — open-source multi-surface AI agent</p>
          <p className="foot__line muted">Planner/executor · multi-step tool-calling · structured outputs · evals · local-first.</p>
          <a className="foot__cta" href="https://github.com/MrArun005/resume-tailor" target="_blank" rel="noopener" onClick={onClose}>View the repo →</a>
        </div>
      </footer>
    </div>
  );
}
