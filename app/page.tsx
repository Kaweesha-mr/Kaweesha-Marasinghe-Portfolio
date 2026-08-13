"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  FileText,
  GitBranch,
  Layers3,
  Mail,
  Menu,
  Network,
  Phone,
  Presentation,
  Server,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Project = {
  number: string;
  title: string;
  label: string;
  period: string;
  role: string;
  description: string;
  detail: string;
  contributions: string[];
  outcome: string;
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
    period: "2025 — 2026",
    role: "Backend · security · delivery",
    description: "Real-time monitoring and remote control for electrical switchgear using IEC 60870-5-104.",
    detail: "Contributed to a scalable Advanced Distribution Management System for critical infrastructure, supporting remote switchgear operations through the IEC 60870-5-104 protocol.",
    contributions: ["Secured the critical Double Command flow with TOTP authentication for Select and Execute operations", "Built advanced search for ADMS device nodes to speed up navigation and issue resolution", "Supported AWS monitoring and proposed automated zero-downtime deployment strategies"],
    outcome: "Safer remote operations, faster device discovery, and a clearer path from manual releases to resilient delivery.",
    icon: Network,
    tone: "blue",
    technologies: ["Java", "Spring Boot", "React", "AWS"],
  },
  {
    number: "02",
    title: "NEXA Platform",
    label: "WILEY · OBSERVABILITY",
    period: "2025",
    role: "Full-stack · cloud · performance",
    description: "A product-health platform aggregating Dynatrace, JSM, and Zabbix signals across multiple tenants.",
    detail: "Worked on an in-house observability suite that gives teams a unified view of application health, incident trends, and synthetic monitor status across multiple tenants.",
    contributions: ["Developed the unified Problem Dashboard across Dynatrace and Zabbix incidents", "Integrated Keycloak with Azure AD to enable secure single sign-on", "Used VisualVM to identify memory leaks, tune heap allocations, and analyse JVM threads"],
    outcome: "A clearer operational view for service teams, with faster incident awareness and a more dependable platform experience.",
    icon: Layers3,
    tone: "violet",
    technologies: ["React", "TypeScript", "Java", "Keycloak"],
  },
  {
    number: "03",
    title: "Cancer Victims Association Platform",
    label: "CODUZA · COMMUNITY PLATFORM",
    period: "2024",
    role: "Full-stack development",
    description: "A digital platform built to support the Cancer Victims Association Sri Lanka.",
    detail: "Contributed to a community-focused platform during my first professional role, using Next.js and Node.js to help turn an organisation's needs into a usable digital experience.",
    contributions: ["Developed product features with Next.js and Node.js", "Translated requirements into practical, user-facing platform flows", "Worked on software with a direct human and community purpose"],
    outcome: "An early project that connected engineering fundamentals with software intended to support people beyond the screen.",
    icon: Users,
    tone: "orange",
    technologies: ["Next.js", "Node.js", "PostgreSQL"],
  },
];

const roles = [
  { dates: "Jul 2026 — Present", role: "Software Engineer", company: "Virtusa · SSE for WILEY Project", brand: "VIRTUSA", mark: "V", tone: "blue", logo: "/images/virtusa-logo.jpeg", description: "Automation engineering for business workflows where reliability, repeatability, and measurable efficiency matter.", highlights: ["Building Power Automate and RPA solutions for Wiley workflows", "Improving operational efficiency through practical automation"], stack: ["Power Automate", "RPA", "Wiley"], current: true },
  { dates: "Dec 2025 — Jul 2026", role: "Software Engineer", company: "Entgra", brand: "ENTGRA", mark: "e", tone: "cyan", logo: "/images/entgra-logo.jpeg", description: "Backend and platform engineering across REST APIs, WSO2 integrations, production debugging, and delivery automation.", highlights: ["Developed RESTful APIs and WSO2 platform integrations", "Debugged production issues and optimised system performance", "Worked with Jira, GitHub, and GitHub Actions"], stack: ["Java", "WSO2", "GitHub Actions" ] },
  { dates: "Feb 2025 — Dec 2025", role: "Software Engineer Intern", company: "Wiley Global Technologies", brand: "WILEY", mark: "W", tone: "violet", logo: "/images/wiley-logo.png", logoClass: "wide", description: "Worked across microservices and cloud infrastructure for an observability platform serving multiple tenants.", highlights: ["Built product-health experiences around Dynatrace, JSM, and Zabbix signals", "Worked with Kubernetes, RabbitMQ, AWS, and Terraform", "Improved performance through profiling and production-minded debugging"], stack: ["React", "AWS", "Kubernetes" ] },
  { dates: "Jan 2024 — Jun 2024", role: "Trainee Software Engineer", company: "Coduza PVT (LTD)", brand: "CODUZA", mark: "C", tone: "orange", logo: "/images/coduza-logo.jpeg", description: "Started my professional journey by building a community-focused platform with a real human purpose.", highlights: ["Developed Next.js and Node.js platform features", "Contributed to the Cancer Victims Association Sri Lanka platform", "Learned to take product work from requirements to delivery"], stack: ["Next.js", "Node.js", "PostgreSQL" ] },
];

const researchSteps = [
  { number: "01", label: "UNDERSTAND", title: "Read the change", detail: "AST extraction, dependency graphs, and historical failures create semantic context." },
  { number: "02", label: "PRIORITISE", title: "Select the right tests", detail: "Qwen 2.5 Coder and FAISS rank the tests most likely to be affected by a pull request." },
  { number: "03", label: "STRESS", title: "Design the chaos", detail: "The same service context guides targeted LitmusChaos experiments after deployment." },
  { number: "04", label: "LEARN", title: "Feed the loop", detail: "Failure observations return to the memory layer and improve the next test-prioritisation cycle." },
];

const campusMoments = [
  { src: "/campus/deans-list-award-2026.png", alt: "Kaweesha receiving a Dean's List award in 2026", label: "RECOGNITION", title: "Dean's List Awards", detail: "Academic excellence, celebrated with the people who make the journey meaningful.", size: "large" },
  { src: "/campus/itp-guide-promo.png", alt: "ITP Guide 9.0 promotional poster featuring Kaweesha", label: "KNOWLEDGE SHARING", title: "ITP Guide 9.0", detail: "A student community session built around UI/UX, ITP foundations, and AI use cases.", size: "tall" },
  { src: "/campus/itp-guide-session.png", alt: "Kaweesha helping students during an ITP Guide session", label: "MENTORING", title: "Learning in the room", detail: "Helping peers move from questions to practical understanding.", size: "wide" },
  { src: "/campus/deans-list-award-certificate.png", alt: "Kaweesha receiving an academic certificate", label: "ACADEMIC JOURNEY", title: "The work behind the award", detail: "A reminder that consistent effort compounds over every semester.", size: "portrait" },
  { src: "/campus/deans-list-award-2024.png", alt: "Kaweesha with peers holding academic certificates", label: "COMMUNITY", title: "Growing together", detail: "Celebrating milestones alongside the people who shared the same late nights.", size: "wide" },
  { src: "/campus/deans-list-award-stage-2024.png", alt: "Kaweesha receiving a Dean's List certificate on stage", label: "DEAN'S LIST", title: "A moment of gratitude", detail: "Recognition is meaningful when it reflects discipline, support, and persistence.", size: "portrait" },
  { src: "/campus/deans-list-group-2024.png", alt: "Dean's List award ceremony group photograph", label: "SLIIT / 2024", title: "Shared achievement", detail: "A campus milestone remembered as a collective celebration.", size: "large" },
  { src: "/campus/deans-list-friends.png", alt: "Kaweesha with friends after receiving academic certificates", label: "THE PEOPLE AROUND ME", title: "Better together", detail: "The campus story is also a story about friendship, encouragement, and showing up.", size: "wide" },
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
  const [activeCampusIndex, setActiveCampusIndex] = useState(4);

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
  const activeCampusMoment = campusMoments[activeCampusIndex];
  const showCampusMoment = (index: number) => {
    setActiveCampusIndex(index);
  };
  const showPreviousCampusMoment = () => showCampusMoment((activeCampusIndex - 1 + campusMoments.length) % campusMoments.length);
  const showNextCampusMoment = () => showCampusMoment((activeCampusIndex + 1) % campusMoments.length);

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

      <section className="experience experience-dark section-space" id="experience"><div className="page-width"><div className="section-head"><div><div className="section-kicker"><span>02</span><span>Professional experience / career path</span></div><h2>Where I&apos;ve<br /><span>built and grown.</span></h2></div><p>A simple view of the teams, systems, and real-world problems that have shaped my engineering journey.</p></div><div className="career-list">{roles.map((role, index) => <article className={`career-row ${role.current ? "current" : ""}`} key={`${role.company}-${role.dates}`}><div className="career-marker"><span>{String(index + 1).padStart(2, "0")}</span><i /></div><div className="career-main"><div className="career-top"><div className="career-company"><span className={`company-logo ${role.tone} ${role.logoClass ?? ""}`}><Image src={role.logo} alt={`${role.brand} logo`} width={64} height={40} className="company-logo-image" /></span><div><strong>{role.brand}</strong><small>{role.company}</small></div></div><span className="career-date">{role.dates}</span></div><div className="career-body"><div><span className="career-label">{role.current ? "current role" : "experience"}</span><h3>{role.role}</h3><p>{role.description}</p></div><div className="career-details"><ul>{role.highlights.map((highlight) => <li key={highlight}><CheckCircle2 size={13} /> <span>{highlight}</span></li>)}</ul><div className="experience-tags">{role.stack.map((item) => <span key={item}>{item}</span>)}</div></div></div></div></article>)}</div></div></section>

      <section className="work work-dark section-space" id="work"><div className="page-width"><div className="section-head"><div><div className="section-kicker"><span>03</span><span>Selected work / project dossiers</span></div><h2>Systems I&apos;ve<br /><span>helped move forward.</span></h2></div><p>Professional projects grounded in security, observability, reliable delivery, and meaningful product work.</p></div><div className="project-dossiers">{projects.map((project) => <article className={`project-dossier ${project.tone}`} key={project.number}><div className="project-dossier-index"><span>{project.number}</span><IconBadge icon={project.icon} tone={project.tone} /></div><div className="project-dossier-main"><div className="project-dossier-meta"><span>{project.label}</span><span>{project.period}</span></div><div className="project-dossier-heading"><div><h3>{project.title}</h3><span>{project.role}</span></div><button onClick={() => setSelectedProject(project)} aria-label={`Read detailed case note about ${project.title}`}><ArrowUpRight size={17} /></button></div><p className="project-dossier-summary">{project.description}</p><div className="project-dossier-grid"><div><span className="dossier-label">What I worked on</span><ul>{project.contributions.map((contribution) => <li key={contribution}><CheckCircle2 size={13} /> <span>{contribution}</span></li>)}</ul></div><div className="project-dossier-side"><span className="dossier-label">Outcome</span><p>{project.outcome}</p><span className="dossier-label">Stack</span><div className="tag-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></div></div></article>)}</div></div></section>

      <section className="research research-dark section-space" id="research"><div className="page-width"><div className="section-head"><div><div className="section-kicker"><span>04</span><span>Research / Synapse CI</span></div><h2>A CI/CD loop<br /><span>that learns.</span></h2></div><p>Research that connects semantic test selection with post-deployment resilience, turning delivery feedback into better decisions.</p></div><div className="research-hero-grid"><div className="research-identity"><div className="research-paper-meta"><span>ICCTA 2026 / AC3113</span><span>17-19 JUN / VIENNA, AUSTRIA</span></div><h3>Synapse CI: A Closed-Loop DevOps Framework for Intelligent Test Prioritization and Context-Aware Chaos Engineering using Qwen 2.5 Coder</h3><p className="research-abstract">A semantic QA Agent combines AST extraction, a Neo4j dependency graph, Qwen2.5-Coder reasoning, and FAISS-based historical failure retrieval to select tests and design resilience experiments from the same change context.</p><div className="research-authors"><span>AUTHORS</span><strong>M.M.K.S. Marasinghe · D.C.Y. Fernando · G.S.R.U.R. Senarathne · T.L.P. Bambarendage</strong><small>Sri Lanka Institute of Information Technology · Department of Software Engineering</small></div><div className="research-links"><a href="/research/synapse-ci-best-session.pdf" target="_blank" rel="noreferrer"><FileText size={15} /> Best session certificate <ExternalLink size={13} /></a><a href="/research/synapse-ci-presentation.pdf" target="_blank" rel="noreferrer"><Award size={15} /> Presentation certificate <ExternalLink size={13} /></a><a href="https://www.linkedin.com/in/kaweeshamr/" target="_blank" rel="noreferrer"><Presentation size={15} /> Conference details <ExternalLink size={13} /></a></div></div><div className="research-proof-stack"><a className="research-proof-card best" href="/research/synapse-ci-best-session.pdf" target="_blank" rel="noreferrer"><Image src="/images/synapse-best-session.png" alt="Best of session presentation certificate for Synapse CI" width={595} height={842} /><span className="proof-overlay"><Award size={15} /> BEST OF SESSION <ArrowUpRight size={14} /></span></a><a className="research-proof-card presentation" href="/research/synapse-ci-presentation.pdf" target="_blank" rel="noreferrer"><Image src="/images/synapse-presentation.png" alt="Excellent presentation certificate for Synapse CI" width={842} height={595} /><span className="proof-overlay"><Presentation size={15} /> EXCELLENT PRESENTATION <ArrowUpRight size={14} /></span></a></div></div><div className="research-pipeline"><div className="research-pipeline-top"><div><span className="pipeline-kicker"><GitBranch size={13} /> SYNAPSE CI / CLOSED-LOOP WORKFLOW</span><strong>semantic context in / resilience feedback out</strong></div><span className="pipeline-health"><i /> research pipeline passing</span></div><div className="research-flow">{researchSteps.map((step, index) => <div className="research-flow-stage" key={step.number}><article className={`research-node node-${index + 1}`}><span className="research-node-number">{step.number}</span><span className="research-node-label">{step.label}</span><h4>{step.title}</h4><p>{step.detail}</p><span className="research-node-status"><i /> stage complete</span></article>{index < researchSteps.length - 1 && <div className="research-connector"><span /></div>}</div>)}</div><div className="research-loop-footer"><span><i /> closed loop active</span><span>commit → context → test → chaos → memory</span><span>quality signal / retained</span></div></div><div className="research-results"><div className="research-results-intro"><span className="research-results-kicker">BENCHMARK SIGNAL / 14-MICROSERVICE JAVA SYSTEM</span><h3>Measured improvement<br /><span>inside the delivery loop.</span></h3><p>Evaluation across 60 pull requests showed that context-aware decisions can reduce CI cost while strengthening resilience discovery.</p></div><div className="research-metrics"><div><strong>41.9%</strong><span>reduction in executed tests</span></div><div><strong>50.0%</strong><span>lower pipeline wall-clock time</span></div><div><strong>97.4%</strong><span>fault detection rate</span></div><div><strong>30.0%</strong><span>faster time to first detection</span></div></div></div><div className="research-insight"><span><i /> research finding</span><p>Context-aware chaos experiments discovered <strong>55.6% more vulnerabilities</strong> than randomized injection while keeping the CI/CD loop focused.</p></div></div></section>

      <section className="github section-space" id="github"><div className="page-width"><div className="section-head"><div><div className="section-kicker"><span>05</span><span>GitHub Live</span></div><h2>Open work,<br /><span>visible progress.</span></h2></div><a className="inline-link" href="https://github.com/Kaweesha-mr" target="_blank" rel="noreferrer"><GitBranch size={15} /> View profile <ExternalLink size={13} /></a></div><div className="github-grid"><div className="github-stat-card"><GitBranch size={24} /><div className="github-handle">@Kaweesha-mr</div><div className="github-numbers"><div><strong>{githubProfile?.public_repos ?? "—"}</strong><span>repositories</span></div><div><strong>{githubProfile?.followers ?? "—"}</strong><span>followers</span></div><div><strong>{githubProfile?.following ?? "—"}</strong><span>following</span></div></div><div className="github-live"><span className="status-dot" /> Live from GitHub API</div></div><div className="repo-list">{githubRepos.length ? githubRepos.map((repo) => <a className="repo-row" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}><div><strong>{repo.name}</strong><span>{repo.description || "Open-source software project"}</span></div><div className="repo-meta"><span>{repo.language || "Code"}</span><span><Award size={12} /> {repo.stargazers_count}</span><ArrowUpRight size={15} /></div></a>) : <div className="repo-row empty"><div><strong>Public projects loading</strong><span>Visit GitHub to explore Kaweesha&apos;s repositories and recent work.</span></div><ArrowUpRight size={15} /></div>}</div></div></div></section>

      <section className="toolkit section-space" id="toolkit"><div className="page-width"><div className="section-kicker light"><span>06</span><span>Technical toolkit</span></div><div className="toolkit-head"><h2>Tools I use<br /><span>to make things work.</span></h2><p>A practical stack across application code, infrastructure, data, and delivery.</p></div><div className="toolkit-grid">{toolkit.map((item) => <div className="toolkit-item" key={item.title}><IconBadge icon={item.icon} tone="dark" /><h3>{item.title}</h3><p>{item.detail}</p></div>)}</div></div></section>

      <section className="community campus-life section-space" id="campus"><div className="page-width"><div className="section-head"><div><div className="section-kicker"><span>07</span><span>Campus life / an illustrated archive</span></div><h2>The work<br /><span>behind the work.</span></h2></div><p>A private collection of recognition, mentorship, and the people who shaped my SLIIT years.</p></div><div className="campus-intro"><div><span className="campus-signal"><i /> ARCHIVE / SLIIT / 2023—2026</span><p>Before the job titles and production systems, there were rooms full of people, questions, certificates, and small moments of showing up.</p></div><div className="campus-count"><strong>08</strong><span>selected<br />frames</span></div></div><div className="campus-feature"><figure className="campus-feature-image"><div className="campus-feature-image-stage" key={activeCampusMoment.src}><div className="campus-image-wrap"><Image src={activeCampusMoment.src} alt={activeCampusMoment.alt} width={1600} height={1200} priority={activeCampusIndex === 4} quality={95} /></div><figcaption><span>{String(activeCampusIndex + 1).padStart(2, "0")} / {activeCampusMoment.label}</span><strong>{activeCampusMoment.title}</strong><p>{activeCampusMoment.detail}</p></figcaption></div><div className="campus-feature-controls"><button type="button" onClick={showPreviousCampusMoment} aria-label="Show previous campus moment"><ChevronLeft size={17} /></button><span>{String(activeCampusIndex + 1).padStart(2, "0")} <i /> {String(campusMoments.length).padStart(2, "0")}</span><button type="button" onClick={showNextCampusMoment} aria-label="Show next campus moment"><ChevronRight size={17} /></button></div></figure><div className="campus-feature-copy"><span className="campus-signal"><i /> ARCHIVE / SELECT A FRAME</span><h3>Achievement is<br /><span>never a solo story.</span></h3><p>Every academic milestone carries the support of friends, mentors, family, and the communities that make effort feel worthwhile.</p><div className="campus-rule"><span>SLIIT / FACULTY OF COMPUTING</span><span>FRAME {String(activeCampusIndex + 1).padStart(2, "0")} / 08</span></div></div></div><div className="campus-rail">{campusMoments.map((moment, index) => <button type="button" className={`campus-rail-item ${index === activeCampusIndex ? "is-active" : ""}`} key={moment.src} onClick={() => showCampusMoment(index)} aria-label={`Show ${moment.title}`}><span className="campus-rail-image"><Image src={moment.src} alt={moment.alt} width={1600} height={1200} quality={82} /></span><span className="campus-rail-caption"><span>{String(index + 1).padStart(2, "0")} / {moment.label}</span><strong>{moment.title}</strong></span></button>)}</div></div></section>

      <section className="contact page-width" id="contact"><div className="contact-card"><div className="section-kicker light"><span>08</span><span>Contact</span></div><h2>Good work starts<br /><span>with a conversation.</span></h2><p>For thoughtful products, ambitious technical challenges, or a conversation about software engineering and research.</p><a className="button button-light" href="mailto:kaweesha.mr@gmail.com"><Mail size={15} /> kaweesha.mr@gmail.com <ArrowUpRight size={15} /></a><div className="contact-links"><a href="https://www.linkedin.com/in/kaweeshamr/" target="_blank" rel="noreferrer"><Network size={15} /> LinkedIn <ExternalLink size={12} /></a><a href="https://github.com/Kaweesha-mr" target="_blank" rel="noreferrer"><GitBranch size={15} /> GitHub <ExternalLink size={12} /></a><a href="tel:+94770723273"><Phone size={15} /> +94 77 072 3273</a></div></div></section>

      <footer className="footer page-width"><span>© 2026 Kaweesha Marasinghe</span><span>Software Engineer · Colombo, Sri Lanka</span><a href="#top">Back to top <ArrowUpRight size={12} /></a></footer>

      {selectedProject && <div className="modal-backdrop"><div className={`case-modal ${selectedProject.tone}`} role="dialog" aria-modal="true" aria-labelledby="case-title"><button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close case note"><X size={19} /></button><div className="project-label">{selectedProject.number} / {selectedProject.label} / {selectedProject.period}</div><h2 id="case-title">{selectedProject.title}</h2><p className="modal-lede">{selectedProject.description}</p><p>{selectedProject.detail}</p><span className="dossier-label">Key contributions</span><ul className="modal-contributions">{selectedProject.contributions.map((contribution) => <li key={contribution}><CheckCircle2 size={14} /> <span>{contribution}</span></li>)}</ul><p className="modal-outcome"><strong>Outcome</strong>{selectedProject.outcome}</p><div className="tag-row">{selectedProject.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></div>}
    </main>
  );
}
