"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Layers3,
  Mail,
  Menu,
  Network,
  Phone,
  Presentation,
  Server,
  Sparkles,
  Users,
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
};

type GithubProfile = {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  html_url: string;
};

type GithubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

const projects: Project[] = [
  {
    number: "01",
    title: "Switchgear / ADMS",
    label: "ENTGRA · INDUSTRIAL SYSTEMS",
    description: "Real-time monitoring and remote control for electrical switchgear using IEC 60870-5-104.",
    detail: "Contributed to a scalable Advanced Distribution Management System for critical infrastructure. Implemented TOTP authentication for the Double Command execution flow, advanced device search, AWS monitoring, and zero-downtime deployment strategies.",
    icon: Network,
    tone: "blue",
    technologies: ["Java", "Spring Boot", "React", "AWS"],
  },
  {
    number: "02",
    title: "NEXA Platform",
    label: "WILEY · OBSERVABILITY",
    description: "A product-health platform aggregating Dynatrace, JSM, and Zabbix signals across multiple tenants.",
    detail: "Developed a unified Problem Dashboard, integrated Keycloak and Azure AD for secure SSO, refactored performance-heavy paths, and used VisualVM to identify memory leaks and tune JVM behavior in local and Dockerized environments.",
    icon: Layers3,
    tone: "violet",
    technologies: ["React", "TypeScript", "Java", "Keycloak"],
  },
  {
    number: "03",
    title: "Cancer Victims Association Platform",
    label: "CODUZA · COMMUNITY PLATFORM",
    description: "A digital platform built to support the Cancer Victims Association Sri Lanka.",
    detail: "Contributed to a platform using Next.js and Node.js, building practical product features for an organisation doing meaningful community work.",
    icon: Users,
    tone: "orange",
    technologies: ["Next.js", "Node.js", "PostgreSQL"],
  },
];

const roles = [
  { dates: "Jul 2026 — Present", role: "Software Engineer", company: "Virtusa · SSE for WILEY Project", description: "Power Automate and RPA solutions that streamline business workflows and improve operational efficiency.", current: true },
  { dates: "Dec 2025 — Jul 2026", role: "Software Engineer", company: "Entgra", description: "RESTful APIs, WSO2 platform integrations, production debugging, performance optimisation, Jira, GitHub, and GitHub Actions." },
  { dates: "Feb 2025 — Dec 2025", role: "Software Engineer Intern", company: "Wiley Global Technologies", description: "Microservices and cloud technologies across Kubernetes, RabbitMQ, AWS S3, AWS RDS, AWS EC2, and Terraform." },
  { dates: "Jan 2024 — Jun 2024", role: "Trainee Software Engineer", company: "Coduza PVT (LTD)", description: "Next.js and Node.js platform development for the Cancer Victims Association Sri Lanka." },
];

const toolkit = [
  { title: "Backend", detail: "Java · Spring Boot · Go · Node.js", icon: Server },
  { title: "Frontend", detail: "React · Next.js · TypeScript · Tailwind", icon: Code2 },
  { title: "Cloud & DevOps", detail: "AWS · Docker · Kubernetes · Terraform", icon: Layers3 },
  { title: "Data & Integration", detail: "PostgreSQL · MongoDB · Redis · RabbitMQ", icon: Network },
];

function IconBadge({ icon: Icon, tone = "blue" }: { icon: LucideIcon; tone?: string }) {
  return <span className={`icon-badge ${tone}`}><Icon size={17} strokeWidth={1.7} /></span>;
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [githubProfile, setGithubProfile] = useState<GithubProfile | null>(null);
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("https://api.github.com/users/Kaweesha-mr")
      .then((response) => response.ok ? response.json() : null)
      .then((data: GithubProfile | null) => { if (data) setGithubProfile(data); })
      .catch(() => undefined);
    fetch("https://api.github.com/users/Kaweesha-mr/repos?sort=updated&per_page=4")
      .then((response) => response.ok ? response.json() : [])
      .then((data: GithubRepo[]) => setGithubRepos(data.filter((repo) => !repo.fork).slice(0, 4)))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProject]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" onClick={closeMenu} aria-label="Kaweesha Marasinghe home"><span className="brand-mark"><span /></span><span className="brand-word">KAWEESHA</span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <nav className={menuOpen ? "is-open" : ""} aria-label="Main navigation"><a href="#about" onClick={closeMenu}>About</a><a href="#experience" onClick={closeMenu}>Career</a><a href="#research" onClick={closeMenu}>Research</a><a href="#github" onClick={closeMenu}>GitHub Live</a><a href="#contact" onClick={closeMenu}>Contact</a></nav>
        <a className="header-cta" href="/Kaweesha-Marasinghe-Resume-2.pdf" download><Download size={14} /> CV</a>
      </header>

      <section className="hero hero-night" id="top">
        <div className="hero-night-gridlines" aria-hidden="true" />
        <div className="hero-topline page-width"><span><i className="hero-live-dot" /> KAWEESHA MR / 001</span><span>SOFTWARE ENGINEER · COLOMBO, LK</span></div>
        <div className="page-width hero-night-grid">
          <div className="hero-night-copy">
            <p className="hero-kicker">ENGINEERING / SYSTEMS / PEOPLE</p>
            <h1><span>Kaweesha</span><span>Marasinghe</span></h1>
            <div className="hero-role"><span>01</span><h2>Software Engineer</h2></div>
            <p className="hero-subtitle">Java · Spring Boot · React · Cloud · Full-Stack</p>
            <p className="hero-description">I build dependable software for complex systems — with the curiosity to go deep and the care to make it useful.</p>
            <div className="hero-actions"><a className="button button-dark" href="#experience">Explore my work <ArrowRight size={15} /></a><a className="button button-quiet" href="mailto:kaweesha.mr@gmail.com">Start a conversation <ArrowUpRight size={15} /></a></div>
            <div className="hero-command"><GitBranch size={13} /><span>currently building</span><b>systems people can rely on</b></div>
          </div>
          <div className="hero-storyfield spacefield" role="img" aria-label="An animated orbital scene with a launch vehicle, satellite, and Yashodha as a constant support signal"><div className="space-scanline" /><div className="space-orbit orbit-a" /><div className="space-orbit orbit-b" /><div className="space-orbit orbit-c" /><div className="rocket-path" /><div className="rocket"><div className="rocket-window" /><div className="rocket-fin fin-left" /><div className="rocket-fin fin-right" /><div className="rocket-flame" /></div><div className="satellite"><div className="sat-panel panel-left" /><div className="sat-body"><i /></div><div className="sat-panel panel-right" /><div className="sat-antenna" /></div><div className="space-signal signal-y"><i /><span>YASHODHA</span><b>CONSTANT SIGNAL</b></div><div className="space-signal signal-mission"><span>MISSION 001</span><b>BUILD BEYOND THE HORIZON</b></div><div className="space-signal signal-orbit"><i /> ORBITAL LINK ONLINE</div><div className="space-caption">LAUNCH / ORBIT / RETURN WITH KNOWLEDGE</div></div>
        </div>
        <div className="hero-night-footer page-width"><span>© 2026 / BUILD 01</span><a href="#about"><span className="footer-arrow">↓</span> SCROLL TO EXPLORE</a><span>MADE WITH INTENT</span></div>
      </section>

      <section className="metrics-strip"><div className="page-width metrics-grid"><div><strong>2+</strong><span>years in software engineering</span></div><div><strong>3.78</strong><span>CGPA · SLIIT</span></div><div><strong>01</strong><span>conference presentation award</span></div><div><strong>07</strong><span>semesters on the Dean&apos;s List</span></div></div></section>

      <section className="about page-width section-space" id="about"><div className="section-kicker"><span>01</span><span>About me</span></div><div className="about-grid"><div className="about-portrait"><Image src="/images/kaweesha-profile.png" alt="Professional portrait of Kaweesha Marasinghe" width={560} height={700} /><div className="portrait-label"><span>KAWEESHA MARASINGHE</span><span>SOFTWARE ENGINEER</span></div></div><div className="about-copy"><h2>Engineering with<br /><span>consideration.</span></h2><p className="large-copy">I build software that people can trust.</p><p>I&apos;m a software engineer working across backend systems, frontend experiences, cloud platforms, and CI/CD automation. I enjoy the deep technical problems — but I care just as much about how the finished work feels to the people who depend on it.</p><p>My approach is simple: make systems clearer, safer, and easier to live with. Good code matters. So do good communication, documentation, and teams where knowledge moves freely.</p><a className="inline-link" href="mailto:kaweesha.mr@gmail.com">Start a conversation <ArrowUpRight size={14} /></a></div></div></section>

      <section className="experience page-width section-space" id="experience"><div className="section-head"><div><div className="section-kicker"><span>02</span><span>Professional experience</span></div><h2>A clear path<br /><span>through engineering.</span></h2></div><p>Roles, responsibilities, and the systems I helped move forward.</p></div><div className="experience-list">{roles.map((role) => <article className={`experience-row ${role.current ? "current" : ""}`} key={`${role.company}-${role.dates}`}><div className="experience-date">{role.dates}</div><div className="experience-role"><h3>{role.role}</h3><p>{role.company}</p><span>{role.description}</span></div><CheckCircle2 size={17} /></article>)}</div></section>

      <section className="work page-width section-space" id="work"><div className="section-head"><div><div className="section-kicker"><span>03</span><span>Projects</span></div><h2>Production work<br /><span>with a purpose.</span></h2></div><p>Industrial systems, observability, and community platforms.</p></div><div className="project-grid">{projects.map((project) => <article className={`project-card ${project.tone}`} key={project.number}><div className="project-top"><span className="project-number">{project.number}</span><IconBadge icon={project.icon} tone={project.tone} /></div><div className="project-label">{project.label}</div><h3>{project.title}</h3><p>{project.description}</p><div className="project-bottom"><div className="tag-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><button onClick={() => setSelectedProject(project)} aria-label={`Read more about ${project.title}`}>Read case note <ArrowUpRight size={14} /></button></div></article>)}</div></section>

      <section className="research section-space" id="research"><div className="page-width research-grid"><div><div className="section-kicker"><span>04</span><span>Research</span></div><h2>Synapse CI</h2><p className="research-title">Intelligent Test Prioritization & Chaos Engineering Framework</p><p>Presented at the 12th International Conference on Computer Technology Applications, FH JOANNEUM, Vienna, Austria · 2026.</p><div className="research-links"><a href="https://www.linkedin.com/in/kaweeshamr/" target="_blank" rel="noreferrer"><Presentation size={15} /> Presentation details <ExternalLink size={13} /></a><a href="mailto:kaweesha.mr@gmail.com"><BookOpen size={15} /> Ask about the paper <ArrowUpRight size={13} /></a></div></div><div className="research-proof"><div className="proof-mark"><Award size={25} /></div><strong>BEST OF SESSION<br />PRESENTATION</strong><span>ICCTA 2026 · AUSTRIA</span></div></div></section>

      <section className="github section-space" id="github"><div className="page-width"><div className="section-head"><div><div className="section-kicker"><span>05</span><span>GitHub Live</span></div><h2>Open work,<br /><span>visible progress.</span></h2></div><a className="inline-link" href="https://github.com/Kaweesha-mr" target="_blank" rel="noreferrer"><GitBranch size={15} /> View profile <ExternalLink size={13} /></a></div><div className="github-grid"><div className="github-stat-card"><GitBranch size={24} /><div className="github-handle">@Kaweesha-mr</div><div className="github-numbers"><div><strong>{githubProfile?.public_repos ?? "—"}</strong><span>repositories</span></div><div><strong>{githubProfile?.followers ?? "—"}</strong><span>followers</span></div><div><strong>{githubProfile?.following ?? "—"}</strong><span>following</span></div></div><div className="github-live"><span className="status-dot" /> Live from GitHub API</div></div><div className="repo-list">{githubRepos.length ? githubRepos.map((repo) => <a className="repo-row" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}><div><strong>{repo.name}</strong><span>{repo.description || "Open-source software project"}</span></div><div className="repo-meta"><span>{repo.language || "Code"}</span><span><Award size={12} /> {repo.stargazers_count}</span><ArrowUpRight size={15} /></div></a>) : <div className="repo-row empty"><div><strong>Public projects loading</strong><span>Visit GitHub to explore Kaweesha&apos;s repositories and recent work.</span></div><ArrowUpRight size={15} /></div>}</div></div></div></section>

      <section className="toolkit section-space" id="toolkit"><div className="page-width"><div className="section-kicker light"><span>06</span><span>Technical toolkit</span></div><div className="toolkit-head"><h2>Tools I use<br /><span>to make things work.</span></h2><p>A practical stack across application code, infrastructure, data, and delivery.</p></div><div className="toolkit-grid">{toolkit.map((item) => <div className="toolkit-item" key={item.title}><IconBadge icon={item.icon} tone="dark" /><h3>{item.title}</h3><p>{item.detail}</p></div>)}</div></div></section>

      <section className="community page-width section-space"><div className="section-head"><div><div className="section-kicker"><span>07</span><span>Community & achievements</span></div><h2>More than<br /><span>the job title.</span></h2></div><p>Learning, sharing, and showing up for the work around the work.</p></div><div className="community-grid"><article><IconBadge icon={Users} tone="blue" /><h3>Knowledge sharing</h3><p>Knowledge-sharing resource person at the SLIIT Faculty of Computing Student Community, with a focus on helping peers learn and grow.</p></article><article><IconBadge icon={GraduationCap} tone="violet" /><h3>Academic excellence</h3><p>SLIIT Scholarship Award for Exceptional Academic Performance and Dean&apos;s List recognition across seven semesters.</p></article><article><IconBadge icon={Sparkles} tone="orange" /><h3>Campus contributions</h3><p>Top 10 finalist at the SLIIT Mini Hackathon and active participation in research presentations and technical sessions.</p></article></div></section>

      <section className="contact page-width" id="contact"><div className="contact-card"><div className="section-kicker light"><span>08</span><span>Contact</span></div><h2>Good work starts<br /><span>with a conversation.</span></h2><p>For thoughtful products, ambitious technical challenges, or a conversation about software engineering and research.</p><a className="button button-light" href="mailto:kaweesha.mr@gmail.com"><Mail size={15} /> kaweesha.mr@gmail.com <ArrowUpRight size={15} /></a><div className="contact-links"><a href="https://www.linkedin.com/in/kaweeshamr/" target="_blank" rel="noreferrer"><Network size={15} /> LinkedIn <ExternalLink size={12} /></a><a href="https://github.com/Kaweesha-mr" target="_blank" rel="noreferrer"><GitBranch size={15} /> GitHub <ExternalLink size={12} /></a><a href="tel:+94770723273"><Phone size={15} /> +94 77 072 3273</a></div></div></section>

      <footer className="footer page-width"><span>© 2026 Kaweesha Marasinghe</span><span>Software Engineer · Colombo, Sri Lanka</span><a href="#top">Back to top <ArrowUpRight size={12} /></a></footer>

      {selectedProject && <div className="modal-backdrop"><div className={`case-modal ${selectedProject.tone}`} role="dialog" aria-modal="true" aria-labelledby="case-title"><button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close case note"><X size={19} /></button><div className="project-label">{selectedProject.number} / {selectedProject.label}</div><h2 id="case-title">{selectedProject.title}</h2><p className="modal-lede">{selectedProject.description}</p><p>{selectedProject.detail}</p><div className="tag-row">{selectedProject.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></div>}
    </main>
  );
}
