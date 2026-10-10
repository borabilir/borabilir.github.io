import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { copy, Language } from "./content";
import styles from "./styles.module.scss";
import { JournalArticlePage, JournalPage } from "./Journal";
import { JOURNAL_PATH } from "./journalContent";

const ASSET = "/hollowgale";

type LeafStyle = CSSProperties & Record<`--${string}`, string>;

const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = window.localStorage.getItem("hollowgale-language");
    if (saved === "tr" || saved === "en") return saved;
    return "en";
  });

  const setLanguage = (next: Language) => {
    window.localStorage.setItem("hollowgale-language", next);
    document.documentElement.lang = next;
    setLanguageState(next);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
};

const useReveal = () => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-hg-reveal]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add(styles.visible));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(styles.visible);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
};

const Brand = ({ compact = false, emblem = false }: { compact?: boolean; emblem?: boolean }) => (
  <span className={`${styles.brand} ${compact ? styles.brandCompact : ""}`}>
    {emblem && <span className={styles.brandEmblem} aria-hidden="true"><img src={`${ASSET}/hollowgale-emblem-small-v4.png`} alt="" /></span>}
    <img className={styles.brandWordmark} src={`${ASSET}/hollowgale-logo.png`} alt="Hollowgale Games" />
  </span>
);

const GameTitle = ({ compact = false }: { compact?: boolean }) => compact ? (
  <img className={`${styles.gameTitle} ${styles.gameTitleCompact}`} src={`${ASSET}/mansion-wordmark.svg`} alt="Mansion of Fates" />
) : (
  <span className={styles.gameTitle}>
    <img className={styles.gameLettering} src={`${ASSET}/mansion-lettering-v3.png`} alt="Mansion of Fates" />
    <img className={styles.gameLogoDivider} src={`${ASSET}/mansion-logo-divider.png`} alt="" aria-hidden="true" />
  </span>
);

const KeyMark = () => <svg className={styles.keyMark} viewBox="0 0 160 64" fill="none" aria-hidden="true"><path d="M0 25h59m42 0h59M80 27v32m0-15h9v7h-9m0-24c-18 3-18-17-8-15-4-13 20-13 16 0 10-2 10 18-8 15Z" stroke="currentColor" strokeWidth="1.6" /><circle cx="80" cy="18" r="3" stroke="currentColor" /></svg>;

const LanguageSwitch = ({ language, setLanguage }: { language: Language; setLanguage: (value: Language) => void }) => (
  <div className={styles.languageSwitch} aria-label={copy[language].language.label}>
    {(["tr", "en"] as Language[]).map((item) => (
      <button key={item} aria-pressed={language === item} className={language === item ? styles.activeLanguage : ""} type="button" onClick={() => setLanguage(item)}>
        {item.toUpperCase()}
      </button>
    ))}
  </div>
);

const Leaves = ({ count = 14, calm = false }: { count?: number; calm?: boolean }) => {
  const leaves = useMemo(() => Array.from({ length: count }, (_, index) => ({
    id: index,
    top: `${8 + ((index * 17) % 74)}%`,
    left: `${8 + ((index * 29) % 82)}%`,
    delay: `${-(index * 0.73)}s`,
    duration: `${calm ? 13 + (index % 6) : 7 + (index % 5)}s`,
    scale: `${0.68 + (index % 4) * 0.16}`,
    rotate: `${(index * 43) % 220 - 110}deg`,
  })), [count, calm]);

  return <div className={`${styles.leaves} ${calm ? styles.leavesCalm : ""}`} aria-hidden="true">
    {leaves.map((leaf) => <i key={leaf.id} style={{
      "--leaf-top": leaf.top,
      "--leaf-left": leaf.left,
      "--leaf-delay": leaf.delay,
      "--leaf-duration": leaf.duration,
      "--leaf-scale": leaf.scale,
      "--leaf-rotate": leaf.rotate,
    } as LeafStyle}><img src={`${ASSET}/wind-leaf.png`} alt="" /></i>)}
  </div>;
};

const StudioHeader = ({ language, setLanguage, docked, journal = false }: { language: Language; setLanguage: (value: Language) => void; docked: boolean; journal?: boolean }) => {
  const text = copy[language].studio;
  const base = journal ? "/hollowgalegames" : "";
  return <header className={`${styles.studioHeader} ${docked ? styles.headerDocked : ""}`}>
    <a className={styles.headerBrand} href="/hollowgalegames"><Brand compact emblem /></a>
    <nav aria-label="Primary navigation">
      <a href={`${base}#game`}>{text.nav.games}</a><a href={`${base}#studio`}>{text.nav.studio}</a><a href={JOURNAL_PATH} aria-current={journal ? "page" : undefined}>{text.nav.journal}</a><a href={`${base}#contact`}>{text.nav.contact}</a>
    </nav>
    <LanguageSwitch language={language} setLanguage={setLanguage} />
  </header>;
};

const StudioPage = () => {
  const { language, setLanguage } = useLanguage();
  const text = copy[language].studio;
  const heroRef = useRef<HTMLElement>(null);
  const [docked, setDocked] = useState(false);
  useReveal();

  useEffect(() => {
    document.title = "Hollowgale Games";
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const value = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight * 0.82)));
      setDocked(value > 0.72);
      const travel = motionPreference.matches ? 0 : Math.min(hero.offsetHeight, Math.max(0, window.scrollY));
      hero.style.setProperty("--sky-shift", `${Math.min(96, travel * 0.18)}px`);
      hero.style.setProperty("--moon-shift", `${Math.min(64, travel * 0.12)}px`);
      hero.style.setProperty("--landscape-shift", `${Math.min(24, travel * 0.045)}px`);
    };
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motionPreference.addEventListener("change", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motionPreference.removeEventListener("change", onScroll);
    };
  }, []);

  return <div className={styles.hollowgaleSite}>
    <a className={styles.skipLink} href="#game">{text.scroll}</a>
    <StudioHeader language={language} setLanguage={setLanguage} docked={docked} />
    <main>
      <section ref={heroRef} className={styles.studioHero}>
        <svg className={styles.windFilter} aria-hidden="true">
          <defs>
            <filter id="hollowgale-branch-wind" x="-2%" y="-2%" width="104%" height="46%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.004 0.01" numOctaves="1" seed="9" result="windNoise">
                <animate attributeName="baseFrequency" values="0.004 0.01;0.0045 0.011;0.0035 0.012;0.004 0.01" dur="9s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="windNoise" scale="10" xChannelSelector="R" yChannelSelector="G">
                <animate attributeName="scale" values="10;20;13;18;10" dur="8.5s" repeatCount="indefinite" />
              </feDisplacementMap>
            </filter>
          </defs>
        </svg>
        <img className={styles.heroSky} src={`${ASSET}/studio-far-forest.png`} alt="" />
        <div className={styles.moonLayer} aria-hidden="true"><img className={styles.moon} src={`${ASSET}/moon.png`} alt="" /></div>
        <div className={styles.heroLandscape} aria-hidden="true">
          <div className={styles.heroArtwork}>
            <img className={styles.heroCanopy} src={`${ASSET}/studio-tree-grounded.png`} alt="" />
            <img className={styles.heroRoots} src={`${ASSET}/studio-tree-grounded.png`} alt="" />
          </div>
        </div>
        <Leaves />
        <svg className={styles.windLines} viewBox="0 0 1000 540" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M-40 198C130 195 90 325 225 330S285 309 355 326M695 95C805 61 835 165 1030 150M658 120C848 98 768 226 982 221M790 374C951 346 852 428 1040 400" /></svg>
        <div className={styles.heroLogo}>
          <Brand />
          <p><span />{text.heroTagline}<span /></p>
        </div>
        <a className={styles.scrollCue} href="#manifesto"><span />{text.scroll}</a>
      </section>

      <section id="manifesto" className={styles.manifesto}>
        <div><p>{text.manifestoLabel}</p><h1>{text.manifestoTitle}</h1></div>
        <p className={styles.manifestoAside}>{text.manifestoAside}</p>
        <Leaves count={5} calm />
      </section>

      <section id="game" className={styles.studioGame} data-hg-reveal>
        <img src={`${ASSET}/mansion-hero.png`} alt="The Mansion of Fates estate at night" />
        <div className={styles.gameOverlay}>
          <p className={styles.sectionLabel}>{text.gameLabel}</p>
          <GameTitle />
          <strong>{text.comingSoon}</strong>
          <p>{text.gameLead}</p>
          <a className={styles.outlineButton} href="/hollowgalegames/mansionoffates">{text.discoverGame}<span aria-hidden="true">→</span></a>
          <small>{text.gameAside}</small>
        </div>
      </section>

      <section id="studio" className={styles.about} data-hg-reveal>
        <div className={styles.aboutCopy}>
          <p className={styles.sectionLabel}>{text.aboutLabel}</p>
          <h2>{text.aboutTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
          <p>{text.aboutLead}</p>
          <ul>{text.values.map((value) => <li key={value}>{value}</li>)}</ul>
        </div>
        <img src={`${ASSET}/studio-blueprint.png`} alt="Mansion blueprint, antique key and studio notes" />
      </section>

      <section id="journal" className={styles.journal} data-hg-reveal>
        <div className={styles.journalIntro}>
          <p className={styles.sectionLabel}>{text.journalLabel}</p>
          <h2>{text.journalTitle.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
          <p>{text.journalLead}</p>
          <a className={styles.outlineButton} href={JOURNAL_PATH}>{text.allNotes}<span aria-hidden="true">→</span></a>
        </div>
        <div className={styles.journalGrid}>
          {["library.png", "dining.png", "corridor.png"].map((image, index) => <figure key={image} className={styles[`journalItem${index + 1}`]}>
            <a href={`${JOURNAL_PATH}/${["light-shadow-and-readability", "the-story-of-a-room", "light-shadow-and-readability"][index]}`}><img src={`${ASSET}/${image}`} alt={text.entries[index]} loading="lazy" /><figcaption>{text.entries[index]}<span /></figcaption></a>
          </figure>)}
        </div>
      </section>

      <section id="contact" className={styles.studioCta} data-hg-reveal>
        <div><h2>{text.ctaTitle}</h2><p className={styles.ctaLead}>{text.footerLine}</p><a className={styles.outlineButton} href="mailto:hello@hollowgalegames.com">{text.cta}<span aria-hidden="true">→</span></a></div>
      </section>
    </main>
    <StudioFooter language={language} />
  </div>;
};

const StudioFooter = ({ language }: { language: Language }) => {
  const text = copy[language].studio;
  return <footer className={styles.studioFooter}><small>© Hollowgale Games</small><nav><a href="/hollowgalegames#game">{text.nav.games}</a><a href="/hollowgalegames#studio">{text.nav.studio}</a><a href={JOURNAL_PATH}>{text.nav.journal}</a><a href="/hollowgalegames#contact">{text.nav.contact}</a></nav></footer>;
};

const JournalRoute = ({ slug }: { slug?: string }) => {
  const { language, setLanguage } = useLanguage();
  useReveal();
  return <div className={styles.hollowgaleSite}>
    <a className={styles.skipLink} href="#journal-content">{language === "en" ? "Skip to content" : "İçeriğe geç"}</a>
    <StudioHeader language={language} setLanguage={setLanguage} docked journal />
    {slug ? <JournalArticlePage language={language} slug={slug} /> : <JournalPage language={language} />}
    <StudioFooter language={language} />
  </div>;
};

const GameHeader = ({ language, setLanguage }: { language: Language; setLanguage: (value: Language) => void }) => {
  const text = copy[language].game;
  return <header className={styles.gameHeader}>
    <a href="/hollowgalegames/mansionoffates"><GameTitle compact /></a>
    <nav><a href="#game-top">{text.nav.game}</a><a href="#mansion">{text.nav.mansion}</a><a href="#gallery">{text.nav.gallery}</a></nav>
    <LanguageSwitch language={language} setLanguage={setLanguage} />
    <a className={styles.wishlist} href="#wishlist">{text.wishlist}</a>
  </header>;
};

const GamePage = () => {
  const { language, setLanguage } = useLanguage();
  const text = copy[language].game;
  useReveal();
  useEffect(() => { document.title = "Mansion of Fates · Hollowgale Games"; }, []);

  const gallery = [
    { image: "library.png", title: text.gallery[0] },
    { image: "dining.png", title: text.gallery[1] },
    { image: "corridor.png", title: text.gallery[2] },
  ];

  return <div className={`${styles.hollowgaleSite} ${styles.gameSite}`}>
    <GameHeader language={language} setLanguage={setLanguage} />
    <main>
      <section id="game-top" className={styles.gameHero}>
        <img src={`${ASSET}/mansion-hero.png`} alt="Mansion of Fates under a moonlit sky" />
        <div className={styles.gameHeroCopy}>
          <GameTitle />
          <p>{text.tagline}</p>
          <div><a className={styles.outlineButton} href="#trailer"><span aria-hidden="true">▶</span>{text.trailer}</a><a className={`${styles.outlineButton} ${styles.primaryButton}`} href="#wishlist">{text.wishlist}</a></div>
        </div>
        <div className={styles.secretPlaque}><svg viewBox="0 0 100 150" aria-hidden="true"><path d="M8 22 50 5l42 17v120H8Z" fill="#17201c" stroke="#95733f" strokeWidth="2" /><path d="M15 27 50 12l35 15v108H15Z" fill="none" stroke="#665735" /></svg><p>{text.secret}</p></div>
      </section>

      <section id="gallery" className={styles.gameGallery} data-hg-reveal>
        <header><span /><h1>{text.sectionTitle}</h1><span /></header>
        <div>{gallery.map((item) => <figure key={item.image}><img src={`${ASSET}/${item.image}`} alt={item.title} loading="lazy" /><figcaption>{item.title}</figcaption></figure>)}</div>
      </section>

      <section id="mansion" className={styles.gameFeature} data-hg-reveal>
        <img src={`${ASSET}/salon.png`} alt="A candlelit room inside the mansion" loading="lazy" />
        <div><KeyMark /><h2>{text.stepInside}</h2><p>{text.explore}</p><a className={styles.outlineButton} href="#gallery">{text.seeGallery}<span aria-hidden="true">→</span></a></div>
        <img className={styles.featureStillLife} src={`${ASSET}/mansion-still-life.png`} alt="" loading="lazy" />
      </section>
    </main>
    <footer className={styles.gameFooter}><GameTitle compact /><nav><a href="#game-top">{text.nav.game}</a><a href="#mansion">{text.nav.mansion}</a><a href="#gallery">{text.nav.gallery}</a><a href="/hollowgalegames">{text.backStudio}</a></nav><p>{text.footerLine}</p></footer>
  </div>;
};

const HollowgaleRouter = () => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === JOURNAL_PATH) return <JournalRoute />;
  if (path.startsWith(`${JOURNAL_PATH}/`)) return <JournalRoute slug={path.slice(JOURNAL_PATH.length + 1)} />;
  return path === "/hollowgalegames/mansionoffates" ? <GamePage /> : <StudioPage />;
};

export default HollowgaleRouter;
