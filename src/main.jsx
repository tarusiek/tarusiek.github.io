import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import "./styles.css";

const ease = [0.22, 1, 0.36, 1];
const email = "tarkacorp@gmail.com";
const mailto = `mailto:${email}`;
const ASSETS = {
  profile: "/assets/profile.jpg",
  mockups: {
    roomsy: "/assets/mockups/roomsy.jpg",
    restaurant: "/assets/mockups/restaurant.jpg",
  },
};
const linkedInProfileUrl = "https://www.linkedin.com/in/michalkaroltarka/";

const reveal = {
  hidden: { opacity: 0, y: 46, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

const group = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const stackGroups = [
  ["Languages", ["TypeScript", "JavaScript", "Swift", "Kotlin", "Python", "C++", "Rust"]],
  ["Frontend", ["React", "Next.js", "Astro", "Framer Motion", "Three.js", "Tailwind"]],
  ["Mobile", ["React Native", "SwiftUI", "Jetpack Compose", "Expo", "Reanimated"]],
  ["Backend", ["Node.js", "Postgres", "Prisma", "Redis", "Supabase", "Docker"]],
  ["Hardware", ["Fusion 360", "SolidWorks", "KiCad", "Arduino", "STM32", "ESP32"]],
];

const copy = {
  en: {
    brand: "MICHAŁ - DEV/ENG",
    available: "Available",
    nav: [
      ["01", "Work", "work"],
      ["02", "About", "about"],
      ["03", "Services", "services"],
      ["04", "Technologie", "stack"],
      ["05", "Process", "process"],
    ],
    heroMeta: ["Based in Poland", "Portfolio 2026"],
    hero: {
      before: "Software,",
      accent: "crafted",
      after: "with engineering precision.",
      text: "Independent developer and mechatronics builder creating premium mobile apps, sharp web platforms, and hardware-aware products that feel finished from first click.",
      primary: "View selected work",
      secondary: "Send email",
    },
    stats: [
      ["40", "+", "Projects shipped"],
      ["5", "yrs", "Building products"],
      ["12", "k", "App downloads"],
      ["99", "%", "On-time delivery"],
    ],
    labels: {
      about: ["02", "About", "profile.txt"],
      services: ["03", "Services", "4 disciplines"],
      work: ["04", "Selected Work", "2020 - 2026"],
      stack: ["05", "Technologie", "tools.config"],
      process: ["06", "Process", "4 stages"],
      contact: ["07", "Contact", "open inbox"],
    },
    about: {
      role: "Developer / Mechatronics",
      status: "Available",
      headline: <>A developer with the mindset of an <span>engineer</span>: methodical, curious, and obsessed with useful detail.</>,
      points: [
        ["01", "Mechatronics fluency across CAD, electronics, and embedded systems.", "Education"],
        ["02", "Cross-platform mobile apps with native feel and clean architectures.", "Mobile"],
        ["03", "Advanced web apps and dashboards: fast, accessible, type-safe.", "Web"],
        ["04", "Portfolio and landing pages that convert without looking disposable.", "Design"],
        ["05", "Comfortable connecting code, circuits, enclosures, and real users.", "Hardware"],
      ],
    },
    servicesHeading: ["What I build.", "Four overlapping disciplines, selected so every build has the right balance of product thinking, visual polish, and technical reality."],
    services: [
      ["01", "Mobile", "Mobile Apps", "Production iOS and Android apps with native feel, offline-first data, and polished motion systems.", ["React Native", "SwiftUI", "Expo", "SQLite"], "phone"],
      ["02", "Web", "Web Platforms", "SaaS dashboards, client portals, and marketing sites built fast, accessible, and type-safe.", ["React", "Next.js", "TypeScript", "Postgres"], "web"],
      ["03", "Identity", "Premium Sites", "Portfolio and landing experiences with sharp typography, motion direction, and conversion focus.", ["Framer Motion", "Design Systems", "AEO", "SEO"], "type"],
      ["04", "Hardware", "CAD / Electronics", "Mechanical models, PCB concepts, and fast prototypes that connect software ideas to physical products.", ["Fusion 360", "KiCad", "ESP32", "STM32"], "hardware"],
    ],
    workHeading: ["Featured projects.", "06 shown / 40+ total"],
    featured: [
      ["Mobile - iOS / Android", "2020 - 2026", "Helix - Habit OS", "Cross-platform habit tracker with offline-first sync, custom gesture animation, and a calm retention loop.", ["React Native", "Reanimated", "SQLite"], "mobile"],
      ["Web - SaaS Platform", "2020 - 2026", "Atrium - Analytics", "Realtime analytics workspace for high-volume teams, with sub-100ms queries and a precise operations UI.", ["Next.js", "tRPC", "ClickHouse"], "dashboard"],
    ],
    projects: [
      ["03", "Hardware - CAD", "Vector - desktop CNC mod", "Custom enclosure and controller board for a compact CNC mill.", "2020 - 2026"],
      ["04", "Web - Portfolio", "Studio Kael - agency site", "Bespoke portfolio system with editorial typography and scroll-led scenes.", "2020 - 2026"],
      ["05", "Mobile - iOS", "Linea - focus timer", "Minimal focus app with widgets, live status, and custom haptic rhythms.", "2020 - 2026"],
      ["06", "Hardware - IoT", "Greenhouse telemetry rig", "ESP32 sensor mesh paired with a clean React Native companion app.", "2020 - 2026"],
    ],
    stackHeading: ["Boring tools, sharp results.", "I lean on proven tooling, strong architecture, and polished interaction details. Exotic tech only enters when the problem earns it."],
    processHeading: ["From idea to ship.", "A lightweight process for getting premium work into production without making the project feel heavy."],
    process: [
      ["01", "Idea", "Days 1-3", "Scope the outcome, constraints, success metrics, and the single job the product must do.", ["Discovery call", "Spec document", "Fixed quote"]],
      ["02", "Design", "Week 1-2", "Turn the shape into a high-fidelity interface with interaction notes and responsive states.", ["UX flow", "Visual system", "Motion sketch"]],
      ["03", "Development", "Week 2-6", "Build in visible increments with weekly demos, production code, and tight QA loops.", ["Daily commits", "Testing", "Performance pass"]],
      ["04", "Launch", "Release", "Deploy, wire analytics, handle store submissions, and support the first post-launch month.", ["CI/CD", "Analytics", "30-day support"]],
    ],
    contact: {
      label: "Selected availability - 2020 - 2026",
      heading: <>Have a project in mind? <span>Let's build it.</span></>,
      emailSmall: "mail",
      send: "Send email",
      cv: "Download CV",
      meta: [["Response time", "Within 24 hours"], ["Availability", "2 builds open"], ["LinkedIn", "LinkedIn profile", linkedInProfileUrl]],
    },
    footer: ["2026 - Michał", "Built with React + Framer Motion", "v3.1"],
    local: "Local",
  },
  pl: {
    brand: "MICHAŁ - DEV/PL",
    available: "Dostępny",
    nav: [
      ["01", "Projekty", "work"],
      ["02", "O mnie", "about"],
      ["03", "Usługi", "services"],
      ["04", "Technologie", "stack"],
      ["05", "Proces", "process"],
    ],
    heroMeta: ["Polska", "Portfolio 2026"],
    hero: {
      before: "Oprogramowanie,",
      accent: "tworzone",
      after: "z inżynierską precyzją.",
      text: "Niezależny programista i twórca mechatroniczny. Buduję premium aplikacje mobilne, dopracowane platformy webowe i produkty, które łączą kod z realnym światem.",
      primary: "Zobacz projekty",
      secondary: "Napisz e-mail",
    },
    stats: [
      ["20", "+", "Dostarczonych projektów"],
      ["6", "lat", "Budowania produktów"],
      ["50", "k", "Wyświetleń stron"],
      ["99,9", "%", "Terminowości"],
    ],
    labels: {
      about: ["02", "O mnie", "profile.txt"],
      services: ["03", "Usługi", "4 dyscypliny"],
      work: ["04", "Wybrane projekty", "2020 - 2026"],
      stack: ["05", "Technologie", "tools.config"],
      process: ["06", "Proces", "4 etapy"],
      contact: ["07", "Kontakt", "otwarta skrzynka"],
    },
    about: {
      role: "Programista / Projektant CAD",
      status: "Dostępny",
      headline: <>Programista z myśleniem <span>inżyniera</span>: metodyczny, ciekawy i skupiony na detalach, które robią różnicę.</>,
      points: [
        ["01", "Mechatronika: CAD, elektronika, automatyka i systemy wbudowane.", "Edukacja"],
        ["02", "Aplikacje mobilne na wiele platform, z natywnym odczuciem i czystą architekturą.", "Aplikacje"],
        ["03", "Zaawansowane aplikacje webowe i panele: szybkie, dostępne i stabilne.", "Web"],
        ["04", "Portfolio i strony sprzedażowe, które wyglądają premium i realnie wspierają sprzedaż.", "Projekt"],
        ["05", "Łączę kod, obwody, obudowy, przenośniki i realnych użytkowników.", "CAD"],
      ],
    },
    servicesHeading: ["Co buduję?", "Cztery łączące się dyscypliny, dzięki którym każdy projekt ma produktowe myślenie, wizualny poziom i techniczną prawdę."],
    services: [
      ["01", "Aplikacje", "Aplikacje mobilne", "Projektuję aplikacje iOS i Android z dopracowanym interfejsem, płynnymi animacjami i architekturą gotową do rozwoju.", ["React Native", "SwiftUI", "Expo", "SQLite"], "phone"],
      ["02", "Web", "Platformy webowe", "Strony firmowe, systemy rezerwacji, panele i realizacje dla biznesów, które potrzebują szybkości, jakości i wiarygodności.", ["React", "Next.js", "TypeScript", "Postgres"], "web"],
      ["03", "Wizerunek", "Strony premium", "Portfolio i strony sprzedażowe z mocną typografią, świadomym ruchem i komunikacją nastawioną na konwersję.", ["Framer Motion", "Systemy UI", "SEO", "Analityka"], "type"],
      ["04", "CAD", "CAD / Przenośniki", "Projektowałem przenośniki taśmowe, układy mechaniczne i elementy konstrukcyjne, łącząc dokładność CAD z praktyką produkcyjną.", ["Fusion 360", "SolidWorks", "Przenośniki", "Dokumentacja"], "hardware"],
    ],
    workHeading: ["Wybrane realizacje.", "06 pokazanych / 40+ łącznie"],
    featured: [
      ["Aplikacja mobilna - iOS / Android", "Wkrótce", "Roomsy", "Tymczasowa karta nowej aplikacji mobilnej. Roomsy jest aktualnie w przygotowaniu i niedługo wychodzi jako dopracowany produkt dla użytkowników, którzy chcą szybciej ogarniać przestrzeń, rezerwacje i codzienne decyzje.", ["React Native", "Animacje", "Produkt", "Wkrótce"], "mobile"],
      ["Strona webowa - Restauracja", "2020 - 2026", "Realizacja dla restauracji", "Nowoczesna strona dla restauracji: elegancki pierwszy ekran, czytelne menu, szybki kontakt, rezerwacje i klimat marki przeniesiony do interfejsu. Projekt nastawiony na zaufanie, estetykę i realne zapytania od gości.", ["React", "Responsywność", "SEO", "Rezerwacje"], "dashboard"],
    ],
    projects: [
      ["03", "CAD - Przenośniki", "Przenośniki taśmowe", "Projekty układów transportu wewnętrznego, konstrukcji wsporczych i elementów mechanicznych pod produkcję.", "2020 - 2026"],
      ["04", "Web - Restauracja", "Strona dla restauracji", "Realizacja z naciskiem na atmosferę lokalu, menu, rezerwacje i szybki kontakt na telefonie.", "2020 - 2026"],
      ["05", "Aplikacja mobilna", "Roomsy", "Nadchodząca aplikacja mobilna. Aktualnie karta tymczasowa projektu, który niedługo zostanie pokazany szerzej.", "Wkrótce"],
      ["06", "Mechatronika - IoT", "System telemetryczny", "Sieć sensorów ESP32 połączona z czytelnym panelem i aplikacją do monitorowania danych.", "2020 - 2026"],
    ],
    stackHeading: ["Sprawdzone narzędzia, ostre wyniki.", "Stawiam na stabilne narzędzia, mocną architekturę i dopracowane interakcje. Egzotyka wchodzi tylko wtedy, kiedy problem naprawdę jej potrzebuje."],
    processHeading: ["Od pomysłu do wdrożenia.", "Lekki proces, który pozwala dowieźć pracę premium do produkcji bez robienia z projektu ciężkiego rytuału."],
    process: [
      ["01", "Pomysł", "Dni 1-3", "Definiujemy cel, ograniczenia, metryki sukcesu i najważniejsze zadanie produktu.", ["Rozmowa wstępna", "Dokument specyfikacji", "Stała wycena"]],
      ["02", "Projekt", "Tydzień 1-2", "Zamieniamy kierunek w dopracowany interfejs z notatkami interakcji i stanami responsywnymi.", ["Ścieżka użytkownika", "System wizualny", "Szkic animacji"]],
      ["03", "Programowanie", "Tydzień 2-6", "Budowa w widocznych iteracjach: działające demo, kod produkcyjny i szybkie testy jakości.", ["Codzienne postępy", "Testy", "Optymalizacja"]],
      ["04", "Wdrożenie", "Publikacja", "Wdrożenie, analityka, publikacja i pierwszy miesiąc wsparcia po starcie.", ["Automatyzacja", "Analityka", "30 dni wsparcia"]],
    ],
    contact: {
      label: "Zakres realizacji - 2020 - 2026",
      heading: <>Masz projekt w głowie? <span>Zbudujmy go.</span></>,
      emailSmall: "e-mail",
      send: "Wyślij e-mail",
      cv: "Pobierz CV",
      meta: [["Czas odpowiedzi", "Do 24 godzin"], ["Dostępność", "2 miejsca na projekty"], ["LinkedIn", "Profil LinkedIn", linkedInProfileUrl]],
    },
    footer: ["2026 - Michał", "Życzę udanego dnia!", "v3.1"],
    local: "Czas",
  },
};

function detectLanguage() {
  if (typeof navigator === "undefined") return "en";
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localeSaysPoland = languages.some((language) => /^pl\b/i.test(language) || /-PL\b/i.test(language));
  return localeSaysPoland || timezone === "Europe/Warsaw" ? "pl" : "en";
}

function getInitialLanguage() {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem("portfolio-language");
  return saved === "pl" || saved === "en" ? saved : detectLanguage();
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function randomCpuLoad() {
  return Math.floor(40 + Math.random() * 59);
}

function getCpuColor(value) {
  if (value < 63) return "#b8ff57";
  if (value < 82) return "#e7d75f";
  return "#ff7b62";
}

function AssetImage({ src, alt, className, children }) {
  const [failed, setFailed] = useState(false);

  if (failed) return children;

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function SectionLabel({ index, title, meta }) {
  return (
    <motion.div
      className="section-label"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <span className="marker" />
      <span>{index} / {title}</span>
      <span className="section-line" />
      <span>{meta}</span>
    </motion.div>
  );
}

function PremiumButton({ children, variant = "primary", onClick, href }) {
  const MotionTag = href ? motion.a : motion.button;
  return (
    <MotionTag
      className={`button ${variant === "ghost" ? "button-ghost" : "button-primary"}`}
      onClick={onClick}
      href={href}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <span>{children}</span>
      <span className="button-orbit" aria-hidden="true">
        <svg viewBox="0 0 14 14">
          <path d="M3 11L11 3M6 3h5v5" />
        </svg>
      </span>
    </MotionTag>
  );
}

function KineticBlock({ children, className = "", lift = 70, rotate = 0 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [lift, 0, -lift]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [rotate, 0, -rotate]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.86, 1], [0.35, 1, 1, 0.58]);

  return (
    <motion.div ref={ref} className={className} style={{ y, rotateZ, opacity }}>
      {children}
    </motion.div>
  );
}

function Nav({ t, language, onLanguageToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.header
        className="nav-shell"
        initial={{ x: "-50%", y: -28, opacity: 0 }}
        animate={{ x: "-50%", y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        <button className="brand" onClick={() => scrollTo("top")} aria-label="Back to top">
          <span className="brand-dot" />
          <span>{t.brand}</span>
        </button>
        <nav className="nav-links" aria-label="Primary navigation">
          {t.nav.map(([num, label, id]) => (
            <button key={id} onClick={() => scrollTo(id)}>
              <span>{num}</span>{label}
            </button>
          ))}
        </nav>
        <button className="lang-toggle" onClick={onLanguageToggle} aria-label="Change language">
          {language.toUpperCase()}
        </button>
        <button className="availability" onClick={() => scrollTo("contact")}>
          <span className="pulse" />
          {t.available}
        </button>
        <button
          className={`menu-toggle ${open ? "is-open" : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <motion.div
              className="menu-panel"
              variants={group}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {t.nav.map(([num, label, id]) => (
                <motion.button
                  key={id}
                  variants={reveal}
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => scrollTo(id), 120);
                  }}
                >
                  <span>{num}</span>
                  {label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Glyph({ type }) {
  return (
    <svg className="glyph" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      {type === "phone" && (
        <>
          <rect x="30" y="8" width="36" height="80" rx="10" />
          <path d="M39 20h18M39 74h18M42 34h12M36 44h24M40 54h16" />
        </>
      )}
      {type === "web" && (
        <>
          <rect x="10" y="18" width="76" height="56" rx="8" />
          <path d="M10 30h76M20 24h2M28 24h2M36 24h2M24 44h24M24 56h16M56 44h16M56 56h10" />
        </>
      )}
      {type === "type" && (
        <>
          <path d="M14 24h68M14 40h52M14 56h68M14 72h42" />
          <circle cx="76" cy="40" r="5" />
        </>
      )}
      {type === "hardware" && (
        <>
          <circle cx="48" cy="48" r="24" />
          <circle cx="48" cy="48" r="7" />
          <path d="M48 12v12M48 72v12M12 48h12M72 48h12M24 24l8 8M64 64l8 8M72 24l-8 8M32 64l-8 8" />
        </>
      )}
    </svg>
  );
}

function HeroVisual() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.35], [0, -90]);
  const rotate = useTransform(scrollYProgress, [0, 0.35], [0, -8]);
  const [cpuLoad, setCpuLoad] = useState(() => randomCpuLoad());
  const cpuColor = getCpuColor(cpuLoad);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCpuLoad(randomCpuLoad());
    }, 1600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div className="hero-visual outer-bezel" style={{ y, rotate }}>
      <div className="hero-visual-core">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="sensor-card sensor-a">
          <span>CPU</span>
          <motion.strong
            animate={{ color: cpuColor, textShadow: `0 0 18px ${cpuColor}55` }}
            transition={{ duration: 0.65, ease }}
          >
            {cpuLoad}%
          </motion.strong>
        </div>
        <div className="sensor-card sensor-b">
          <span>BUILD</span>
          <strong>98</strong>
        </div>
        <motion.div
          className="terminal"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease }}
        >
          <div className="terminal-top">
            <span />
            <span />
            <span />
          </div>
          <div className="terminal-lines">
            <i className="accent-line" />
            <i />
            <i className="short" />
            <i />
            <i className="accent-block" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function GridSignal() {
  const { scrollYProgress } = useScroll();
  const rawX = useTransform(scrollYProgress, [0, 0.18, 0.36, 0.58, 0.78, 1], ["-34vw", "22vw", "-20vw", "31vw", "-8vw", "18vw"]);
  const rawY = useTransform(scrollYProgress, [0, 0.18, 0.36, 0.58, 0.78, 1], ["18vh", "34vh", "62vh", "46vh", "72vh", "24vh"]);
  const rawRotate = useTransform(scrollYProgress, [0, 0.36, 0.72, 1], [-4, 3, -2, 4]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.12, 0.86, 1], [0.18, 0.34, 0.3, 0.16]);
  const spring = { stiffness: 58, damping: 24, mass: 0.7 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const rotate = useSpring(rawRotate, spring);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 28, mass: 0.6 });

  return (
    <motion.div className="grid-signal" style={{ x, y, rotate, opacity }} aria-hidden="true">
      <div className="grid-signal-core">
        <span className="signal-dot" />
        <span className="signal-dot" />
        <span className="signal-line" />
        <span className="signal-line short" />
        <span className="signal-chip">UI</span>
      </div>
    </motion.div>
  );
}

function FeaturedVisual({ type }) {
  if (type === "mobile") {
    return (
      <div className="feature-visual">
        <AssetImage src={ASSETS.mockups.roomsy} alt="Roomsy mobile app mockup" className="mockup-image">
          <motion.div
            className="mobile-mock"
            whileHover={{ rotate: -3, y: -8 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <span className="notch" />
            <div className="mobile-screen">
              <i className="accent-line" />
              <i />
              <i className="short" />
              <div className="mobile-graph" />
            </div>
          </motion.div>
        </AssetImage>
      </div>
    );
  }

  return (
    <div className="feature-visual">
      <AssetImage src={ASSETS.mockups.restaurant} alt="Restaurant website mockup" className="mockup-image">
        <motion.div
          className="dashboard-mock"
          whileHover={{ rotate: 2, y: -8 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="dash-bar"><span /><span /><span /></div>
          <div className="dash-body">
            <div className="dash-side"><i /><i /><i /><i /></div>
            <div className="dash-main">
              <div className="dash-hero" />
              <div className="dash-cards"><i /><i /><i /></div>
            </div>
          </div>
        </motion.div>
      </AssetImage>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [manualLanguage, setManualLanguage] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem("portfolio-language"));
  });
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  const t = copy[language];
  const localizedStackGroups = language === "pl"
    ? [
        ["Języki", stackGroups[0][1]],
        ["Interfejs", stackGroups[1][1]],
        ["Aplikacje mobilne", stackGroups[2][1]],
        ["Zaplecze techniczne", stackGroups[3][1]],
        ["CAD / Mechanika", stackGroups[4][1]],
      ]
    : stackGroups;
  const marqueeWords = language === "pl"
    ? ["Software", "Mechatronika", "Mobile", "Web", "CAD", "Elektronika"]
    : ["Software", "Mechatronics", "Mobile", "Web", "CAD", "Electronics"];
  const localTime = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }).format(new Date()),
    []
  );
  const bgShift = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const bgSpin = useTransform(scrollYProgress, [0, 1], [0, 24]);
  const bgShiftB = useTransform(scrollYProgress, [0, 1], [80, -120]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (manualLanguage) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 1800);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.country_code) setLanguage(data.country_code === "PL" ? "pl" : "en");
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [manualLanguage]);

  function toggleLanguage() {
    setLanguage((current) => {
      const next = current === "pl" ? "en" : "pl";
      window.localStorage.setItem("portfolio-language", next);
      return next;
    });
    setManualLanguage(true);
  }

  return (
    <div className="app">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="bg-grid" />
      <motion.div className="bg-glow bg-glow-a" style={{ y: bgShift, rotate: bgSpin }} />
      <motion.div className="bg-glow bg-glow-b" style={{ y: bgShiftB }} />
      <GridSignal />
      <div className="noise" />
      <Nav t={t} language={language} onLanguageToggle={toggleLanguage} />

      <main>
        <section className="hero section" id="top">
          <div className="container hero-layout">
            <motion.div className="hero-copy" variants={group} initial="hidden" animate="visible">
              <motion.div className="hero-meta" variants={reveal}>
                <span><i />{t.heroMeta[0]}</span>
                <span>{t.local} {localTime}</span>
                <span>{t.heroMeta[1]}</span>
              </motion.div>
              <motion.h1 variants={reveal}>
                {t.hero.before} <span>{t.hero.accent}</span> {t.hero.after}
              </motion.h1>
              <motion.p className="hero-text" variants={reveal}>
                {t.hero.text}
              </motion.p>
              <motion.div className="hero-actions" variants={reveal}>
                <PremiumButton onClick={() => scrollTo("work")}>{t.hero.primary}</PremiumButton>
                <PremiumButton variant="ghost" href={mailto}>{t.hero.secondary}</PremiumButton>
              </motion.div>
            </motion.div>
            <HeroVisual />
          </div>
          <motion.div
            className="container stats"
            variants={group}
            initial="hidden"
            animate="visible"
          >
            {t.stats.map(([value, unit, label]) => (
              <motion.div className="stat" key={label} variants={reveal}>
                <strong>{value}<span>{unit}</span></strong>
                <small>{label}</small>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="section" id="about">
          <div className="container">
            <SectionLabel index={t.labels.about[0]} title={t.labels.about[1]} meta={t.labels.about[2]} />
            <div className="about-grid">
              <motion.div
                className="about-intro"
                variants={group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
              >
                <motion.div className="id-card outer-bezel" variants={reveal}>
                  <div className="portrait">
                    <AssetImage src={ASSETS.profile} alt="Michał Tarka" className="portrait-image">
                      <span>M</span>
                    </AssetImage>
                  </div>
                  <dl>
                    <dt>Name</dt>
                    <dd>Michał</dd>
                    <dt>Role</dt>
                    <dd>{t.about.role}</dd>
                    <dt>Status</dt>
                    <dd><i className="live" />{t.about.status}</dd>
                  </dl>
                </motion.div>
                <motion.h2 variants={reveal}>
                  {t.about.headline}
                </motion.h2>
              </motion.div>

              <motion.ul
                className="about-points"
                variants={group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
              >
                {t.about.points.map(([num, text, tag], index) => (
                  <motion.li key={num} variants={reveal} whileHover={{ x: 16, scale: 1.01 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>
                    <span>{num}</span>
                    <p>{text}</p>
                    <em>{tag}</em>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <SectionLabel index={t.labels.services[0]} title={t.labels.services[1]} meta={t.labels.services[2]} />
            <motion.div
              className="section-heading split"
              variants={group}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
            >
              <motion.h2 variants={reveal}>{t.servicesHeading[0]}</motion.h2>
              <motion.p variants={reveal}>
                {t.servicesHeading[1]}
              </motion.p>
            </motion.div>
            <KineticBlock className="services-kinetic" lift={44} rotate={1.2}>
              <motion.div
                className="services-grid"
                variants={group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
              >
              {t.services.map(([num, label, title, text, tags, glyph], index) => (
                <motion.article
                  className="service-card outer-bezel"
                  key={title}
                  variants={reveal}
                  whileHover={{ y: -16, rotate: index % 2 ? 1.4 : -1.4, scale: 1.025 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                >
                  <div className="card-core">
                    <div className="service-top">
                      <span>{num} / {label}</span>
                      <Glyph type={glyph} />
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <div className="tags">
                      {tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </motion.article>
              ))}
              </motion.div>
            </KineticBlock>
          </div>
        </section>

        <section className="section" id="work">
          <div className="container">
            <SectionLabel index={t.labels.work[0]} title={t.labels.work[1]} meta={t.labels.work[2]} />
            <motion.div
              className="section-heading split"
              variants={group}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
            >
              <motion.h2 variants={reveal}>{t.workHeading[0]}</motion.h2>
              <motion.p className="mono" variants={reveal}>{t.workHeading[1]}</motion.p>
            </motion.div>

            <KineticBlock lift={54} rotate={-0.8}>
              <motion.div
                className="featured-grid"
                variants={group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
              >
              {t.featured.map(([category, year, title, text, tags, visual], index) => (
                <motion.article
                  className="feature-card outer-bezel"
                  key={title}
                  variants={reveal}
                  whileHover={{ y: -18, scale: 1.018, rotate: index ? 0.8 : -0.8 }}
                  transition={{ type: "spring", stiffness: 240, damping: 24 }}
                >
                  <div className="card-core">
                    <div className="feature-meta">
                      <span>{category}</span>
                      <span>{year}</span>
                    </div>
                    <FeaturedVisual type={visual} />
                    <h3>{title}</h3>
                    <p>{text}</p>
                    <div className="feature-row">
                      <div className="tags">
                        {tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                      <a href={mailto} aria-label={`${title} email`}>{language === "pl" ? "E-mail" : "Email"}</a>
                    </div>
                  </div>
                </motion.article>
              ))}
              </motion.div>
            </KineticBlock>

            <motion.div
              className="project-list"
              variants={group}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
            >
              {t.projects.map(([num, cat, title, text, year], index) => (
                <motion.article
                  className="project-row"
                  key={title}
                  variants={reveal}
                  whileHover={{ x: 18, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                >
                  <span className="project-num">/ {num}</span>
                  <div>
                    <small>{cat}</small>
                    <h3>{title}</h3>
                  </div>
                  <p>{text}</p>
                  <time>{year}</time>
                  <span className="row-arrow" aria-hidden="true">
                    <svg viewBox="0 0 14 14"><path d="M3 11L11 3M6 3h5v5" /></svg>
                  </span>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section" id="stack">
          <div className="container">
            <SectionLabel index={t.labels.stack[0]} title={t.labels.stack[1]} meta={t.labels.stack[2]} />
            <div className="stack-layout">
              <motion.div
                className="stack-copy"
                variants={group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
              >
                <motion.h2 variants={reveal}>{t.stackHeading[0]}</motion.h2>
                <motion.p variants={reveal}>
                  {t.stackHeading[1]}
                </motion.p>
              </motion.div>
              <KineticBlock lift={36} rotate={0.45}>
                <motion.div
                  className="stack-groups"
                  variants={group}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-120px" }}
                >
                {localizedStackGroups.map(([name, tools]) => (
                  <motion.div
                    className="stack-group"
                    key={name}
                    variants={reveal}
                    whileHover={{ x: 14 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <h3><i />{name}</h3>
                    <div className="chips">
                      {tools.map((tool) => <span key={tool}>{tool}</span>)}
                    </div>
                  </motion.div>
                ))}
                </motion.div>
              </KineticBlock>
            </div>
            <div className="marquee" aria-hidden="true">
              <div>
                {[...marqueeWords, ...marqueeWords].map((word, index) => (
                  <span key={`${word}-${index}`}>{word}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="process">
          <div className="container">
            <SectionLabel index={t.labels.process[0]} title={t.labels.process[1]} meta={t.labels.process[2]} />
            <motion.div
              className="section-heading"
              variants={group}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
            >
              <motion.h2 variants={reveal}>{t.processHeading[0]}</motion.h2>
              <motion.p variants={reveal}>
                {t.processHeading[1]}
              </motion.p>
            </motion.div>
            <KineticBlock lift={48} rotate={0}>
              <motion.div
                className="process-grid"
                variants={group}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
              >
              {t.process.map(([num, title, period, text, points], index) => (
                <motion.article
                  className="process-card"
                  key={title}
                  variants={reveal}
                  whileHover={{ y: -12, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                  <span className="badge">{num}</span>
                  <small>{period}</small>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <ul>
                    {points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </motion.article>
              ))}
              </motion.div>
            </KineticBlock>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container">
            <SectionLabel index={t.labels.contact[0]} title={t.labels.contact[1]} meta={t.labels.contact[2]} />
            <motion.div
              className="contact-card outer-bezel"
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
            >
              <div className="contact-core">
                <span className="contact-label"><i />{t.contact.label}</span>
                <h2>
                  {t.contact.heading}
                </h2>
                <div className="contact-actions">
                  <a href={mailto} className="email-link">{email} <small>{t.contact.emailSmall}</small></a>
                  <PremiumButton href={mailto}>{t.contact.send}</PremiumButton>
                  <PremiumButton variant="ghost">{t.contact.cv}</PremiumButton>
                </div>
                <div className="contact-meta">
                  {t.contact.meta.map(([label, value, href]) => (
                    <div key={label}>
                      <small>{label}</small>
                      {href ? <strong><a href={href} target="_blank" rel="noreferrer">{value}</a></strong> : <strong>{value}</strong>}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer>
        {t.footer.map((item) => <span key={item}>{item}</span>)}
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
