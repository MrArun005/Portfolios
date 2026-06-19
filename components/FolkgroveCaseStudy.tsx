import "./folkgrove-cs.css";

/** Folkgrove platform-architecture case study, rendered inside an in-page modal. */
export function FolkgroveCaseStudy({ onClose }: { onClose?: () => void }) {
  return (
    <div className="cs">
      {/* HERO */}
      <header className="hero">
        <div className="hero__grid" />
        <div className="cswrap hero__inner">
          <p className="eyebrow">Folkgrove · Platform Architecture</p>
          <h1 className="h1">A multi-tenant HRMS that gives every customer its own database.</h1>
          <p className="lead">
            An enterprise HR platform — payroll, attendance, performance, recruiting and more —
            built for hard tenant isolation. The control plane knows <em>who</em> a tenant is;
            their data never shares a database with anyone else&rsquo;s.
          </p>
          <div className="hero__meta">
            <span className="pill">Next.js 15</span>
            <span className="pill">NestJS</span>
            <span className="pill">Prisma · MySQL 8</span>
            <span className="pill">Redis · BullMQ</span>
            <span className="pill">OpenSearch</span>
            <span className="pill">Cerbos</span>
            <span className="pill">AWS · Terraform</span>
          </div>

          <div className="trace">
            <p className="trace__caption">One request, end to end</p>
            <div className="trace__pipe">
              <div className="node">
                <span className="node__idx">01 · CLIENT</span>
                <span className="node__name">Browser</span>
                <span className="node__tech">Next.js 15 employee portal (PWA)</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">02 · EDGE</span>
                <span className="node__name">Same-origin proxy</span>
                <span className="node__tech">Auth cookies stay first-party</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">03 · API</span>
                <span className="node__name">Gateway</span>
                <span className="node__tech">NestJS · JwtGuard · Cerbos check</span>
              </div>
              <div className="connector" />
              <div className="node">
                <span className="node__idx">04 · ROUTING</span>
                <span className="node__name">Tenant resolver</span>
                <span className="node__tech">LRU pool of per-tenant clients</span>
              </div>
              <div className="connector" />
              <div className="node node--db">
                <span className="node__idx">05 · DATA</span>
                <span className="node__name">Isolated DB</span>
                <span className="node__tech">that tenant&rsquo;s own MySQL schema</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SCALE */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">Design targets</p>
            <h2 className="h2">Sized for the enterprise, before the first customer.</h2>
          </div>
          <div className="stats">
            <div className="stat"><span className="stat__num">5,000</span><span className="stat__label">employees / tenant</span></div>
            <div className="stat"><span className="stat__num">1,000</span><span className="stat__label">tenants / region (architected)</span></div>
            <div className="stat"><span className="stat__num">30,000</span><span className="stat__label">peak concurrent users</span></div>
            <div className="stat"><span className="stat__num">{"<"}<span>5</span> min</span><span className="stat__label">payroll · 5k employees</span></div>
            <div className="stat"><span className="stat__num">{"<"}<span>300</span> ms</span><span className="stat__label">API p95 · read</span></div>
            <div className="stat"><span className="stat__num">99.9<span>%</span></span><span className="stat__label">availability SLO / region</span></div>
          </div>
        </div>
      </section>

      {/* TENANCY */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">Tenancy model</p>
            <h2 className="h2">Database per tenant — and a connection budget that survives it.</h2>
            <p className="lead muted">
              Isolated databases give the strongest possible blast-radius guarantee. The cost is
              connections: pool naively and you exhaust MySQL at a few hundred tenants. So clients
              are pooled, not permanent.
            </p>
          </div>

          <div className="iso">
            <div className="iso__control">
              <span className="tenant__dot" />
              <b>Control plane DB</b>
              <span className="mono muted">tenants · users · plans · routing · audit</span>
            </div>
            <div className="iso__tenants">
              {[
                { name: "Acme", db: "hrms_tenant_acme" },
                { name: "Innovate", db: "hrms_tenant_innovate" },
                { name: "Northwind", db: "hrms_tenant_northwind" },
                { name: "…n", db: "hrms_tenant_{id}" },
              ].map((t) => (
                <div className="tenant" key={t.db}>
                  <div className="tenant__bar">
                    <span className="tenant__dot" />
                    <span className="tenant__name">{t.name}</span>
                  </div>
                  <span className="tenant__db">db: {t.db}</span>
                  <div className="tenant__rows">
                    <div className="tenant__row" />
                    <div className="tenant__row" />
                    <div className="tenant__row" />
                  </div>
                </div>
              ))}
            </div>
            <p className="iso__note">
              A per-tenant Prisma client is created on demand and held in an{" "}
              <code>LRU + idle-eviction</code> cache — only the hottest tenants stay connected. A
              boot-time guard checks <code>cache × conn-limit × replicas</code> against{" "}
              <code>max_connections</code> and refuses to start if the math doesn&rsquo;t fit.
            </p>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">The stack</p>
            <h2 className="h2">Five deployable apps over a shared package core.</h2>
          </div>
          <div className="layers">
            <div className="layer">
              <span className="layer__tag">Client</span>
              <div className="layer__items">
                <span className="chip"><b>web</b> — employee &amp; admin portal (Next.js 15, PWA)</span>
                <span className="chip"><b>control-plane</b> — platform &amp; jurisdiction admin</span>
                <span className="chip"><b>marketing</b> — public site</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Services</span>
              <div className="layer__items">
                <span className="chip"><b>api</b> — NestJS · 40 controllers</span>
                <span className="chip"><b>worker</b> — BullMQ jobs: payroll, bulk import, exports</span>
                <span className="chip"><b>Cerbos</b> — policy-based authz sidecar</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Identity</span>
              <div className="layer__items">
                <span className="chip">Auth.js</span>
                <span className="chip">Password + TOTP MFA</span>
                <span className="chip">SAML 2.0</span>
                <span className="chip">OIDC SSO</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Data</span>
              <div className="layer__items">
                <span className="chip"><b>MySQL 8</b> — control + per-tenant (Prisma)</span>
                <span className="chip"><b>Redis</b> — cache, sessions, queues</span>
                <span className="chip"><b>OpenSearch</b> — directory &amp; full-text</span>
              </div>
            </div>
            <div className="layer">
              <span className="layer__tag">Shared core</span>
              <div className="layer__items">
                <span className="chip">db</span>
                <span className="chip">auth</span>
                <span className="chip">authz</span>
                <span className="chip">audit</span>
                <span className="chip">crypto</span>
                <span className="chip">session</span>
                <span className="chip">sso</span>
                <span className="chip">workflow</span>
                <span className="chip">email</span>
                <span className="chip">observability</span>
                <span className="chip">rule-pack · india / us / generic</span>
                <span className="chip mono muted">Turborepo monorepo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">Surface area</p>
            <h2 className="h2">Fourteen HR modules on one tenant-isolated core.</h2>
            <p className="lead muted">
              Statutory logic is data, not code: a country-agnostic core reads tax slabs, rates and
              holidays from the database, with pluggable India &amp; US rule packs.
            </p>
          </div>
          <div className="mods">
            {[
              "Core HR", "Self-service", "Attendance", "Leave", "Payroll · IN + US",
              "Recruitment", "Onboarding", "Performance", "Learning", "Expenses",
              "Helpdesk", "Engagement", "Analytics", "Workflow + GDPR",
            ].map((m, i) => (
              <div className="mod" key={m}>
                <span className="mod__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="mod__t">{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFRA */}
      <section className="section">
        <div className="cswrap">
          <div className="section__head">
            <p className="eyebrow">Infrastructure</p>
            <h2 className="h2">Two regions, data resident where the law requires it.</h2>
            <p className="lead muted">
              Containers on Fargate, managed data stores, everything in Terraform. Tenants are
              pinned to a region for data residency.
            </p>
          </div>
          <div className="regions">
            <div className="region">
              <div>
                <span className="region__code">ap-south-1</span> · <span className="region__name">Mumbai</span>
              </div>
              <div className="region__svc">
                <span className="chip">ECS Fargate</span>
                <span className="chip">RDS MySQL</span>
                <span className="chip">ElastiCache</span>
                <span className="chip">OpenSearch</span>
                <span className="chip">S3 + CloudFront</span>
                <span className="chip">KMS</span>
                <span className="chip">SES</span>
              </div>
              <span className="mono muted" style={{ fontSize: "0.74rem" }}>India tenants · INR payroll · TDS / PF / ESI</span>
            </div>
            <div className="region">
              <div>
                <span className="region__code">us-east-1</span> · <span className="region__name">N. Virginia</span>
              </div>
              <div className="region__svc">
                <span className="chip">ECS Fargate</span>
                <span className="chip">RDS MySQL</span>
                <span className="chip">ElastiCache</span>
                <span className="chip">OpenSearch</span>
                <span className="chip">S3 + CloudFront</span>
                <span className="chip">KMS</span>
                <span className="chip">SES</span>
              </div>
              <span className="mono muted" style={{ fontSize: "0.74rem" }}>US tenants · USD payroll · W-2 / 941 / NACHA</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="cswrap">
          <p className="foot__line"><b>Folkgrove</b> — multi-tenant HRMS · isolated database per tenant</p>
          <p className="foot__line">82 tenant + 17 control data models · ~2,400 automated tests · Turborepo</p>
          <p className="foot__line muted">Scale figures are design targets from the platform spec.</p>
          <a href="#contact" className="foot__cta" onClick={onClose}>Work with me →</a>
        </div>
      </footer>
    </div>
  );
}
