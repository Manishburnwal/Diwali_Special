import * as React from "react";

/*
 * Aperture Carousel — a full-bleed image carousel where the next picture opens
 * through a circular iris that grows from wherever you click, with a hairline
 * ring riding its edge.
 */

function coverRadius(x, y, w, h) {
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y));
}

function wrap(i, n) {
  return n ? ((i % n) + n) % n : 0;
}

function sideOf(x, w) {
  return x >= w / 2 ? 1 : -1;
}

function pad2(n) {
  return n < 10 ? "0" + n : String(n);
}

const PALETTES = {
  dawn: { top: "#e7b7a5", bottom: "#f8e8d6", sun: "#fff4df", far: "#d2b2bb", near: "#3a2a3b", mist: "255,240,232" },
  alpine: { top: "#7ea5c8", bottom: "#e3ecf2", sun: "#ffffff", far: "#a9bfd0", near: "#1c3044", mist: "236,244,250" },
  dusk: { top: "#2a2450", bottom: "#ef8d60", sun: "#ffd9a6", far: "#93607c", near: "#18121f", mist: "255,196,160" },
  mist: { top: "#c4d0cb", bottom: "#eef1ec", sun: "#ffffff", far: "#aebcb5", near: "#2c3a33", mist: "246,248,245" },
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexRgb(h) {
  const v = parseInt(h.replace("#", ""), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function mixRgb(a, b, t) {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",") + ")";
}

function paintLandscape(seed, palette, w = 1600, h = 1000) {
  if (typeof document === "undefined") return "";
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) return "";
  const P = PALETTES[palette] ?? PALETTES.dawn;
  const r = mulberry32(seed * 104729 + 7);

  const sky = g.createLinearGradient(0, 0, 0, h * 0.72);
  sky.addColorStop(0, P.top);
  sky.addColorStop(1, P.bottom);
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);
  const sx = w * (0.22 + r() * 0.56);
  const sy = h * (0.26 + r() * 0.16);
  const halo = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.45);
  halo.addColorStop(0, "rgba(" + hexRgb(P.sun).join(",") + ",.85)");
  halo.addColorStop(0.08, "rgba(" + hexRgb(P.sun).join(",") + ",.55)");
  halo.addColorStop(1, "rgba(" + hexRgb(P.sun).join(",") + ",0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, w, h);
  g.fillStyle = P.sun;
  g.beginPath();
  g.arc(sx, sy, h * 0.045, 0, Math.PI * 2);
  g.fill();

  const layers = 5;
  for (let L = 0; L < layers; L++) {
    const k = L / (layers - 1);
    const base = h * (0.42 + k * 0.4);
    const amp = h * (0.07 + k * 0.1);
    const ph = [r(), r(), r(), r()].map((v) => v * Math.PI * 2);
    const fr = [1.3 + r(), 3.1 + r() * 2, 7 + r() * 4, 17 + r() * 8];
    const ridge = (x) => {
      const u = x / w;
      return (
        base -
        amp *
          (0.55 * Math.sin(u * fr[0] + ph[0]) +
            0.28 * Math.sin(u * fr[1] + ph[1]) +
            0.12 * Math.abs(Math.sin(u * fr[2] + ph[2])) +
            0.05 * Math.sin(u * fr[3] + ph[3]))
      );
    };
    const mist = g.createLinearGradient(0, base - amp * 1.4, 0, base + amp * 0.4);
    mist.addColorStop(0, "rgba(" + P.mist + ",0)");
    mist.addColorStop(1, "rgba(" + P.mist + "," + (0.55 - k * 0.35).toFixed(2) + ")");
    g.fillStyle = mist;
    g.fillRect(0, base - amp * 1.4, w, amp * 1.8);
    const body = g.createLinearGradient(0, base - amp, 0, h);
    body.addColorStop(0, mixRgb(P.far, P.near, Math.pow(k, 1.3)));
    body.addColorStop(1, mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.18)));
    g.fillStyle = body;
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) g.lineTo(x, ridge(x));
    g.lineTo(w, h);
    g.closePath();
    g.fill();
    if (L >= layers - 2) {
      g.fillStyle = mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.08));
      for (let x = 0; x < w; x += 7 + r() * 9) {
        if (r() < 0.35) continue;
        const y = ridge(x) + 2;
        const th = h * (0.025 + r() * 0.035) * (0.6 + k);
        const tw = th * 0.32;
        g.beginPath();
        g.moveTo(x, y - th);
        g.lineTo(x + tw, y);
        g.lineTo(x - tw, y);
        g.closePath();
        g.fill();
      }
    }
  }

  const vig = g.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h / 2, w * 0.78);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,.32)");
  g.fillStyle = vig;
  g.fillRect(0, 0, w, h);
  const grain = g.getImageData(0, 0, w, h);
  const d = grain.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (r() - 0.5) * 14;
    d[i] += v;
    d[i + 1] += v;
    d[i + 2] += v;
  }
  g.putImageData(grain, 0, 0);
  return c.toDataURL("image/jpeg", 0.88);
}

function useSlideImages(slides) {
  return React.useMemo(() => {
    return slides.map((s, i) => s.image || paintLandscape(s.seed ?? i + 1, s.palette || "dawn"));
  }, [slides]);
}

const AP_CSS = `
.ap-root {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #080808;
  color: var(--ap-ink, #D4AF65);
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  outline: none;
}
.ap-root:focus-visible {
  box-shadow: inset 0 0 0 2px var(--ap-ink, #D4AF65);
}
@media (hover: hover) and (pointer: fine) {
  .ap-root[data-lens='1'] {
    cursor: none;
  }
}
.ap-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.ap-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  display: block;
  pointer-events: none;
}
.ap-ring {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  border: 1px solid var(--ap-ink, #D4AF65);
  pointer-events: none;
  opacity: 0;
  box-shadow: 0 0 25px rgba(212, 175, 101, 0.4);
}
.ap-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0) 35%);
  pointer-events: none;
}
.ap-text {
  position: absolute;
  left: clamp(14px, 3.5vw, 36px);
  bottom: clamp(14px, 2.5vh, 28px);
  pointer-events: none;
  z-index: 25;
  max-width: 65%;
}
.ap-line {
  display: block;
  overflow: hidden;
}
.ap-line > span {
  display: block;
  animation: ap-rise .9s cubic-bezier(.2,.8,.2,1) both;
}
.ap-title {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: clamp(11px, 1.2vw, 15px);
  line-height: 1.2;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #F4D28C;
  text-shadow: 0 2px 10px rgba(0,0,0,0.95);
}
.ap-cap {
  margin-top: 2px;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(12px, 1.1vw, 14px);
  line-height: 1.2;
  color: #E0CFBC;
  text-shadow: 0 2px 8px rgba(0,0,0,0.95);
}
.ap-cap > span {
  animation-delay: .08s;
}
.ap-count {
  position: absolute;
  right: clamp(14px, 3.5vw, 36px);
  bottom: clamp(14px, 2.5vh, 28px);
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .2em;
  color: #D4AF65;
  pointer-events: none;
  z-index: 25;
  text-shadow: 0 2px 10px rgba(0,0,0,0.95);
}
.ap-track {
  position: absolute;
  left: clamp(14px, 3.5vw, 36px);
  right: clamp(14px, 3.5vw, 36px);
  bottom: 6px;
  height: 2px;
  background: rgba(212, 175, 101, 0.25);
  pointer-events: none;
  z-index: 25;
}
.ap-fill {
  height: 100%;
  background: linear-gradient(90deg, #D4AF65, #FFE3A0);
  box-shadow: 0 0 10px rgba(212, 175, 101, 0.8);
  transform-origin: left;
  transform: scaleX(0);
}
.ap-fill[data-run='1'] {
  animation: ap-fill var(--ap-dur) linear forwards;
}
.ap-root[data-paused='1'] .ap-fill {
  animation-play-state: paused;
}
.ap-lens {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  border-radius: 50%;
  border: 1px solid #D4AF65;
  display: grid;
  place-items: center;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: #FFE3A0;
  pointer-events: none;
  opacity: 0;
  transition: opacity .25s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(33, 16, 24, 0.5);
  box-shadow: 0 0 20px rgba(212, 175, 101, 0.35);
  z-index: 30;
}
.ap-lens[data-on='1'] {
  opacity: 1;
}
.ap-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@keyframes ap-rise {
  from { transform: translateY(105%); }
  to { transform: none; }
}
@keyframes ap-fill {
  to { transform: scaleX(1); }
}
@media (prefers-reduced-motion: reduce) {
  .ap-line > span { animation: none; }
}
`;

function ApertureCarousel({
  slides = [],
  height = "100svh",
  autoplay = 6000,
  duration = 1100,
  ink = "#D4AF65",
  plainCursor = false,
  onChange,
  className = "",
  style = {},
  ariaLabel = "Festival of Lights Carousel",
  children,
}) {
  const n = slides.length;
  const srcs = useSlideImages(slides);
  const [index, setIndex] = React.useState(0);
  const [incoming, setIncoming] = React.useState(null);
  const [paused, setPaused] = React.useState(false);
  const rootRef = React.useRef(null);
  const layerRef = React.useRef(null);
  const ringRef = React.useRef(null);
  const lensRef = React.useRef(null);
  const busy = React.useRef(false);
  const down = React.useRef(null);
  const [lensOn, setLensOn] = React.useState(false);
  const [lensLabel, setLensLabel] = React.useState("Next");

  const go = React.useCallback(
    (dir, x, y) => {
      const root = rootRef.current;
      if (!root || busy.current || n < 2) return;
      const w = root.clientWidth;
      const h = root.clientHeight;
      busy.current = true;
      setIncoming({
        to: wrap(index + dir, n),
        x: x ?? (dir > 0 ? w * 0.85 : w * 0.15),
        y: y ?? h * 0.5,
        id: Date.now(),
      });
    },
    [index, n]
  );

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const layer = layerRef.current;
    const ring = ringRef.current;
    if (!incoming || !root || !layer) return;
    const w = root.clientWidth;
    const h = root.clientHeight;
    const R = coverRadius(incoming.x, incoming.y, w, h);
    const at = " at " + incoming.x + "px " + incoming.y + "px)";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = "cubic-bezier(.7,0,.2,1)";
    const anims = [];

    if (reduce) {
      anims.push(layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "both" }));
    } else {
      anims.push(
        layer.animate(
          [{ clipPath: "circle(0px" + at }, { clipPath: "circle(" + R + "px" + at }],
          { duration, easing: ease, fill: "both" }
        )
      );
      const img = layer.firstElementChild;
      if (img) {
        anims.push(
          img.animate(
            [{ transform: "scale(1.18)" }, { transform: "scale(1)" }],
            { duration: duration * 1.25, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
          )
        );
      }
      if (ring) {
        ring.style.width = ring.style.height = R * 2 + "px";
        anims.push(
          ring.animate(
            [
              { transform: "translate(" + (incoming.x - R) + "px," + (incoming.y - R) + "px) scale(0)", opacity: 1 },
              { opacity: 1, offset: 0.7 },
              { transform: "translate(" + (incoming.x - R) + "px," + (incoming.y - R) + "px) scale(1)", opacity: 0 },
            ],
            { duration, easing: ease, fill: "both" }
          )
        );
      }
    }

    let done = false;
    anims[0].onfinish = () => {
      done = true;
      setIndex(incoming.to);
      setIncoming(null);
      busy.current = false;
    };

    return () => {
      if (!done) busy.current = false;
      anims.forEach((a) => a.cancel());
    };
  }, [incoming, duration]);

  React.useEffect(() => {
    onChange?.(index);
  }, [index, onChange]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let seen = true;
    const sync = () => setPaused(!seen || document.hidden);
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      sync();
    });
    io.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const local = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width };
  };

  const onMove = (e) => {
    if (e.pointerType !== "mouse" || plainCursor) return;
    const p = local(e);
    const lens = lensRef.current;
    if (lens) lens.style.transform = "translate(" + p.x + "px," + p.y + "px)";
    const label = sideOf(p.x, p.w) > 0 ? "Next" : "Prev";
    if (label !== lensLabel) setLensLabel(label);
    if (!lensOn) setLensOn(true);
  };

  const onDown = (e) => {
    down.current = { x: e.clientX, y: e.clientY };
  };

  const onUp = (e) => {
    const start = down.current;
    down.current = null;
    if (!start) return;
    const p = local(e);
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
      go(dx < 0 ? 1 : -1, p.x, p.y);
    } else if (Math.abs(dx) < 8) {
      go(sideOf(p.x, p.w), p.x, p.y);
    }
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  };

  const shown = incoming ? incoming.to : index;
  const s = slides[shown] || {};
  const runFill = autoplay > 0 && n > 1 && !incoming;

  return (
    <div
      ref={rootRef}
      className={["ap-root", className].filter(Boolean).join(" ")}
      style={{ height, "--ap-ink": ink, "--ap-dur": autoplay + "ms", ...style }}
      data-paused={paused ? "1" : "0"}
      data-lens={plainCursor ? "0" : "1"}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerMove={onMove}
      onPointerLeave={() => setLensOn(false)}
      onPointerDown={onDown}
      onPointerUp={onUp}
    >
      <style>{AP_CSS}</style>

      {/* Current base layer */}
      <div className="ap-layer">
        {srcs[index] ? (
          <img
            className="ap-img"
            src={srcs[index]}
            alt={slides[index]?.alt || slides[index]?.title || ""}
            style={{ objectPosition: slides[index]?.position || "center" }}
            draggable={false}
          />
        ) : null}
      </div>

      {/* Incoming iris reveal layer */}
      {incoming ? (
        <div ref={layerRef} className="ap-layer" key={incoming.id} style={{ clipPath: "circle(0px at 0 0)" }}>
          {srcs[incoming.to] ? (
            <img
              className="ap-img"
              src={srcs[incoming.to]}
              alt=""
              style={{ objectPosition: slides[incoming.to]?.position || "center" }}
              draggable={false}
            />
          ) : null}
        </div>
      ) : null}

      <div ref={ringRef} className="ap-ring" aria-hidden="true" />
      <div className="ap-shade" aria-hidden="true" />

      {/* Slide Title & Caption */}
      <div className="ap-text" key={"t" + shown} aria-hidden="true">
        {s.title ? (
          <span className="ap-line ap-title">
            <span>{s.title}</span>
          </span>
        ) : null}
        {s.caption ? (
          <span className="ap-line ap-cap">
            <span>{s.caption}</span>
          </span>
        ) : null}
      </div>

      {/* Counter */}
      <div className="ap-count" aria-hidden="true">
        {pad2(shown + 1)} / {pad2(n)}
      </div>

      {/* Progress track */}
      <div className="ap-track" aria-hidden="true">
        <div
          key={"f" + index}
          className="ap-fill"
          data-run={runFill ? "1" : "0"}
          onAnimationEnd={() => go(1)}
        />
      </div>

      {/* Custom Lens Cursor */}
      {!plainCursor && (
        <div ref={lensRef} className="ap-lens" data-on={lensOn ? "1" : "0"} aria-hidden="true">
          {lensLabel}
        </div>
      )}

      {/* Embedded Children Overlay (e.g. Hero greeting, CTA buttons) */}
      {children}

      <div className="ap-sr" aria-live="polite">
        {"Slide " + (shown + 1) + " of " + n + (s.title ? ": " + s.title : "")}
      </div>
    </div>
  );
}

export default ApertureCarousel;
