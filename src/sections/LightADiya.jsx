import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, RotateCcw } from "lucide-react";
import bgVideo from "../assets/videos/7029600-uhd_4096_2160_30fps.mp4";

const TOTAL_DIYAS = 8;

const diyaBlessings = [
    { title: "Peace", subtitle: "Tranquility & Calm", meaning: "For harmony in life" },
    { title: "Health", subtitle: "Vitality & Wellness", meaning: "For lifelong strength" },
    { title: "Wealth", subtitle: "Abundance & Growth", meaning: "For flourishing success" },
    { title: "Wisdom", subtitle: "Clarity & Knowledge", meaning: "For enlightened paths" },
    { title: "Joy", subtitle: "Laughter & Smiles", meaning: "For endless happiness" },
    { title: "Purity", subtitle: "Grace & Goodness", meaning: "For clean intentions" },
    { title: "Courage", subtitle: "Strength & Faith", meaning: "For fearless strides" },
    { title: "Love", subtitle: "Warmth & Affection", meaning: "For cherished bonds" },
];

function TraditionalDiyaItem({ index, lit, onToggle, blessing }) {
    return (
        <motion.button
            type="button"
            onClick={onToggle}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: "clamp(20px, 2.2vw, 30px) 16px clamp(18px, 2vw, 26px)" }}
            className={`group relative flex flex-col items-center justify-between overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-500 select-none cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF65] ${
                lit
                    ? "bg-gradient-to-b from-[#2a1322]/85 via-[#170b13]/80 to-[#0d070b]/85 backdrop-blur-md border-[#D4AF65]/80 shadow-[0_0_40px_rgba(255,157,50,0.28),_inset_0_1px_0_rgba(244,210,140,0.25)]"
                    : "bg-gradient-to-b from-[#150b11]/60 to-[#0a0508]/70 backdrop-blur-md border-[#D4AF65]/30 hover:border-[#D4AF65]/60 hover:shadow-[0_0_25px_rgba(212,175,101,0.15)]"
            }`}
            aria-pressed={lit}
            aria-label={`${lit ? "Extinguish" : "Light"} Diya ${index + 1}: ${blessing.title}`}
        >
            {/* Top gold hairline when lit */}
            <div
                className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D28C] to-transparent transition-opacity duration-500 ${
                    lit ? "opacity-100" : "opacity-0"
                }`}
            />

            {/* Index number */}
            <span
                className={`absolute left-4 top-3 font-heading text-[10px] tracking-[0.25em] transition-colors ${
                    lit ? "text-[#D4AF65]" : "text-[#D4AF65]/35"
                }`}
            >
                {String(index + 1).padStart(2, "0")}
            </span>

            {/* Ambient glow when lit */}
            {lit && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(255,157,50,0.32)_0%,_transparent_75%)]" />
            )}

            {/* Flame area */}
            <div className="relative flex h-28 w-24 items-end justify-center" style={{ marginBottom: 6 }}>
                <AnimatePresence>
                    {lit ? (
                        <motion.div
                            key="flame"
                            initial={{ opacity: 0, scale: 0.2, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.2, y: 15 }}
                            transition={{ duration: 0.35 }}
                            className="relative flex flex-col items-center"
                        >
                            <div className="pointer-events-none absolute -inset-4 rounded-full bg-[#FF9D32]/40 blur-xl" />
                            <div className="pointer-events-none absolute -inset-8 rounded-full bg-[#D4AF65]/20 blur-2xl" />

                            <motion.div
                                animate={{
                                    scaleX: [1, 0.9, 1.05, 0.95, 1],
                                    scaleY: [1, 1.08, 0.92, 1.05, 1],
                                    rotate: [-2, 2, -1, 1, 0],
                                }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative h-16 w-9 rounded-[50%_50%_40%_40%] bg-gradient-to-t from-[#FF6B00] via-[#FFB347] to-[#FFF9C4] shadow-[0_0_25px_#FF9D32]"
                            >
                                <div className="absolute bottom-1.5 left-1/2 h-8 w-3.5 -translate-x-1/2 rounded-full bg-white/95 blur-[1px]" />
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center" style={{ marginBottom: 8 }}>
                            <span className="h-3 w-1 rounded-full bg-[#6B5A4B]" />
                            <span
                                className="text-[9px] uppercase tracking-widest text-[#78695A] transition-colors group-hover:text-[#D4AF65]"
                                style={{ marginTop: 4 }}
                            >
                                Unlit
                            </span>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Clay diya */}
            <div className="relative flex h-12 w-28 items-center justify-center">
                <svg viewBox="0 0 160 70" className="h-auto w-full drop-shadow-md">
                    <defs>
                        <linearGradient id={`bowlGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={lit ? "#FFE3A0" : "#7A4B29"} />
                            <stop offset="40%" stopColor={lit ? "#C8872D" : "#4A2A16"} />
                            <stop offset="100%" stopColor={lit ? "#5B260E" : "#241108"} />
                        </linearGradient>
                    </defs>
                    <ellipse cx="80" cy="62" rx="55" ry="8" fill="#FF9D32" opacity={lit ? "0.35" : "0.08"} filter="blur(4px)" />
                    <path
                        d="M15 28 Q80 75 145 28 Q135 62 80 64 Q25 62 15 28Z"
                        fill={`url(#bowlGrad-${index})`}
                        stroke={lit ? "#F4D28C" : "#8A542B"}
                        strokeWidth="2.5"
                    />
                    <ellipse
                        cx="80"
                        cy="28"
                        rx="62"
                        ry="14"
                        fill={lit ? "#8A4519" : "#32190E"}
                        stroke={lit ? "#FFE3A0" : "#6A3F24"}
                        strokeWidth="2"
                    />
                    <path
                        d="M28 35 Q80 56 132 35"
                        fill="none"
                        stroke={lit ? "#FFF0C4" : "#55321B"}
                        strokeWidth="1.5"
                        opacity={lit ? "0.9" : "0.5"}
                    />
                </svg>
            </div>

            {/* Label & meaning */}
            <div
                className="relative w-full text-center border-t border-[#D4AF65]/15"
                style={{ marginTop: 22, paddingTop: 14 }}
            >
                <span
                    className={`block font-heading text-sm sm:text-base font-bold uppercase tracking-[0.18em] transition-colors ${
                        lit ? "text-[#FFF0C4]" : "text-[#D8C7B5]"
                    }`}
                >
                    {blessing.title}
                </span>
                <span
                    className={`block text-[10px] uppercase tracking-[0.2em] transition-colors ${
                        lit ? "text-[#FFB347] font-semibold" : "text-[#78695A] group-hover:text-[#D4AF65]"
                    }`}
                    style={{ marginTop: 4 }}
                >
                    {lit ? "✦ Illuminated" : "Tap to light"}
                </span>
                <span className="block font-elegant italic text-[12px] sm:text-[13px] text-[#B8A99A]" style={{ marginTop: 6 }}>
                    {blessing.meaning}
                </span>
            </div>
        </motion.button>
    );
}

function LightADiya() {
    const [litDiyas, setLitDiyas] = useState([0, 1, 2]);

    const litCount = litDiyas.length;
    const allLit = litCount === TOTAL_DIYAS;

    const toggleDiya = (index) => {
        setLitDiyas((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    // Play the (heavy 4K) background video only while the section is on screen
    const videoRef = useRef(null);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            },
            { threshold: 0.05 }
        );
        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    const lightAll = () => setLitDiyas(Array.from({ length: TOTAL_DIYAS }, (_, i) => i));
    const resetDiyas = () => setLitDiyas([]);

    const statusText =
        litCount === 0
            ? "Tap a diya to begin the ceremony"
            : allLit
              ? "The ceremony is complete"
              : `${TOTAL_DIYAS - litCount} more to complete the ceremony`;

    return (
        <section
            id="light-a-diya"
            className="relative isolate flex w-full flex-col items-center overflow-hidden bg-[#080808] scroll-mt-20"
            style={{
                paddingTop: "clamp(5rem, 8vw, 7rem)",
                paddingBottom: "clamp(5rem, 8vw, 7rem)",
                paddingLeft: "clamp(1rem, 3vw, 2rem)",
                paddingRight: "clamp(1rem, 3vw, 2rem)",
            }}
        >
            {/* Full-brightness festive video backdrop */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                >
                    <source src={bgVideo} type="video/mp4" />
                </video>

                {/* Light veil: keeps the video vivid while UI stays readable */}
                <div className="absolute inset-0 bg-black/30" />
                {/* Soft edge vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(8,8,8,0.55)_100%)]" />
                {/* Blend into neighbouring sections */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0d0709] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex w-full max-w-7xl flex-col items-center gap-10 sm:gap-12 lg:gap-14">
                {/* Header */}
                <div className="relative flex w-full flex-col items-center text-center">
                    {/* soft local shade behind the heading text only */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-[min(90%,760px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(8,8,8,0.6)_0%,_transparent_70%)] blur-xl" />
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/40 bg-black/50 backdrop-blur-md"
                        style={{ padding: "6px 18px", marginBottom: 20 }}
                    >
                        <Sparkles size={12} className="text-[#FF9D32] animate-pulse" />
                        <span className="font-heading text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D4AF65]">
                            A Sacred Festive Ceremony
                        </span>
                        <Sparkles size={12} className="text-[#FF9D32] animate-pulse" />
                    </div>

                    <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-[#FFF8E7] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                        Light a{" "}
                        <span className="gold-gradient italic font-serif drop-shadow-[0_0_35px_rgba(255,160,50,0.7)]">
                            Diya
                        </span>
                    </h2>

                    <div className="flex items-center gap-3" style={{ margin: "22px 0 18px" }}>
                        <span className="h-px w-14 sm:w-20 bg-gradient-to-r from-transparent to-[#D4AF65]" />
                        <Flame size={16} className="text-[#FF9D32]" />
                        <span className="h-px w-14 sm:w-20 bg-gradient-to-l from-transparent to-[#D4AF65]" />
                    </div>

                    <p className="max-w-2xl font-elegant text-lg sm:text-xl leading-relaxed text-[#F1E6D6] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                        Every flame carries a heartfelt wish. Tap individual diyas to illuminate peace,
                        health, prosperity, and happiness across your home.
                    </p>
                </div>

                {/* Illumination counter */}
                <div
                    className="flex w-full max-w-xl flex-col items-center rounded-3xl border border-[#D4AF65]/30 bg-gradient-to-b from-[#1b0e16]/70 to-[#0e0809]/75 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(244,210,140,0.15)]"
                    style={{ padding: "26px clamp(20px, 4vw, 40px) 24px" }}
                >
                    <div className="flex items-baseline justify-center gap-3">
                        <motion.span
                            key={litCount}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="font-heading text-5xl sm:text-6xl font-bold gold-gradient"
                        >
                            {litCount}
                        </motion.span>
                        <span className="font-elegant text-xl sm:text-2xl text-[#B8A99A]">
                            / {TOTAL_DIYAS} Diyas Illuminated
                        </span>
                    </div>

                    {/* 8 glowing segments */}
                    <div className="flex w-full gap-1.5 sm:gap-2" style={{ marginTop: 18 }}>
                        {Array.from({ length: TOTAL_DIYAS }).map((_, i) => (
                            <motion.span
                                key={i}
                                animate={{ opacity: i < litCount ? 1 : 0.35 }}
                                transition={{ duration: 0.35 }}
                                className={`h-2 flex-1 rounded-full ${
                                    i < litCount
                                        ? "bg-gradient-to-r from-[#D4AF65] via-[#F4D28C] to-[#FF9D32] shadow-[0_0_12px_rgba(212,175,101,0.8)]"
                                        : "bg-[#2a1722] border border-[#D4AF65]/20"
                                }`}
                            />
                        ))}
                    </div>

                    <p
                        className="font-heading text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D4AF65]/90"
                        style={{ marginTop: 14 }}
                    >
                        {statusText}
                    </p>
                </div>

                {/* 8 diyas */}
                <div className="grid w-full grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
                    {diyaBlessings.map((blessing, i) => (
                        <TraditionalDiyaItem
                            key={i}
                            index={i}
                            lit={litDiyas.includes(i)}
                            onToggle={() => toggleDiya(i)}
                            blessing={blessing}
                        />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={lightAll}
                        disabled={allLit}
                        style={{ padding: "14px 32px" }}
                        className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#D4AF65] via-[#F4D28C] to-[#D4AF65] text-xs font-semibold uppercase tracking-[2px] text-[#080808] shadow-[0_0_25px_rgba(212,175,101,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(255,157,50,0.85)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                        <Flame size={16} className="transition-transform group-hover:scale-110" />
                        <span>Light All 8 Diyas</span>
                    </button>

                    <button
                        type="button"
                        onClick={resetDiyas}
                        disabled={litCount === 0}
                        style={{ padding: "14px 28px" }}
                        className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF65]/50 bg-black/40 text-xs font-medium uppercase tracking-[2px] text-[#F4D28C] backdrop-blur-md transition-all duration-300 hover:border-[#D4AF65] hover:bg-[#D4AF65]/15 hover:shadow-[0_0_20px_rgba(212,175,101,0.3)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    >
                        <RotateCcw size={15} />
                        <span>Reset All</span>
                    </button>
                </div>

                {/* Celebration banner */}
                <AnimatePresence>
                    {allLit && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.6 }}
                            style={{ padding: "clamp(28px, 4vw, 44px) clamp(20px, 4vw, 48px)" }}
                            className="relative flex w-full max-w-3xl flex-col items-center overflow-hidden rounded-3xl border border-[#D4AF65]/80 bg-gradient-to-r from-[#211018] via-[#351A27] to-[#211018] text-center shadow-[0_0_60px_rgba(255,157,50,0.3),_0_0_25px_rgba(212,175,101,0.25)]"
                        >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,157,50,0.22)_0%,_transparent_70%)]" />
                            <div
                                className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF65]/20"
                                style={{ marginBottom: 14 }}
                            >
                                <Sparkles size={24} className="text-[#F4D28C] animate-spin" />
                            </div>
                            <h4 className="relative font-heading text-2xl sm:text-3xl font-bold gold-gradient" style={{ marginBottom: 10 }}>
                                A Thousand Wishes, One Eternal Light! ✨
                            </h4>
                            <p className="relative max-w-xl font-elegant italic text-lg sm:text-2xl leading-relaxed text-[#F8F0E3]">
                                &ldquo;All eight sacred diyas are glowing bright! May your life shine with peace,
                                health, wealth, and unconditional joy.&rdquo;
                            </p>
                            <p className="relative text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF65]" style={{ marginTop: 14 }}>
                                — Heartfelt Deepawali Greetings from Manish Kumar
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

export default LightADiya;