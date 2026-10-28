"use client";

import type { Card } from "@/lib/types";
import { speak } from "@/lib/speech";
import { useI18n } from "./I18nProvider";

export function Term({ card, withRuby }: { card: Card; withRuby: boolean }) {
  if (card.ruby && withRuby) {
    return (
      <span lang={card.lang}>
        {card.ruby.map(([base, rt]) => (
          <ruby key={base}>
            {base}
            <rt>{rt}</rt>
          </ruby>
        ))}
      </span>
    );
  }
  return <span lang={card.lang}>{card.term}</span>;
}

/**
 * One flashcard, two faces stacked in one grid cell so the card is as tall as its longer face.
 * The reading (IPA) shows on the front for alphabetic languages; Pinyin and Furigana are the
 * answer for Chinese and Japanese, so they wait for the back.
 */
export function Flashcard({
  card,
  flipped,
  onFlip,
  tab,
}: {
  card: Card;
  flipped: boolean;
  onFlip: () => void;
  tab?: React.ReactNode;
}) {
  const { locale, t } = useI18n();
  const readingOnFront = card.lang === "en" || card.lang === "fr";

  return (
    <article className="fc" data-ui data-flipped={flipped || undefined} aria-live="polite">
      {tab && <div className="fc-tabs">{tab}</div>}
      <div className="fc-inner">
        <div className="fc-face fc-front" aria-hidden={flipped}>
          <p className="fc-pos">{card.pos}</p>
          <p className="fc-term">
            <Term card={card} withRuby={false} />
          </p>
          {readingOnFront && <p className="fc-reading">{card.reading}</p>}
          <div className="fc-actions">
            <button type="button" className="fc-btn fc-btn-primary" onClick={onFlip} tabIndex={flipped ? -1 : 0}>
              {t.common.flip}
            </button>
            <SpeakButton text={card.term} lang={card.speechLang} hidden={flipped} />
          </div>
        </div>

        <div className="fc-face fc-back" aria-hidden={!flipped}>
          <div className="fc-back-head">
            <p className="fc-term fc-term-small">
              <Term card={card} withRuby />
            </p>
            {!card.ruby && <p className="fc-reading">{card.reading}</p>}
            <SpeakButton text={card.term} lang={card.speechLang} hidden={!flipped} />
          </div>
          <p className="fc-meaning">{card.meaning[locale]}</p>
          <div className="fc-example">
            <p lang={card.lang} className="fc-example-line">
              {card.example}
              <button
                type="button"
                className="fc-inline-speak"
                aria-label={t.common.listen}
                tabIndex={flipped ? 0 : -1}
                onClick={() => speak(card.example, card.speechLang, 0.95)}
              >
                <SpeakerIcon />
              </button>
            </p>
            <p className="fc-example-meaning">{card.exampleMeaning[locale]}</p>
            {card.context && (
              <p className="fc-context">
                {t.card.from}: {card.context[locale]}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function SpeakButton({ text, lang, hidden }: { text: string; lang: string; hidden: boolean }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      className="fc-btn fc-speak"
      onClick={() => speak(text, lang, 0.9)}
      aria-label={t.common.listen}
      title={t.common.listen}
      tabIndex={hidden ? -1 : 0}
    >
      <SpeakerIcon />
    </button>
  );
}

export function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 7h3l4-3.5v11L6 11H3z" fill="currentColor" />
      <path d="M12.5 6.2a4 4 0 0 1 0 5.6M14.6 4.2a7 7 0 0 1 0 9.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
