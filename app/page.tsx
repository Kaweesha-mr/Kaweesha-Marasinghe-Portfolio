"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
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

function OrbitalEarth() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(27, 1, 0.1, 100);
    camera.position.set(0, 0.05, 3.35);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const earthVertex = `varying vec2 vUv; varying vec3 vNormal; varying vec3 vWorldPosition;
      void main() { vUv = uv; vNormal = normalize(normalMatrix * normal); vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * viewMatrix * worldPosition; }`;
    const earthFragment = `uniform float uTime; varying vec2 vUv; varying vec3 vNormal; varying vec3 vWorldPosition;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) { vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y); }
      float fbm(vec2 p) { float value=0.0; float amplitude=.5; for(int i=0;i<5;i++){ value+=amplitude*noise(p); p*=2.03; amplitude*=.5; } return value; }
      void main() { vec3 lightDirection=normalize(vec3(-0.45,0.65,1.0)); float light=max(dot(vNormal,lightDirection),0.0); float detail=fbm(vUv*vec2(7.0,4.0)+vec2(uTime*.004,0.0)); float terrain=fbm(vUv*vec2(9.0,5.0))+0.16*sin(vUv.x*17.0)*sin(vUv.y*9.0); float land=smoothstep(.48,.59,terrain); vec3 ocean=mix(vec3(.018,.13,.38),vec3(.045,.42,.9),detail); vec3 landColor=mix(vec3(.025,.32,.22),vec3(.25,.86,.54),detail); vec3 color=mix(ocean,landColor,land); float clouds=smoothstep(.62,.78,fbm(vUv*vec2(14.0,8.0)+vec2(uTime*.008,0.0))); color=mix(color,color+vec3(.24,.32,.48),clouds*.18); color*=mix(.7,1.18,light); float rim=pow(1.0-max(dot(vNormal,vec3(0.0,0.0,1.0)),0.0),3.2); color+=vec3(.16,.42,1.0)*rim*.9; gl_FragColor=vec4(color,1.0); }`;
    const earthMaterial = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: earthVertex, fragmentShader: earthFragment });
    const earthGroup = new THREE.Group();
    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMaterial);
    earthGroup.add(earth);

    const atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vNormal; void main() { float intensity=pow(.68-dot(vNormal,vec3(0.0,0.0,1.0)),2.4); gl_FragColor=vec4(.18,.48,1.0,intensity*.72); }`,
    });
    earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.065, 72, 72), atmosphereMaterial));
    scene.add(earthGroup, new THREE.AmbientLight(0x7d9dff, 1.5)); const keyLight = new THREE.DirectionalLight(0xd7e5ff, 2.8); keyLight.position.set(-3, 2, 4); scene.add(keyLight);

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x5687ff, transparent: true, opacity: 0.34 });
    const satelliteEntries: Array<{ group: THREE.Group; radius: number; speed: number; phase: number }> = [];
    const makeOrbit = (radius: number, flatten: number, tilt: number) => {
      const points = new THREE.EllipseCurve(0, 0, radius, radius * flatten, 0, Math.PI * 2, false, 0).getPoints(128).map((point) => new THREE.Vector3(point.x, 0, point.y));
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), orbitMaterial);
      line.rotation.set(tilt, 0.2, tilt * 0.35);
      scene.add(line);
    };
    const makeSatellite = (color: number, radius: number, speed: number, phase: number, tilt: number) => {
      const group = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(.12, .1, .1), new THREE.MeshStandardMaterial({ color: 0xd7e5ff, emissive: color, emissiveIntensity: .4, metalness: .75, roughness: .3 }));
      const panelMaterial = new THREE.MeshBasicMaterial({ color });
      const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(.19, .012, .105), panelMaterial);
      const rightPanel = leftPanel.clone();
      leftPanel.position.x = -.17; rightPanel.position.x = .17;
      group.add(body, leftPanel, rightPanel);
      group.rotation.z = tilt;
      scene.add(group);
      satelliteEntries.push({ group, radius, speed, phase });
    };
    makeOrbit(1.3, .48, -.25); makeOrbit(1.5, .58, .4); makeOrbit(1.68, .72, .72);
    makeSatellite(0x6f9aff, 1.3, .34, .4, -.2); makeSatellite(0x5cc3c5, 1.5, -.23, 2.5, .3); makeSatellite(0x9b7cff, 1.68, .16, 4.4, .5);

    const starPositions = new Float32Array(240 * 3);
    for (let index = 0; index < 240; index += 1) { const radius = 2.6 + Math.random() * 2.4; const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta); starPositions[index * 3 + 1] = radius * Math.cos(phi); starPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta); }
    const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(starPositions, 3)), new THREE.PointsMaterial({ color: 0x8eafff, size: .018, transparent: true, opacity: .72, sizeAttenuation: true }));
    scene.add(stars);

    const resize = () => { const width = mount.clientWidth || 320; const height = mount.clientHeight || 320; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); };
    const observer = new ResizeObserver(resize); observer.observe(mount); resize();
    let pointerX = 0; let pointerY = 0;
    const onPointerMove = (event: PointerEvent) => { const bounds = mount.getBoundingClientRect(); pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * .22; pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * .16; };
    mount.addEventListener("pointermove", onPointerMove);
    const clock = new THREE.Clock(); let frame = 0;
    const animate = () => { const elapsed = clock.getElapsedTime(); earthMaterial.uniforms.uTime.value = elapsed; earth.rotation.y = elapsed * .045; earthGroup.rotation.x += (pointerY - earthGroup.rotation.x) * .025; earthGroup.rotation.y += (pointerX - earthGroup.rotation.y) * .025; stars.rotation.y = elapsed * .006; satelliteEntries.forEach(({ group, radius, speed, phase }) => { const angle = elapsed * speed + phase; group.position.set(Math.cos(angle) * radius, Math.sin(angle * .72) * radius * .22, Math.sin(angle) * radius * .62); group.lookAt(0, 0, 0); }); renderer.render(scene, camera); frame = requestAnimationFrame(animate); };
    animate();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); mount.removeEventListener("pointermove", onPointerMove); renderer.dispose(); earthMaterial.dispose(); atmosphereMaterial.dispose(); mount.removeChild(renderer.domElement); };
  }, []);

  return <div className="orbital-earth-canvas" ref={mountRef} aria-hidden="true" />;
}

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
  { dates: "Jul 2026 — Present", role: "Software Engineer", company: "Virtusa · SSE for WILEY Project", brand: "VIRTUSA", mark: "V", tone: "blue", description: "Automation engineering for business workflows where reliability, repeatability, and measurable efficiency matter.", highlights: ["Building Power Automate and RPA solutions for Wiley workflows", "Improving operational efficiency through practical automation"], stack: ["Power Automate", "RPA", "Wiley"], current: true },
  { dates: "Dec 2025 — Jul 2026", role: "Software Engineer", company: "Entgra", brand: "ENTGRA", mark: "e", tone: "cyan", description: "Backend and platform engineering across REST APIs, WSO2 integrations, production debugging, and delivery automation.", highlights: ["Developed RESTful APIs and WSO2 platform integrations", "Debugged production issues and optimised system performance", "Worked with Jira, GitHub, and GitHub Actions"], stack: ["Java", "WSO2", "GitHub Actions" ] },
  { dates: "Feb 2025 — Dec 2025", role: "Software Engineer Intern", company: "Wiley Global Technologies", brand: "WILEY", mark: "W", tone: "violet", description: "Worked across microservices and cloud infrastructure for an observability platform serving multiple tenants.", highlights: ["Built product-health experiences around Dynatrace, JSM, and Zabbix signals", "Worked with Kubernetes, RabbitMQ, AWS, and Terraform", "Improved performance through profiling and production-minded debugging"], stack: ["React", "AWS", "Kubernetes" ] },
  { dates: "Jan 2024 — Jun 2024", role: "Trainee Software Engineer", company: "Coduza PVT (LTD)", brand: "CODUZA", mark: "C", tone: "orange", description: "Started my professional journey by building a community-focused platform with a real human purpose.", highlights: ["Developed Next.js and Node.js platform features", "Contributed to the Cancer Victims Association Sri Lanka platform", "Learned to take product work from requirements to delivery"], stack: ["Next.js", "Node.js", "PostgreSQL" ] },
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
          <div className="hero-storyfield mission-field" role="img" aria-label="An animated 3D Earth with orbiting satellites representing Kaweesha's engineering work"><div className="mission-particles"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="mission-heading"><span>MISSION MAP / 001</span><b>COLOMBO ORIGIN</b></div><div className="mission-orbit orbit-production" /><div className="mission-orbit orbit-research" /><div className="mission-orbit orbit-community" /><div className="mission-satellite satellite-production"><span className="sat-panel left" /><span className="satellite-body"><i /></span><span className="sat-panel right" /></div><div className="mission-satellite satellite-research"><span className="sat-panel left" /><span className="satellite-body"><i /></span><span className="sat-panel right" /></div><div className="mission-satellite satellite-community"><span className="sat-panel left" /><span className="satellite-body"><i /></span><span className="sat-panel right" /></div><div className="earth"><OrbitalEarth /><span className="earth-label">ORIGIN / COLOMBO, LK</span></div><div className="mission-label label-production"><i /> <span>01 / BUILD</span><b>PRODUCTION SYSTEMS</b></div><div className="mission-label label-research"><i /> <span>02 / RESEARCH</span><b>SYNAPSE CI · ICCTA 2026</b></div><div className="mission-label label-community"><i /> <span>03 / SHARE</span><b>COMMUNITY & KNOWLEDGE</b></div><div className="mission-caption">ONE ORIGIN / MANY ORBITS / ALWAYS MOVING FORWARD</div></div>
        </div>
        <div className="hero-night-footer page-width"><span>© 2026 / BUILD 01</span><a href="#about"><span className="footer-arrow">↓</span> SCROLL TO EXPLORE</a><span>MADE WITH INTENT</span></div>
      </section>

      <section className="metrics-strip metrics-dark"><div className="page-width metrics-grid"><div><span className="metric-index">01 / CAREER</span><strong>2+</strong><span className="metric-label">years in software engineering</span><i className="metric-pulse" /></div><div><span className="metric-index">02 / ACADEMIC</span><strong>3.78</strong><span className="metric-label">CGPA · SLIIT</span><i className="metric-pulse" /></div><div><span className="metric-index">03 / RESEARCH</span><strong>01</strong><span className="metric-label">conference presentation award</span><i className="metric-pulse" /></div><div><span className="metric-index">04 / RECOGNITION</span><strong>07</strong><span className="metric-label">semesters on the Dean&apos;s List</span><i className="metric-pulse" /></div></div></section>

      <section className="about about-dark section-space" id="about"><div className="page-width"><div className="section-kicker"><span>01</span><span>About me / the person behind the systems</span></div><div className="about-grid"><div className="about-portrait"><Image src="/images/kaweesha-profile.png" alt="Professional portrait of Kaweesha Marasinghe" width={560} height={700} /><div className="portrait-label"><span>KAWEESHA MARASINGHE</span><span>SOFTWARE ENGINEER</span></div><span className="portrait-index">PROFILE / 001</span></div><div className="about-copy"><p className="about-eyebrow">A SOFTWARE ENGINEER WITH A HUMAN CENTER</p><h2>Kaweesha<br /><span>Marasinghe.</span></h2><p className="large-copy">I build dependable software—and I care about the people who depend on it.</p><p>I&apos;m a software engineer working across backend systems, frontend experiences, cloud platforms, and CI/CD automation. I like the hard technical problems: understanding how systems behave, finding the fragile edges, and making the whole thing clearer and safer.</p><p>My work is shaped by curiosity, discipline, and empathy. I want the software I build to be reliable in production, understandable to the next engineer, and genuinely useful to the people it serves.</p><div className="about-principles"><div><span>01</span><strong>Clarity</strong><small>Make complexity easier to navigate.</small></div><div><span>02</span><strong>Curiosity</strong><small>Keep learning beyond the ticket.</small></div><div><span>03</span><strong>Care</strong><small>Build for people, not just systems.</small></div></div><a className="inline-link" href="mailto:kaweesha.mr@gmail.com">Start a conversation <ArrowUpRight size={14} /></a></div></div></div></section>

      <section className="experience experience-dark section-space" id="experience"><div className="page-width"><div className="section-head"><div><div className="section-kicker"><span>02</span><span>Professional experience / career pipeline</span></div><h2>From commit<br /><span>to impact.</span></h2></div><p>A GitHub-inspired career pipeline: each role is a stage where I shipped, learned, and moved systems forward.</p></div><div className="pipeline-shell"><div className="pipeline-toolbar"><div className="pipeline-repo"><GitBranch size={14} /><span>kaweesha / engineering-career</span><b>public</b></div><div className="pipeline-status"><i /> workflow / career-progress <strong>success</strong></div></div><div className="pipeline-flow">{roles.map((role, index) => <article className={`pipeline-stage ${role.current ? "current" : ""}`} key={`${role.company}-${role.dates}`}><div className="pipeline-job"><div className="pipeline-job-top"><span className="pipeline-step">{String(index + 1).padStart(2, "0")} / job</span><span className="pipeline-state"><i /> {role.current ? "in progress" : "completed"}</span></div><div className="pipeline-company"><span className={`company-logo ${role.tone}`}>{role.mark}</span><div><strong>{role.brand}</strong><small>{role.company}</small></div></div><span className="pipeline-date">{role.dates}</span></div><div className="pipeline-link"><span /><i /></div><div className="pipeline-work"><div className="pipeline-work-head"><div><span className="pipeline-label">deliverables</span><h3>{role.role}</h3></div><span className="pipeline-branch"><GitBranch size={11} /> {role.current ? "main" : "merged"}</span></div><p>{role.description}</p><ul>{role.highlights.map((highlight) => <li key={highlight}><CheckCircle2 size={13} /> <span>{highlight}</span></li>)}</ul><div className="experience-tags">{role.stack.map((item) => <span key={item}>{item}</span>)}</div></div></article>)}</div><div className="pipeline-footer"><span><i /> all stages passing</span><span>build / ship / learn / repeat</span><span>HEAD → impact</span></div></div></div></section>

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
