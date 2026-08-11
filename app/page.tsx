"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Project = {
  index: string;
  title: string;
  subtitle: string;
  type: string;
  color: string;
  summary: string;
  detail: string;
  stack: string[];
  signal: string;
};

const projects: Project[] = [
  {
    index: "01",
    title: "Switchgear / ADMS",
    subtitle: "A control room for critical infrastructure.",
    type: "INDUSTRIAL SYSTEMS",
    color: "lime",
    summary:
      "Real-time monitoring and remote control for electrical switchgear, built around an IEC 60870-5-104 workflow.",
    detail:
      'I helped shape a scalable Advanced Distribution Management System with a focus on safe remote operations. The “Double Command” flow is protected with TOTP authentication, while advanced search makes large device trees easier to navigate. I also supported AWS environment monitoring and zero-downtime deployment planning.',
    stack: ["Java", "Spring Boot", "React", "AWS", "TOTP"],
    signal: "SAFETY FIRST",
  },
  {
    index: "02",
    title: "NEXA Platform",
    subtitle: "One view of a thousand small signals.",
    type: "OBSERVABILITY",
    color: "blue",
    summary:
      "A product health platform that unifies Dynatrace, JSM and Zabbix data across multiple tenants.",
    detail:
      "The work was equal parts interface and infrastructure: a unified problem dashboard for incident visibility, Keycloak + Azure AD for secure SSO, and JVM tuning with VisualVM to reduce memory pressure. The result was a faster path from signal to response.",
    stack: ["React", "TypeScript", "Java", "Keycloak", "JVM"],
    signal: "SIGNAL → ACTION",
  },
  {
    index: "03",
    title: "Synapse CI",
    subtitle: "Research that survives outside the lab.",
    type: "RESEARCH / DX",
    color: "orange",
    summary:
      "An intelligent test prioritization and chaos engineering framework, presented at ICCTA 2026 in Austria.",
    detail:
      "Synapse CI explores how teams can spend less time waiting and more time learning. The project was published at the 12th International Conference on Computer Technology Applications and received the Best of Session Presentation award.",
    stack: ["CI/CD", "Test Systems", "Chaos Engineering", "Research"],
    signal: "PUBLISHED · 2026",
  },
];

const capabilities = [
  { name: "Backend systems", value: "JAVA · GO · NODE" },
  { name: "Frontend craft", value: "REACT · NEXT.JS · TS" },
  { name: "Cloud & delivery", value: "AWS · DOCKER · K8S" },
  { name: "Data layer", value: "POSTGRES · REDIS · MONGO" },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Back to top">
          <span className="brand-mark">KM</span>
          <span className="brand-copy">
            <strong>Kaweesha</strong>
            <small>software engineer</small>
          </span>
        </a>
        <button
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
          <a href="#work" onClick={closeMenu}>01 / Work</a>
          <a href="#story" onClick={closeMenu}>02 / Story</a>
          <a href="#toolkit" onClick={closeMenu}>03 / Toolkit</a>
          <a href="#contact" onClick={closeMenu}>04 / Contact</a>
        </nav>
        <a className="header-link" href="/Kaweesha-Marasinghe-Resume-2.pdf" download>
          Download CV <span>↗</span>
        </a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow reveal reveal-1"><span className="pulse-dot" /> AVAILABLE FOR GOOD WORK · COLOMBO, LK</p>
          <h1 className="reveal reveal-2">
            Systems with a <em>human</em> side.
          </h1>
          <p className="hero-lede reveal reveal-3">
            I&apos;m Kaweesha — a software engineer who turns complex systems into calm, useful experiences. Backend depth, frontend instinct, and a soft spot for the details people usually miss.
          </p>
          <div className="hero-actions reveal reveal-4">
            <a className="button button-primary" href="#work">See the work <span>↓</span></a>
            <a className="text-link" href="mailto:kaweesha.mr@gmail.com">Start a conversation <span>↗</span></a>
          </div>
        </div>

        <div className="hero-visual reveal reveal-3" aria-label="A profile card for Kaweesha Marasinghe">
          <div className="hero-grid" aria-hidden="true" />
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="profile-card">
            <div className="profile-card-top"><span>PROFILE / 01</span><span>2026</span></div>
            <div className="portrait-frame"><Image src="/images/kaweesha-avatar.png" alt="Kaweesha Marasinghe" width={180} height={180} priority /></div>
            <div className="profile-name">K. MARASINGHE</div>
            <div className="profile-role">SOFTWARE ENGINEER<span className="cursor" /></div>
            <div className="profile-card-bottom"><span>COLOMBO, SRI LANKA</span><span>● ONLINE</span></div>
          </div>
          <div className="floating-chip chip-stack"><span className="chip-symbol">⌘</span><span>full-stack<br /><b>by instinct</b></span></div>
          <div className="floating-chip chip-degree"><span className="chip-symbol">3.78</span><span>CGPA<br /><b>SLIIT</b></span></div>
          <div className="visual-caption">[ A LITTLE CODE / A LOT OF CARE ]</div>
        </div>

        <div className="hero-meta reveal reveal-4">
          <span>Scroll to explore</span><span className="scroll-line" /><span>↓</span>
        </div>
      </section>

      <section className="ticker" aria-label="Skills marquee">
        <div className="ticker-track">
          <span>BUILD WITH INTENT</span><i>✳</i><span>LEAVE THINGS BETTER</span><i>✳</i><span>BUILD WITH INTENT</span><i>✳</i><span>LEAVE THINGS BETTER</span><i>✳</i>
        </div>
      </section>

      <section className="intro section-shell" id="story">
        <div className="section-label">01 <span>/</span> THE SHORT VERSION</div>
        <div className="intro-grid">
          <h2>I like the space between <span>logic</span> and feeling.</h2>
          <div className="intro-body">
            <p className="lead-paragraph">Good software should feel like someone thought about you before you arrived.</p>
            <p>My work sits across backend engineering, frontend development, and the connective tissue in between. I&apos;ve built industrial control systems, observability platforms, and developer tools — always with the same question in mind: <strong>how can this be clearer, safer, and kinder to the person using it?</strong></p>
            <div className="signature"><span>KM</span><small>engineered in Sri Lanka<br />for a wider world</small></div>
          </div>
        </div>
        <div className="stats-row">
          <div><strong>3.78</strong><span>CGPA / SLIIT</span></div>
          <div><strong>2026</strong><span>ICCTA publication</span></div>
          <div><strong>01</strong><span>best presentation award</span></div>
          <div><strong>∞</strong><span>things still to learn</span></div>
        </div>
      </section>

      <section className="work section-shell" id="work">
        <div className="section-heading">
          <div className="section-label">02 <span>/</span> SELECTED WORK</div>
          <p>Not just features shipped.<br /><span>Systems made steadier.</span></p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <article className={`project-card project-${project.color}`} key={project.index}>
              <div className="project-index">{project.index}</div>
              <div className="project-main">
                <div className="project-kicker">{project.type}</div>
                <h3>{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>
                <p className="project-summary">{project.summary}</p>
                <div className="project-footer"><div className="tag-list">{project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div><button onClick={() => setSelectedProject(project)}>Open case note <span>↗</span></button></div>
              </div>
              <div className="project-art" aria-hidden="true">
                {project.color === "lime" && <><div className="switchgear-lines"><span /><span /><span /><span /></div><div className="switchgear-node">A</div><div className="switchgear-node node-two">B</div><div className="switchgear-node node-three">C</div></>}
                {project.color === "blue" && <><div className="signal-wave wave-one" /><div className="signal-wave wave-two" /><div className="signal-wave wave-three" /><div className="signal-core">N</div></>}
                {project.color === "orange" && <><div className="research-orbit orbit-a" /><div className="research-orbit orbit-b" /><div className="research-core">CI</div><span className="research-star star-one">+</span><span className="research-star star-two">+</span></>}
              </div>
              <div className="project-signal">{project.signal}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="process section-shell">
        <div className="section-label">03 <span>/</span> HOW I WORK</div>
        <div className="process-grid">
          <div className="process-intro"><h2>Clarity is a technical skill.</h2><p>I bring a systems view to the work, then make room for the human one.</p></div>
          <div className="principles">
            <div className="principle"><span>01</span><div><h3>Start with the edges.</h3><p>What happens when the network drops? When the user is tired? The edge cases are usually the actual cases.</p></div></div>
            <div className="principle"><span>02</span><div><h3>Make the invisible legible.</h3><p>Good observability, clear naming, and an interface that explains itself beat cleverness every time.</p></div></div>
            <div className="principle"><span>03</span><div><h3>Share what you learn.</h3><p>Whether it&apos;s a code review or a knowledge-sharing session, the best systems grow through generous teams.</p></div></div>
          </div>
        </div>
      </section>

      <section className="toolkit section-shell" id="toolkit">
        <div className="toolkit-copy"><div className="section-label">04 <span>/</span> THE TOOLKIT</div><h2>Deep enough to go low-level. Curious enough to zoom out.</h2><p>My comfort zone is wherever the problem is interesting: a Spring Boot service, a React interface, a Terraform plan, or the conversation that makes the whole thing simpler.</p></div>
        <div className="capability-list">{capabilities.map((item, i) => <div className="capability" key={item.name}><span className="capability-num">0{i + 1}</span><span className="capability-name">{item.name}</span><span className="capability-value">{item.value}</span></div>)}</div>
        <div className="tech-cloud" aria-label="Technology list"><span>Spring Boot</span><span>Next.js</span><span>PostgreSQL</span><span>Kubernetes</span><span>RabbitMQ</span><span>GitHub Actions</span><span>Terraform</span><span>Tailwind</span><span>Redis</span><span>Keycloak</span><span>Docker</span><span>Figma</span></div>
      </section>

      <section className="closing section-shell" id="contact">
        <div className="closing-orbit" aria-hidden="true"><span>✳</span></div>
        <div className="section-label">05 <span>/</span> YOUR TURN</div>
        <h2>Have a good problem?<br /><em>Let&apos;s make it useful.</em></h2>
        <p>I&apos;m always interested in ambitious products, thoughtful teams, and conversations that start with “what if?”</p>
        <a className="button button-primary button-large" href="mailto:kaweesha.mr@gmail.com">kaweesha.mr@gmail.com <span>↗</span></a>
        <div className="social-links"><a href="https://www.linkedin.com/in/kaweeshamr/" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a><a href="https://github.com/Kaweesha-mr" target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a href="tel:+94770723273">+94 77 072 3273</a></div>
      </section>

      <footer className="site-footer section-shell"><span>© 2026 KAWEESHA MARASINGHE</span><span>BUILT WITH CURIOSITY / LK</span><a href="#top">BACK TO TOP ↑</a></footer>

      {selectedProject && <div className="modal-backdrop"><div className={`case-modal project-${selectedProject.color}`} role="dialog" aria-modal="true" aria-labelledby="case-title"><button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close case note">×</button><div className="project-kicker">{selectedProject.index} / {selectedProject.type}</div><h2 id="case-title">{selectedProject.title}</h2><p className="modal-subtitle">{selectedProject.subtitle}</p><p>{selectedProject.detail}</p><div className="modal-stack">{selectedProject.stack.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="modal-note">{selectedProject.signal}</div></div></div>}
    </main>
  );
}
