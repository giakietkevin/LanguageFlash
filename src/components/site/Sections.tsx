import Image from "next/image";
import Link from "next/link";
import type { Dict } from "@/i18n";
import credits from "../../../public/assets/credits.json";
import type { Locale } from "@/lib/types";
import { LocaleSwitch } from "../LocaleSwitch";
import { Mark } from "../Mark";
import { stagger } from "@/lib/stagger";
import { ThemeToggle } from "../ThemeToggle";
import { TryCard } from "./TryCard";

type P = { t: Dict; locale: Locale };
const to = (locale: Locale, path: string) => (path.startsWith("#") ? path : `/${locale}/${path}`);

export function SiteHeader({ t, locale }: P) {
  return (
    <header className="site-header">
      <div className="left">
        <LocaleSwitch className="chip-btn" />
        <ThemeToggle className="chip-btn" />
      </div>
      <Link href={`/${locale}`} className="mark" aria-label="LanguageFlash">
        <Mark size={32} />
      </Link>
      <Link href={to(locale, "login")} className="right chip-btn">
        {t.common.signIn}
      </Link>
    </header>
  );
}

export function Hero({ t, locale }: P) {
  const n = t.landing.nav;
  // Back to front; each strip is a folder whose tab opens its section.
  const folders: [string, string, string][] = [
    [n.path, "#path", "var(--f1)"],
    [n.details, "#details", "var(--f2)"],
    [n.placement, "#placement", "var(--f3)"],
    [n.languages, "#languages", "var(--f4)"],
  ];
  const xs = ["6%", "58%", "30%", "74%"];
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <SiteHeader t={t} locale={locale} />
        <div className="hero-title">
          <h1 id="hero-title">LanguageFlash</h1>
          <p>{t.landing.sub}</p>
        </div>
        <nav className="folders" aria-label={t.landing.nav.path}>
          {folders.map(([label, href, c], i) => (
            <a key={href} href={href} className="folder" style={{ "--c": c, "--x": xs[i] } as React.CSSProperties}>
              <span className="folder-tab">{label}</span>
            </a>
          ))}
        </nav>
      </section>
      <section className="front" id="try" aria-labelledby="try-title">
        <span className="folder-tab" style={{ "--x": "44%", left: "44%" } as React.CSSProperties} aria-hidden="true">
          {t.landing.tryTab}
        </span>
        <div className="front-grid">
          <div>
            <h2 id="try-title">{t.landing.tryTitle}</h2>
            <p className="lede">{t.landing.tryBody}</p>
            <div className="actions">
              <Link href={to(locale, "onboarding")} className="btn btn-inverse">
                {t.common.start}
              </Link>
              <Link href={to(locale, "placement")} className="link">
                {t.landing.tryLink}
              </Link>
            </div>
          </div>
          <TryCard />
        </div>
      </section>
    </>
  );
}

export function Details({ t }: P) {
  const d = t.landing.details;
  const cap = (k: keyof typeof d.tiles) => (
    <div className="tile-cap">
      <h3>{d.tiles[k][0]}</h3>
      <p>{d.tiles[k][1]}</p>
    </div>
  );
  return (
    <section className="details" id="details" aria-labelledby="details-title">
      <div className="board">
        <div className="tile tg t-head tile-head" data-reveal>
          <h2 id="details-title">{d.title}</h2>
        </div>
        <div className="tile tf t-speed" data-reveal style={stagger(1)}>
          <div className="frag frag-speed num" data-ui aria-hidden="true">
            <span>0.75x</span>
            <span data-on>1x</span>
            <span>1.25x</span>
          </div>
          {cap("speed")}
        </div>
        <div className="tile tl t-grades" data-reveal>
          <div className="frag frag-grades" data-ui aria-hidden="true">
            <span>
              {t.grades.again}
              <small>10 min</small>
            </span>
            <span>
              {t.grades.hard}
              <small>3 d</small>
            </span>
            <span>
              {t.grades.good}
              <small>6 d</small>
            </span>
            <span>
              {t.grades.easy}
              <small>8 d</small>
            </span>
          </div>
          {cap("grades")}
        </div>
        <div className="tile tn t-furi" data-reveal style={stagger(1)}>
          <div className="frag frag-furi" data-ui aria-hidden="true" lang="ja">
            <ruby>
              約<rt>やく</rt>
            </ruby>
            <ruby>
              束<rt>そく</rt>
            </ruby>
          </div>
          {cap("furigana")}
        </div>
        <div className="tile tg t-pinyin" data-reveal style={stagger(2)}>
          <div className="frag frag-pinyin" data-ui aria-hidden="true" lang="zh">
            yǐjīng
            <small>已经</small>
          </div>
          {cap("pinyin")}
        </div>
        <div className="tile tf t-break" data-reveal>
          <div className="frag frag-break" data-ui aria-hidden="true" lang="en">
            <span>
              I<small>{d.breakdownRoles[0]}</small>
            </span>
            <span>
              have sent<small>{d.breakdownRoles[1]}</small>
            </span>
            <span>
              the invoice<small>{d.breakdownRoles[2]}</small>
            </span>
          </div>
          {cap("breakdown")}
        </div>
        <div className="tile td t-streak" data-reveal style={stagger(1)}>
          <div className="frag frag-streak num" data-ui aria-hidden="true">
            12
          </div>
          {cap("streak")}
        </div>
        <div className="tile tl t-offline" data-reveal style={stagger(2)}>
          <div className="frag frag-offline" data-ui aria-hidden="true">
            <span className="switch-ui" />
            {d.offlineWord}
          </div>
          {cap("offline")}
        </div>
        <div className="tile tn t-bi" data-reveal>
          <div className="frag frag-bi" data-ui aria-hidden="true">
            <p lang="en">We’ve postponed the meeting.</p>
            <p lang="vi">{d.bilingualLine}</p>
          </div>
          {cap("bilingual")}
        </div>
        <div className="tile tf t-theme" data-reveal style={stagger(1)}>
          <div className="frag frag-theme" data-ui aria-hidden="true">
            <span>{t.common.themeLight}</span>
            <span data-on>{t.common.themeDark}</span>
          </div>
          {cap("theme")}
        </div>
      </div>
    </section>
  );
}

export function Band({ t }: P) {
  return (
    <section className="band wrap" aria-label={t.landing.band.alt}>
      <figure data-reveal>
        <span className="band-label">Bibliothèque Mazarine</span>
        <div className="shape">
          <Image
            src="/assets/salle-des-catalogues-de-la-bibliotheque-mazarine.jpg"
            alt={t.landing.band.alt}
            width={1920}
            height={1440}
            sizes="100vw"
          />
        </div>
        <figcaption>{t.landing.band.caption}</figcaption>
      </figure>
    </section>
  );
}

export function Free({ t, locale }: P) {
  const f = t.landing.free;
  return (
    <section className="free" id="free" aria-label={`${f.editor.name}, ${f.learner.name}`}>
      <div className="field field-a">
        <h2 data-reveal>{f.editor.name}</h2>
        <p className="who" data-reveal style={stagger(1)}>
          {f.editor.who}
        </p>
        <p className="incl" data-reveal style={stagger(2)}>
          {f.editor.includes}
        </p>
        <div className="field-foot">
          <p className="price num">
            {f.editor.price}
            <small>{f.editor.period}</small>
          </p>
          <Link href={to(locale, "admin")} className="btn">
            {f.editor.action}
          </Link>
        </div>
      </div>
      <div className="field field-b">
        <h2 data-reveal>{f.learner.name}</h2>
        <p className="who" data-reveal style={stagger(1)}>
          {f.learner.who}
        </p>
        <p className="incl" data-reveal style={stagger(2)}>
          {f.learner.includes}
        </p>
        <div className="field-foot">
          <p className="price num">
            {f.learner.price}
            <small>{f.learner.period}</small>
          </p>
          <Link href={to(locale, "onboarding")} className="btn btn-inverse">
            {t.common.start}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Cta({ t, locale }: P) {
  return (
    <section className="cta wrap" aria-label={t.common.start}>
      <Link
        href={to(locale, "onboarding")}
        // The verb is fitted by hand per language so it spans the band on one line.
        style={(locale === "vi" ? { "--fit": "25vw", "--fit-phone": "25vw" } : { "--fit": "32vw", "--fit-phone": "32vw" }) as React.CSSProperties}
      >
        <span className="cta-top">
          <span className="cta-line">{t.landing.cta.line}</span>
          <svg className="cta-arrow" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M12 36L36 12M16 12h20v20" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </span>
        <span className="cta-word">{t.landing.cta.word}</span>
      </Link>
    </section>
  );
}

type Credit = { title: string; creator: string; license: string; page: string };

export function SiteFooter({ t, locale }: P) {
  const word = "LanguageFlash";
  const heights = [100, 72, 88, 64, 94, 78, 60, 86, 100, 70, 90, 66, 82];
  const colours = ["var(--ink)", "#2d6342", "#f4d96c", "#8fb38f", "var(--ink)", "#2d6342", "#cfe0c8", "var(--ink)", "#f4d96c", "#2d6342", "#8fb38f", "var(--ink)", "#cfe0c8"];
  const list = credits as Credit[];
  return (
    <footer className="site-footer">
      <div className="blocks" aria-label="LanguageFlash" role="img">
        {word.split("").map((ch, i) => (
          <span
            key={i}
            className="block"
            aria-hidden="true"
            style={{ "--h": `${heights[i]}%`, "--bc": colours[i], color: colours[i] === "var(--ink)" ? "var(--bg)" : "#133621" } as React.CSSProperties}
          >
            {ch}
          </span>
        ))}
      </div>
      <div className="grid12 footer-cols">
        <nav className="footer-links" aria-label="Footer">
          {t.landing.footer.cols.map((col) => (
            <div key={col.title}>
              <h3>{col.title}</h3>
              <ul style={{ padding: 0 }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={to(locale, href)}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="footer-contact">
          <p>{t.landing.footer.contactNote}</p>
          <a href={`mailto:${t.landing.footer.contact}`}>{t.landing.footer.contact}</a>
        </div>
      </div>
      <p className="credits">
        {t.landing.footer.credits}:{" "}
        {list.map((c, i) => (
          <span key={c.page}>
            <a href={c.page} rel="noopener">
              {c.title}
            </a>{" "}
            ({c.creator}, {c.license}){i < list.length - 1 ? "; " : "."}
          </span>
        ))}
      </p>
      <div className="footer-last">
        <span>© 2026 LanguageFlash</span>
        <a href="#top" className="btn">
          {t.landing.footer.top}
        </a>
      </div>
    </footer>
  );
}
