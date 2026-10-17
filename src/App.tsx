import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { chapters, sequence, site, type Photo, type Row } from './content';
import imagesJson from './images.json';

type Meta = { slug: string; w: number; h: number; widths: number[]; color: string };
const images = imagesJson as Record<string, Meta>;
const meta = (file: string) => {
  const m = images[file];
  if (!m) throw new Error(`Missing image ${file} — run npm run images`);
  return m;
};
const ratio = (file: string) => meta(file).w / meta(file).h;
const indexOf = new Map(sequence.map((p, i) => [p.file, i]));
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const pad = (n: number) => String(n).padStart(2, '0');
const MOBILE = '(max-width: 700px)';
const BASE = import.meta.env.BASE_URL;

/** Runs a DOM update inside a View Transition when the browser supports it. */
function withTransition(update: () => void) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    update();
    return null;
  }
  return document.startViewTransition(() => flushSync(update));
}

function Img({ photo, sizes, eager }: { photo: Photo; sizes: string; eager?: boolean }) {
  const m = meta(photo.file);
  const set = (ext: string) => m.widths.map((w) => `${BASE}img/${m.slug}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={`${BASE}img/${m.slug}-${m.widths.at(-1)}.webp`}
        srcSet={set('webp')}
        sizes={sizes}
        width={m.w}
        height={m.h}
        alt={photo.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        style={{ backgroundColor: m.color }}
        ref={(el) => { if (el?.complete && el.naturalWidth) el.classList.add('loaded'); }}
        onLoad={(e) => e.currentTarget.classList.add('loaded')}
      />
    </picture>
  );
}

type Open = (i: number, from?: HTMLElement | null) => void;

function Figure({ photo, sizes, onOpen, style }: { photo: Photo; sizes: string; onOpen: Open; style?: CSSProperties }) {
  const i = indexOf.get(photo.file)!;
  return (
    <figure className="figure reveal" style={style}>
      <button className="photo" data-i={i} onClick={(e) => onOpen(i, e.currentTarget.querySelector('img'))}>
        <Img photo={photo} sizes={sizes} />
      </button>
      <figcaption>
        <span>{pad(i + 1)}</span>
        {photo.caption}
      </figcaption>
    </figure>
  );
}

function RowView({ row, onOpen }: { row: Row; onOpen: Open }) {
  const { layout, photos } = row;
  if (layout === 'row') {
    // Justified row: each photo's flex-grow is its aspect ratio, so heights match without cropping.
    // Width is capped so the shortest original is never upscaled.
    const sum = photos.reduce((s, p) => s + ratio(p.file), 0);
    const minH = Math.min(...photos.map((p) => meta(p.file).h));
    return (
      <div className="row" style={{ maxWidth: `calc(min(${Math.round(minH * sum)}px, ${(84 * sum).toFixed(1)}svh) + ${photos.length - 1} * var(--gap))` }}>
        {photos.map((p) => {
          const r = ratio(p.file);
          return (
            <Figure key={p.file} photo={p} onOpen={onOpen}
              sizes={`${MOBILE} 86vw, ${Math.round((88 * r) / sum)}vw`}
              style={{ flexGrow: r }} />
          );
        })}
      </div>
    );
  }
  const p = photos[0];
  const m = meta(p.file);
  return (
    <div className={`single ${layout}`}>
      <Figure photo={p} onOpen={onOpen}
        sizes={layout === 'large' ? `${MOBILE} 100vw, min(88vw, ${m.w}px)` : `${MOBILE} 74vw, 38vw`}
        style={{ ['--w' as string]: `${m.w}px`, ['--r' as string]: ratio(p.file) }} />
    </div>
  );
}

function Hero({ onOpen }: { onOpen: Open }) {
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const img = ref.current?.querySelector('img');
    if (img?.complete) setReady(true);
    img?.addEventListener('load', () => setReady(true));
    const t = setTimeout(() => setReady(true), 1800); // never hold the page hostage to a slow network
    return () => clearTimeout(t);
  }, []);
  const r = ratio(site.hero.file);
  return (
    <section className={`hero${ready ? ' ready' : ''}`} data-bg={site.night.bg} data-fg={site.night.fg} data-label="">
      <p className="hero-meta">
        <span>{site.discipline}</span>
        <span>
          {sequence.length} photographs in {chapters.length} chapters
        </span>
      </p>
      <h1 className="hero-name">
        {site.name.split(' ').map((w, i) => (
          <span key={w} style={{ ['--d' as string]: `${0.5 + i * 0.12}s` }}>
            <span>{w}</span>
          </span>
        ))}
      </h1>
      <div className="hero-image" ref={ref} style={{ ['--r' as string]: r }}>
        <button className="photo" data-i={0} onClick={(e) => onOpen(0, e.currentTarget.querySelector('img'))}>
          <Img photo={site.hero} eager sizes={`${MOBILE} 100vw, calc(86vh * ${r.toFixed(3)})`} />
        </button>
      </div>
      <a className="hero-cue" href={`#${chapters[0].id}`}>
        Begin <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

function Lightbox({ index, setIndex, dialogRef }: {
  index: number;
  setIndex: (i: number) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const n = sequence.length;
  const photo = sequence[index];
  const go = (d: number) => withTransition(() => setIndex((index + d + n) % n));
  const close = () => {
    const target = document.querySelector<HTMLElement>(`.photo[data-i="${index}"] img`);
    const t = withTransition(() => {
      dialogRef.current?.close();
      // Land the visitor where they left off in the sequence.
      target?.scrollIntoView({ block: 'center', behavior: 'instant' });
      if (target) target.style.viewTransitionName = 'photo';
    });
    const clear = () => target && (target.style.viewTransitionName = '');
    t ? t.finished.finally(clear) : clear();
  };

  // Warm neighbours so next/previous feel instant.
  useEffect(() => {
    if (!dialogRef.current?.open) return;
    for (const d of [1, -1]) {
      const m = meta(sequence[(index + d + n) % n].file);
      new Image().src = `${BASE}img/${m.slug}-${m.widths.at(-1)}.avif`;
    }
  }, [index, n, dialogRef]);

  const start = useRef<number | null>(null);
  const m = meta(photo.file);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label="Photograph viewer"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      onPointerDown={(e) => (start.current = e.clientX)}
      onPointerUp={(e) => {
        if (start.current === null || e.pointerType === 'mouse') return;
        const dx = e.clientX - start.current;
        start.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="lb-top">
        <span className="lb-count">
          {pad(index + 1)} <i>/</i> {n}
        </span>
        <button className="lb-btn" onClick={close} autoFocus>Close</button>
      </div>
      <div className="lb-stage" onClick={(e) => e.target === e.currentTarget && close()}>
        <button className="lb-image" onClick={() => go(1)} aria-label="Next photograph" style={{ ['--w' as string]: `${m.w}px`, ['--h' as string]: `${m.h}px` }}>
          <Img key={photo.file} photo={photo} eager sizes={`min(92vw, ${m.w}px)`} />
        </button>
      </div>
      <div className="lb-bottom">
        <button className="lb-btn" onClick={() => go(-1)}>Previous</button>
        <p className="lb-caption">
          {photo.chapter}
          {photo.caption && <> — {photo.caption}</>}
        </p>
        <button className="lb-btn" onClick={() => go(1)}>Next</button>
      </div>
    </dialog>
  );
}

function IndexView({ dialogRef, onOpen }: { dialogRef: React.RefObject<HTMLDialogElement | null>; onOpen: Open }) {
  const groups = [{ title: 'Opening', id: '', photos: [site.hero] }, ...chapters.map((c) => ({ ...c, photos: c.rows.flatMap((r) => r.photos) }))];
  return (
    <dialog ref={dialogRef} className="index" aria-label="Index of all photographs" onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}>
      <div className="index-head">
        <h2>Index</h2>
        <button className="lb-btn" onClick={() => dialogRef.current?.close()}>Close</button>
      </div>
      {groups.map((g, gi) => (
        <section key={g.title} className="index-group">
          <h3>
            {gi > 0 && <span>{ROMAN[gi - 1]}</span>}
            {g.id ? <a href={`#${g.id}`} onClick={() => dialogRef.current?.close()}>{g.title}</a> : g.title}
          </h3>
          <ul>
            {g.photos.map((p) => {
              const i = indexOf.get(p.file)!;
              return (
                <li key={p.file} style={{ ['--r' as string]: ratio(p.file) }}>
                  <button className="photo" onClick={(e) => onOpen(i, e.currentTarget.querySelector('img'))}>
                    <Img photo={p} sizes="160px" />
                  </button>
                  <span>{pad(i + 1)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </dialog>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [label, setLabel] = useState('');
  const lightbox = useRef<HTMLDialogElement>(null);
  const indexDialog = useRef<HTMLDialogElement>(null);

  const open: Open = (i, from) => {
    if (from) from.style.viewTransitionName = 'photo';
    withTransition(() => {
      if (from) from.style.viewTransitionName = '';
      indexDialog.current?.close();
      setIndex(i);
      if (!lightbox.current?.open) lightbox.current?.showModal();
    });
  };

  useEffect(() => {
    // Reveal photographs as they enter the viewport.
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), reveal.unobserve(e.target))),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

    // The page takes on the light of whichever chapter is at the centre of the screen.
    const root = document.documentElement.style;
    const tone = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        root.setProperty('--bg', el.dataset.bg!);
        root.setProperty('--fg', el.dataset.fg!);
        setLabel(el.dataset.label ?? '');
      }),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-bg]').forEach((el) => tone.observe(el));
    return () => { reveal.disconnect(); tone.disconnect(); };
  }, []);

  const contactHref = site.email.includes('@') ? `mailto:${site.email}` : undefined;

  return (
    <>
      <a className="skip" href={`#${chapters[0].id}`}>Skip to the work</a>
      <header className="masthead">
        <a href="#top" className="wordmark">{site.name}</a>
        <nav aria-label="Primary">
          <button onClick={() => indexDialog.current?.showModal()}>Index</button>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <p className={`chapter-label${label ? ' on' : ''}`} aria-hidden="true">{label}</p>

      <main id="top">
        <Hero onOpen={open} />

        {chapters.map((c, ci) => {
          const count = c.rows.reduce((s, r) => s + r.photos.length, 0);
          return (
            <section key={c.id} id={c.id} className="chapter" aria-labelledby={`${c.id}-t`}
              data-bg={c.tone.bg} data-fg={c.tone.fg} data-label={`${ROMAN[ci]} — ${c.title}`}>
              <header className="chapter-head reveal">
                <span className="chapter-no">Chapter {ROMAN[ci]}</span>
                <h2 id={`${c.id}-t`}>{c.title}</h2>
                <span className="chapter-count">{pad(count)} photographs</span>
              </header>
              {c.rows.map((r, ri) => <RowView key={ri} row={r} onOpen={open} />)}
            </section>
          );
        })}

        <section id="about" className="closing" data-bg={site.night.bg} data-fg={site.night.fg} data-label="">
          <div className="about reveal">
            <h2>About</h2>
            <div>{site.about.map((p) => <p key={p}>{p}</p>)}</div>
          </div>
          <div id="contact" className="contact reveal">
            <h2>Contact</h2>
            <a className="contact-big" href={contactHref}>{site.email}</a>
            <a className="contact-big" href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</a>
            {site.instagram && <a href={`https://instagram.com/${site.instagram}`}>Instagram</a>}
          </div>
          <footer>
            <span>© {new Date().getFullYear()} {site.name}</span>
            <a href="#top">Back to the beginning ↑</a>
          </footer>
        </section>
      </main>

      <Lightbox index={index} setIndex={setIndex} dialogRef={lightbox} />
      <IndexView dialogRef={indexDialog} onOpen={open} />
    </>
  );
}
