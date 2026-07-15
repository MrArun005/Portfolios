import { meta } from "@/lib/content";
import "./resume.css";

/** Full résumé as an on-screen paper document, shown inside an in-page modal. */
export function ResumeView() {
  return (
    <div className="rt">
      <div className="rt-toolbar">
        <a className="rt-download" href={meta.resume} target="_blank" rel="noopener">
          Download PDF ↓
        </a>
      </div>

      <header className="rt-head">
        <h1 className="rt-name">ARUN MALLIKARJUNA</h1>
        <div className="rt-headline">
          AI Platform &amp; Full-Stack Engineer | LLM Integration · Agentic Apps · System Design
        </div>
        <div className="rt-contact">
          {meta.email} · {meta.phone} · {meta.location} ·{" "}
          <a href={meta.linkedin} target="_blank" rel="noopener">LinkedIn</a> ·{" "}
          <a href={meta.github} target="_blank" rel="noopener">GitHub</a>
        </div>
      </header>

      <section className="rt-sec">
        <h2 className="rt-sec-title">Professional Summary</h2>
        <div className="rt-entry">
          <p className="rt-text">
            Full-stack engineer with 4+ years building and shipping production systems end to end —
            frontend, backend, and infrastructure — and 2+ years integrating LLM APIs (Gemini,
            Claude) and building core product features around them. Hands-on building agentic apps —
            custom AI agents with tool-calling, multi-step orchestration, subagents, system-prompt
            design, RAG pipelines, and evals — backed by strong system-design judgment and a
            product-driven mindset that ties code to the real customer problem. Comfortable owning
            the full lifecycle solo or in a small team — debugging and fixing failing code, reviewing
            implementations against the PRD, and running thorough QA (SIT, smoke, UAT, VAPT) before
            release.
          </p>
        </div>
      </section>

      <section className="rt-sec">
        <h2 className="rt-sec-title">Professional Experience</h2>
        <div className="rt-entry">
          <div className="rt-entry-head">
            <span className="rt-heading">Senior Software Engineer — Tecnotree Convergence</span>
            <span className="rt-sub">Jan 2024 – Present · Bengaluru, India</span>
          </div>
          <ul className="rt-bullets">
            <li>Owned architecture and technical decisions for a rule-based Promotion Engine — the team&rsquo;s go-to for design choices — letting business teams launch telecom campaigns without redeployment and removing engineering from the campaign-launch loop.</li>
            <li>Took the lead when systems failed: independently debugged and fixed production bottlenecks across distributed microservices, sustaining 99.5% availability under high transaction volume.</li>
            <li>Reviewed code and architecture against the PRD and ran thorough QA — SIT, smoke testing, UAT, and coordinated VAPT — to ship reliable releases.</li>
            <li>Made pragmatic performance and scope trade-offs without over-engineering — improved frontend performance ~30% via optimized React rendering, and tuned rule evaluation to cut per-request latency.</li>
            <li>Integrated third-party services and contributed to CI/CD and deployment workflows to ship reliably across the stack.</li>
            <li>Built reporting dashboards and analytics that surfaced campaign performance, aligning engineering output to clear business outcomes.</li>
          </ul>
        </div>
        <div className="rt-entry">
          <div className="rt-entry-head">
            <span className="rt-heading">Software Engineer — Tecnotree Convergence</span>
            <span className="rt-sub">Oct 2021 – Dec 2023 · Bengaluru, India</span>
          </div>
          <ul className="rt-bullets">
            <li>Built scalable REST APIs in Node.js for high-volume transaction processing, optimizing for low latency under concurrent load with async/await and event-driven patterns.</li>
            <li>Contributed to the microservices architecture, improving end-to-end throughput and system performance.</li>
            <li>Developed configurable campaign workflows so non-technical business teams could launch promotions independently — aligning the code to a real customer and business need.</li>
            <li>Optimized promotion rule-evaluation logic to reduce per-request latency and improve processing efficiency.</li>
          </ul>
        </div>
      </section>

      <section className="rt-sec">
        <h2 className="rt-sec-title">Projects</h2>
        <div className="rt-entry">
          <div className="rt-entry-head">
            <span className="rt-heading">Tailorwright — Open-Source Multi-Surface AI Agent</span>
            <span className="rt-sub">Next.js · TypeScript · NestJS · Claude API · github.com/MrArun005/resume-tailor</span>
          </div>
          <ul className="rt-bullets">
            <li>Designed, built, and open-sourced an AI résumé-tailoring agent shipped in four forms — a web app, a Claude Code skill, a custom subagent, and a CLI — from one shared agent core, spanning frontend, backend, and tooling.</li>
            <li>Designed the agent architecture: authored the system prompts, wired multi-step tool-calling and a delegated subagent, and built a planner/executor loop that reads inputs, decides actions, and self-corrects on failure.</li>
            <li>Enforced a strict no-fabrication guardrail and structured-output schemas so the agent&rsquo;s responses stay grounded and machine-validatable, with retries on schema mismatch.</li>
            <li>Built a deterministic, evaluation-ready scoring core and ran evals to measure agent output quality across cases, iterating on prompts to raise pass rates.</li>
            <li>Shipped a privacy-first local mode that runs entirely on the user&rsquo;s machine with no API key or server, and hardened the web app against SSRF and malicious input.</li>
          </ul>
        </div>
        <div className="rt-entry">
          <div className="rt-entry-head">
            <span className="rt-heading">Free Resume Pro — AI SaaS Platform</span>
            <span className="rt-sub">Next.js · React.js · Node.js · Gemini API · Vercel</span>
          </div>
          <ul className="rt-bullets">
            <li>Designed, built, and launched a full-stack AI SaaS product end to end as the sole developer — frontend, backend, and deployment — owning the entire lifecycle on a one-person team.</li>
            <li>Integrated the Gemini API with structured prompt engineering and a retrieval-augmented (RAG) flow over embeddings and vector retrieval for ATS scoring, job-description matching, and AI résumé rewriting.</li>
            <li>Architected a privacy-first system with zero user-data storage, shipped 12+ customizable templates with inline editing, and scaled it on Vercel — making pragmatic trade-offs to ship fast without over-engineering.</li>
          </ul>
        </div>
        <div className="rt-entry">
          <div className="rt-entry-head">
            <span className="rt-heading">Promotion Manager System — Internal Platform</span>
            <span className="rt-sub">Node.js · React.js · Microservices · REST APIs</span>
          </div>
          <ul className="rt-bullets">
            <li>Designed and built a scalable promotion-management system for telecom campaigns on a microservices backend.</li>
            <li>Built a rule-based engine that evaluates eligibility and applies promotions in real time, enabling non-technical teams to configure campaigns without code deployments.</li>
            <li>Optimized rule processing to improve throughput and reduce evaluation latency across high-volume traffic.</li>
          </ul>
        </div>
      </section>

      <section className="rt-sec">
        <h2 className="rt-sec-title">Technical Skills</h2>
        {[
          ["Languages", "JavaScript (ES6+), TypeScript, Python"],
          ["AI & LLMs", "LLM API integration (Gemini, Claude), AI Agents / Agentic Apps, Tool-Calling & Multi-Step Orchestration, Subagents, Prompt & System-Prompt Engineering, RAG pipelines, Embeddings & Vector Retrieval, Structured Outputs, Evals"],
          ["Backend", "Node.js, NestJS, Express.js, GraphQL, Apollo, Django, Flask, REST API design, Async/Await · Promises · Event Loop"],
          ["Frontend", "React.js, Next.js, State Management, Routing, HTML5, CSS3, Tailwind CSS"],
          ["Databases", "PostgreSQL (SQL), MongoDB · MongoDB Atlas (NoSQL), Schema Design"],
          ["Architecture & Infra", "Microservices, System Design, Design Patterns, Reliability & Scaling, Serverless, CI/CD, Vercel, Railway"],
          ["Auth & Security", "Firebase Authentication, JWT, Clerk, Authentication & Authorization, SSRF / Input Hardening"],
          ["QA & Testing", "SIT, Smoke Testing, UAT, VAPT"],
          ["Tools & Methods", "Git, Jenkins, Stripe, Agile, Scrum"],
        ].map(([h, t]) => (
          <div className="rt-entry" key={h}>
            <div className="rt-entry-head">
              <span className="rt-heading">{h}</span>
            </div>
            <p className="rt-text">{t}</p>
          </div>
        ))}
      </section>

      <section className="rt-sec">
        <h2 className="rt-sec-title">Education</h2>
        <div className="rt-entry">
          <div className="rt-entry-head">
            <span className="rt-heading">Bachelor of Engineering — Computer Science</span>
            <span className="rt-sub">Maharaja Institute of Technology, Mysuru · Graduated 2021</span>
          </div>
        </div>
      </section>
    </div>
  );
}
