import { CSSProperties, useEffect } from "react";
import { Language } from "./content";
import { formatPostDate, journalCopy, journalPosts, JournalPost, JOURNAL_PATH, postUrl, readingMinutes } from "./journalContent";
import shared from "./styles.module.scss";
import styles from "./journal.module.scss";

const ASSET = "/hollowgale";
const Meta = ({ post, language, reading = false }: { post: JournalPost; language: Language; reading?: boolean }) => (
  <p className={styles.meta}><time dateTime={post.date}>{formatPostDate(post.date, language)}</time><span aria-hidden="true">·</span>{post.category[language]}{reading && <><span aria-hidden="true">·</span>{readingMinutes(post, language)} {journalCopy[language].minutes}</>}</p>
);

export const JournalClosing = ({ language }: { language: Language }) => {
  const text = journalCopy[language];
  return <section className={styles.journalClosing}><div><p className={shared.sectionLabel}>{text.label}</p><h2>{text.closing}</h2><p>{text.closingLead}</p><a href="/hollowgalegames/mansionoffates" className={shared.outlineButton}>{text.discover}<span aria-hidden="true">→</span></a></div></section>;
};

export const JournalPage = ({ language }: { language: Language }) => {
  const text = journalCopy[language];
  const featured = journalPosts[0];
  useEffect(() => { document.title = `${text.title.replace("\n", " ")} · Hollowgale Games`; }, [text.title]);
  return <main id="journal-content" className={styles.journalPage}>
    <section className={styles.journalHero}>
      <img src={`${ASSET}/journal-study-v1.png`} alt="" />
      <div><p className={shared.sectionLabel}>{text.label}</p><h1>{text.title.split("\n").map(line => <span key={line}>{line}</span>)}</h1><p className={styles.heroLead}>{text.lead}</p><a className={styles.latestLink} href="#featured-note">{text.latest}<span aria-hidden="true">↓</span></a></div>
    </section>
    <section id="featured-note" className={styles.featuredPost}>
      <div><p className={shared.sectionLabel}>{text.featured}</p><h2><a href={postUrl(featured)}>{featured.title[language]}</a></h2><p className={styles.featuredLead}>{featured.description[language]}</p><Meta post={featured} language={language} reading /><a className={shared.outlineButton} href={postUrl(featured)}>{text.read}<span aria-hidden="true">→</span></a></div>
      <a className={styles.featuredImage} href={postUrl(featured)} aria-label={featured.title[language]}><img src={`${ASSET}/${featured.image}`} alt={featured.title[language]} loading="lazy" /></a>
    </section>
    <section className={styles.recentNotes}>
      <header><h2>{text.recent}</h2><span aria-hidden="true" /></header>
      <div className={styles.notesGrid}>{journalPosts.slice(1).map((post, index) => <article key={post.slug} className={styles.noteCard} data-hg-reveal>
        <a className={styles.cardImage} href={postUrl(post)} aria-label={post.title[language]}><img src={`${ASSET}/${post.image}`} alt={post.title[language]} loading="lazy" /></a>
        <div className={styles.cardMeta}><span>{String(index + 1).padStart(2, "0")} /</span><Meta post={post} language={language} /></div>
        <h3><a href={postUrl(post)}>{post.title[language]}</a></h3><p>{post.description[language]}</p><a className={styles.readLink} href={postUrl(post)}>{text.continue}<span aria-hidden="true">→</span></a>
      </article>)}</div>
    </section>
    <JournalClosing language={language} />
  </main>;
};

const ArticleFigure = ({ image, caption, className = "" }: { image: string; caption: string; className?: string }) => (
  <figure className={`${styles.articleFigure} ${className}`}><img src={`${ASSET}/${image}`} alt={caption} loading="lazy" /><figcaption>{caption}</figcaption></figure>
);

export const JournalArticlePage = ({ language, slug }: { language: Language; slug: string }) => {
  const post = journalPosts.find(item => item.slug === slug);
  const text = journalCopy[language];
  useEffect(() => { document.title = `${post ? post.title[language] : text.notFound} · Hollowgale Games`; }, [post, language, text.notFound]);
  if (!post) return <main id="journal-content" className={styles.missingPost}><p className={shared.sectionLabel}>404 / {text.label}</p><h1>{text.notFound}</h1><p>{text.notFoundLead}</p><a href={JOURNAL_PATH} className={shared.outlineButton}>{text.back}<span aria-hidden="true">→</span></a></main>;
  const exterior = post.slug === "mansion-exterior";
  const next = journalPosts[(journalPosts.indexOf(post) + 1) % journalPosts.length];
  return <main id="journal-content" className={styles.articlePage}>
    <article>
      <header className={`${styles.articleHero} ${exterior ? styles.exteriorHero : ""}`}>
        <img src={`${ASSET}/${post.image}`} alt="" />
        <div><a className={styles.breadcrumb} href={JOURNAL_PATH}>{language === "en" ? "Development journal" : "Geliştirme günlüğü"}</a><p className={shared.sectionLabel}>{post.category[language]}</p><h1>{post.title[language]}</h1><p className={styles.articleDeck}>{post.description[language]}</p><Meta post={post} language={language} reading /></div>
      </header>
      <div className={styles.articlePaper}>
        <p className={styles.imageCaption}>{post.title[language]}</p>
        <p className={styles.articleIntro}>{post.intro[language]}</p>
        {post.sections.map((section, index) => <div key={section.title.en}>
          {index === 1 && <aside className={styles.quoteBand}><blockquote>“{post.quote[language]}”</blockquote></aside>}
          {exterior && index === 2 && <section className={styles.architectureDetails}>
            <div><h2>{text.detailsTitle}</h2><p>{text.detailsBody}</p></div>
            <div className={styles.detailGrid}>{text.details.map((detail, detailIndex) => <figure key={detail}><figcaption><span>{String(detailIndex + 1).padStart(2, "0")}</span> / {detail}</figcaption><div className={`${styles.detailCrop} ${styles[`crop${detailIndex}`]}`} role="img" aria-label={detail} /></figure>)}</div>
          </section>}
          <section className={`${styles.articleSection} ${index % 2 === 0 ? styles.imageRight : styles.imageLeft}`}>
            <div className={styles.sectionCopy}><h2>{section.title[language]}</h2><span className={styles.goldRule} aria-hidden="true" /><p>{section.body[language]}</p></div>
            <div><ArticleFigure image={section.image} caption={section.caption[language]} />{exterior && index === 1 && <div className={styles.materialPalette}><h3>{text.palette}</h3>{["#657a83", "#17202b", "#94703e"].map((colour, i) => <div key={colour}><span style={{ "--swatch": colour } as CSSProperties} /><p>{text.paletteNames[i]}</p></div>)}</div>}</div>
          </section>
        </div>)}
        {exterior && <section className={`${styles.articleSection} ${styles.imageRight} ${styles.finalSection}`}><div className={styles.sectionCopy}><h2>{text.finalTitle}</h2><span className={styles.goldRule} aria-hidden="true" /><p>{text.finalBody}</p></div><ArticleFigure image={post.image} caption={post.title[language]} /></section>}
        <footer className={styles.articleCredits}><p>{text.author}<span aria-hidden="true">·</span>{text.authorRole}</p><a className={styles.backLink} href={JOURNAL_PATH}><span aria-hidden="true">←</span>{text.back}</a></footer>
      </div>
    </article>
    <section className={styles.nextPost}><img src={`${ASSET}/${next.image}`} alt="" loading="lazy" /><div><p className={shared.sectionLabel}>{text.next}</p><h2><a href={postUrl(next)}>{next.title[language]}</a></h2><p>{next.description[language]}</p><a href={postUrl(next)} className={shared.outlineButton}>{text.read}<span aria-hidden="true">→</span></a></div></section>
    <JournalClosing language={language} />
  </main>;
};
