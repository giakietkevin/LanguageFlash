import { notFound } from "next/navigation";
import { RevealObserver } from "@/components/Reveal";
import { FaqCards, LanguageIndex, PathAccordion, PlacementShowcase } from "@/components/site/Interactive";
import { Band, Cta, Details, Free, Hero, SiteFooter } from "@/components/site/Sections";
import { getDict, isLocale } from "@/i18n";
import { stagger } from "@/lib/stagger";
import "./site.css";

export default async function Landing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  return (
    <div className="site" id="top">
      <a className="skip-link" href="#try">
        {t.common.skipToContent}
      </a>
      <main>
        <Hero t={t} locale={locale} />

        <section className="path wrap" id="path" aria-labelledby="path-title">
          <div className="grid12 path-intro">
            <h2 className="h2" id="path-title" data-reveal>
              {t.landing.path.title}
            </h2>
            <p data-reveal style={stagger(1)}>
              {t.landing.path.body}
            </p>
          </div>
          <PathAccordion />
        </section>

        <Details t={t} locale={locale} />
        <Band t={t} locale={locale} />
        <PlacementShowcase />
        <LanguageIndex />
        <Free t={t} locale={locale} />

        <section className="faq wrap" id="faq" aria-labelledby="faq-title">
          <div className="grid12">
            <div className="faq-inner">
              <h2 className="h2" id="faq-title" data-reveal>
                {t.landing.faq.title}
              </h2>
              <FaqCards />
            </div>
          </div>
        </section>

        <Cta t={t} locale={locale} />
      </main>
      <SiteFooter t={t} locale={locale} />
      <RevealObserver />
    </div>
  );
}
