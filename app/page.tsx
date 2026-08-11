"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  CloudCog,
  Code2,
  Database,
  Download,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Layers3,
  Mail,
  Menu,
  Network,
  Phone,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  X,
} from "lucide-react";

type Project = {
  number: string;
  title: string;
  label: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  tone: "blue" | "violet" | "orange";
  technologies: string[];
  result: string;
};

const projects: Project[] = [
  {
    number: "01",
    title: "Switchgear / ADMS",
    label: "INDUSTRIAL SOFTWARE",
    description: "Real-time monitoring and remote control for electrical switchgear using the IEC 60870-5-104 protocol.",
    detail: "I contributed to a scalable Advanced Distribution Management System for critical infrastructure. The work included TOTP authentication for the Double Command execution flow, advanced device search, AWS monitoring, and zero-downtime deployment strategies.",
    icon: Network,
    tone: "blue",
    technologies: ["Java", "Spring Boot", "React", "AWS"],
    result: "Built for safe, visible operations",
  },
  {
    number: "02",
    title: "NEXA Platform",
    label: "OBSERVABILITY",
    description: "A product health platform unifying Dynatrace, JSM, and Zabbix signals across multiple tenants.",
    detail: "I helped develop the unified Problem Dashboard, integrated Keycloak + Azure AD for secure SSO, refactored performance-heavy paths, and used VisualVM to identify memory leaks and tune JVM behavior in local and Dockerized environments.",
    icon: Workflow,
    tone: "violet",
    technologies: ["React", "TypeScript", "Java", "Keycloak"],
    result: "From signal to response, faster",
  },
  {
    number: "03",
    title: "Synapse CI",
    label: "RESEARCH / DEVELOPER EXPERIENCE",
    description: "An intelligent test prioritization and chaos engineering framework presented at ICCTA 2026.",
    detail: "Synapse CI explores how engineering teams can reduce feedback time while increasing confidence. The research was presented in Austria and received the Best of Session Presentation award.",
    icon: Sparkles,
    tone: "orange",
    technologies: ["CI/CD", "Test Systems", "Research", "Chaos Engineering"],
    result: "Published research, practical thinking",
  },
];

const toolkit = [
  { title: "Backend engineering", detail: "Java · Spring Boot · Go · Node.js", icon: Server },
  { title: "Frontend development", detail: "React · Next.js · TypeScript · Tailwind", icon: Code2 },
  { title: "Cloud & delivery", detail: "AWS · Docker · Kubernetes · Terraform", icon: CloudCog },
  { title: "Data & integration", detail: "PostgreSQL · MongoDB · Redis · RabbitMQ", icon: Database },
];

function IconBadge({ icon: Icon, tone = "blue" }: { icon: LucideIcon; tone?: string }) {
  return <span className={`icon-badge ${tone}`}><Icon size={18} strokeWidth={1.8} /></span>;
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProject]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Kaweesha Marasinghe home">
          <span className="brand-mark">KM</span>
          <span><strong>Kaweesha Marasinghe</strong><small>Software Engineer</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={menuOpen ? "is-open" : ""} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#toolkit" onClick={closeMenu}>Toolkit</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>
        <a className="header-cta" href="/Kaweesha-Marasinghe-Resume-2.pdf" download><Download size={14} /> Download CV</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-left page-width">
          <div className="eyebrow"><span className="status-dot" /> Open to meaningful work <span className="eyebrow-divider">/</span> Colombo, Sri Lanka</div>
          <h1>Software engineer building <span>reliable products.</span></h1>
          <p className="hero-intro">I work across backend systems, frontend experiences, and the infrastructure that connects them — with a focus on making complex things feel clear.</p>
          <div className="hero-actions"><a className="button button-dark" href="#work">Explore my work <ArrowRight size={16} /></a><a className="button button-quiet" href="mailto:kaweesha.mr@gmail.com">Let&apos;s talk <ArrowUpRight size={16} /></a></div>
          <div className="hero-meta"><span><CheckCircle2 size={15} /> Currently Software Engineer at Virtusa</span><span><GraduationCap size={15} /> BSc Software Engineering at SLIIT</span></div>
        </div>
        <div className="hero-right">
          <div className="hero-panel">
            <div className="panel-top"><span><span className="panel-dot blue-dot" /><span className="panel-dot violet-dot" /><span className="panel-dot orange-dot" /></span><span>kaweesha / profile.ts</span><Terminal size={15} /></div>
            <div className="panel-body"><div className="code-line muted">01 <span>const</span> engineer = &#123;</div><div className="code-line indent">02 <b>name:</b> <em>&quot;Kaweesha Marasinghe&quot;</em>,</div><div className="code-line indent">03 <b>focus:</b> <em>&quot;useful systems&quot;</em>,</div><div className="code-line indent">04 <b>mindset:</b> <em>&quot;learn, share, improve&quot;</em>,</div><div className="code-line muted">05 &#125;</div><div className="panel-divider" /><div className="code-status"><span><span className="status-dot" /> Available for good work</span><span>v.2026</span></div></div>
            <div className="panel-profile"><div className="portrait"><Image src="/images/kaweesha-avatar.png" alt="Portrait of Kaweesha Marasinghe" width={80} height={80} priority /></div><div><strong>Kaweesha<br />Marasinghe</strong><span>Software Engineer</span></div><ArrowUpRight size={18} /></div>
          </div>
          <div className="hero-corner-note"><Layers3 size={16} /><span>Backend depth<br />Frontend instinct</span></div>
        </div>
        <a className="scroll-hint page-width" href="#about"><span>Scroll to explore</span><ArrowDown size={15} /></a>
      </section>

      <section className="proof-strip"><div className="page-width proof-grid"><div><strong>3.78</strong><span>CGPA at SLIIT</span></div><div><strong>2026</strong><span>ICCTA research presentation</span></div><div><strong>01</strong><span>Best session presentation award</span></div><div><strong>∞</strong><span>Curiosity still in progress</span></div></div></section>

      <section className="about page-width section-space" id="about"><div className="section-kicker"><span>01</span><span>About me</span></div><div className="about-grid"><div><h2>Thoughtful by default.<br /><span>Technical by nature.</span></h2></div><div className="about-copy"><p className="large-copy">The best software gives people confidence.</p><p>I&apos;m a software engineer with experience across REST APIs, microservices, cloud platforms, React applications, and CI/CD automation. I enjoy the deep technical problems — but I care just as much about how the finished work feels to the people who depend on it.</p><p>That means clean code, calm interfaces, good documentation, and teams where knowledge moves freely.</p><a className="inline-link" href="mailto:kaweesha.mr@gmail.com">Get to know me <ArrowUpRight size={15} /></a></div></div><div className="about-note"><ShieldCheck size={18} /><span>My north star: make systems clearer, safer, and easier to live with.</span></div></section>

      <section className="work page-width section-space" id="work"><div className="section-head"><div><div className="section-kicker"><span>02</span><span>Selected work</span></div><h2>Built to work<br /><span>in the real world.</span></h2></div><p>Production systems, research, and the connective tissue in between.</p></div><div className="project-grid">{projects.map((project) => <article className={`project-card ${project.tone}`} key={project.number}><div className="project-top"><span className="project-number">{project.number}</span><IconBadge icon={project.icon} tone={project.tone} /></div><div className="project-label">{project.label}</div><h3>{project.title}</h3><p>{project.description}</p><div className="project-bottom"><div className="tag-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><button onClick={() => setSelectedProject(project)} aria-label={`Read more about ${project.title}`}>Read case note <ArrowUpRight size={15} /></button></div></article>)}</div></section>

      <section className="dark-section" id="toolkit"><div className="page-width section-space"><div className="section-kicker light"><span>03</span><span>Technical toolkit</span></div><div className="toolkit-head"><h2>Comfortable at<br /><span>every layer.</span></h2><p>From a clean API contract to the deployment pipeline that keeps it healthy.</p></div><div className="toolkit-grid">{toolkit.map((item) => <div className="toolkit-item" key={item.title}><IconBadge icon={item.icon} tone="dark" /><div><h3>{item.title}</h3><p>{item.detail}</p></div><ArrowUpRight size={17} /></div>)}</div><div className="tool-list"><span>Java</span><span>Spring Boot</span><span>Go</span><span>Node.js</span><span>React</span><span>Next.js</span><span>TypeScript</span><span>PostgreSQL</span><span>AWS</span><span>Docker</span><span>Kubernetes</span><span>Terraform</span><span>GitHub Actions</span><span>Keycloak</span></div></div></section>

      <section className="experience page-width section-space"><div className="section-kicker"><span>04</span><span>Experience & recognition</span></div><div className="experience-grid"><div className="timeline"><div className="timeline-item current"><span className="timeline-year">Jul 2026 — now</span><div><h3>Software Engineer</h3><p>Virtusa · SSE for WILEY project</p><small>Power Automate & RPA solutions for better business workflows.</small></div></div><div className="timeline-item"><span className="timeline-year">Dec 2025 — Jul 2026</span><div><h3>Software Engineer</h3><p>Entgra</p><small>RESTful APIs, WSO2 platform integrations, production debugging, and CI/CD automation.</small></div></div><div className="timeline-item"><span className="timeline-year">Feb 2025 — Dec 2025</span><div><h3>Software Engineer Intern</h3><p>Wiley Global Technologies</p><small>Microservices and cloud technologies across Kubernetes, RabbitMQ, AWS, and Terraform.</small></div></div><div className="timeline-item"><span className="timeline-year">Jan 2024 — Jun 2024</span><div><h3>Trainee Software Engineer</h3><p>Coduza PVT (LTD)</p><small>Next.js and Node.js platform work for the Cancer Victims Association Sri Lanka.</small></div></div></div><div className="recognition-card"><div className="recognition-icon"><Award size={25} /></div><div className="recognition-label">Recognition</div><h3>Research that made it out of the room.</h3><p>Synapse CI: Intelligent Test Prioritization & Chaos Engineering Framework</p><div className="recognition-list"><span><Award size={15} /> Best of Session Presentation · ICCTA 2026</span><span><BookOpen size={15} /> Presented in Austria</span><span><GraduationCap size={15} /> Dean&apos;s List · Seven semesters</span></div></div></div></section>

      <section className="contact page-width" id="contact"><div className="contact-card"><div className="section-kicker light"><span>05</span><span>Get in touch</span></div><h2>Let&apos;s build<br /><span>something useful.</span></h2><p>I&apos;m open to thoughtful products, ambitious technical challenges, and teams that care about how they work.</p><a className="button button-light" href="mailto:kaweesha.mr@gmail.com"><Mail size={16} /> kaweesha.mr@gmail.com <ArrowUpRight size={16} /></a><div className="contact-links"><a href="https://www.linkedin.com/in/kaweeshamr/" target="_blank" rel="noreferrer"><Network size={16} /> LinkedIn <ExternalLink size={13} /></a><a href="https://github.com/Kaweesha-mr" target="_blank" rel="noreferrer"><GitBranch size={16} /> GitHub <ExternalLink size={13} /></a><a href="tel:+94770723273"><Phone size={16} /> +94 77 072 3273</a></div></div></section>

      <footer className="footer page-width"><span>© 2026 Kaweesha Marasinghe</span><span>Software Engineer · Colombo, Sri Lanka</span><a href="#top">Back to top <ArrowUpRight size={13} /></a></footer>

      {selectedProject && <div className="modal-backdrop"><div className={`case-modal ${selectedProject.tone}`} role="dialog" aria-modal="true" aria-labelledby="case-title"><button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close case note"><X size={20} /></button><div className="project-label">{selectedProject.number} / {selectedProject.label}</div><h2 id="case-title">{selectedProject.title}</h2><p className="modal-lede">{selectedProject.description}</p><p>{selectedProject.detail}</p><div className="tag-row">{selectedProject.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></div>}
    </main>
  );
}
