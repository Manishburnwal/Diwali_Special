import {
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useSpring,
    useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Heart, Gem, Clover, Gift } from "lucide-react";

// 8 Festive visual cards (Manish's photos + authentic Diwali motifs)
import manishCelebration from "../../assets/images/slider/manish-celebration.jpg";
import manishPortrait from "../../assets/images/slider/manish-portrait.jpg";
import manishCoral from "../../assets/images/slider/manish-coral.jpg";
import manishOutdoor from "../../assets/images/slider/manish-outdoor.jpg";
import diyaSvg from "../../assets/images/diya/diya.svg";
import mandalaSvg from "../../assets/images/rangoli/mandala.svg";
import sweetsSvg from "../../assets/images/gallery/sweets.svg";
import lanternsSvg from "../../assets/images/decorations/lanterns.svg";

// Even index -> left wing (photos), odd index -> right wing (motifs)
const FESTIVE_ITEMS = [
    { src: manishCelebration, alt: "Manish at Diwali Night", label: "Celebration" },
    { src: diyaSvg, alt: "Sacred Diya", label: "Light" },
    { src: manishPortrait, alt: "Manish Kumar", label: "Happiness" },
    { src: sweetsSvg, alt: "Festive Sweets", label: "Prosperity" },
    { src: manishCoral, alt: "Festive Moments", label: "Good Luck" },
    { src: mandalaSvg, alt: "Golden Rangoli", label: "Harmony" },
    { src: manishOutdoor, alt: "Manish Kumar", label: "Togetherness" },
    { src: lanternsSvg, alt: "Diwali Lanterns", label: "Joy" },
];

const BLESSINGS = [
    { icon: Heart, label: "Happiness" },
    { icon: Gem, label: "Prosperity" },
    { icon: Clover, label: "Good Luck" },
    { icon: Gift, label: "Togetherness" },
];

const SPRING_CONFIG = { stiffness: 60, damping: 20, mass: 0.5 };

/*
 * One place for all spacing / sizing so cards never collide with the text.
 *  - compact (phones, small tablets): left-wing photos fly to a TOP row,
 *    right-wing motifs fly to a BOTTOM row, text sits between them.
 *  - wide (laptops): two arched columns on the left and right edges,
 *    text sits in the middle.
 */
function getMetrics(stage) {
    const { width, compact } = stage;

    if (compact) {
        const cardW = width < 520 ? 74 : width < 700 ? 96 : 120;
        return {
            compact,
            cardW,
            cardH: Math.round(cardW * 1.4),
            padTop: 28,
            padBottom: 76, // room for the status pill
            padSide: 18,
            gapToText: 24,
        };
    }

    const cardW = Math.min(158, Math.max(115, width * 0.105));
    return {
        compact,
        cardW,
        cardH: Math.round(cardW * 1.38),
        padTop: 40,
        padBottom: 88, // room for the status pill
        padSide: 32,
        gapToText: 0,
    };
}

function CurtainCard({ item, index, total, progress, pointer, isSpreadActive, stage }) {
    const perWing = total / 2; // 4
    const isLeft = index % 2 === 0;
    const wingIndex = Math.floor(index / 2); // 0..3
    const norm = wingIndex / (perWing - 1) - 0.5; // -0.5 .. 0.5
    const sideMult = isLeft ? -1 : 1;

    const m = getMetrics(stage);
    const { width, height } = stage;

    let targetX;
    let targetY;
    let targetRotate;

    if (m.compact) {
        // Two neat rows: photos on top, motifs at the bottom
        const xStep = Math.min(
            (width - 2 * m.padSide - m.cardW) / (perWing - 1),
            m.cardW * 1.3
        );
        targetX = (wingIndex - (perWing - 1) / 2) * xStep;
        targetY = isLeft
            ? -height / 2 + m.padTop + m.cardH / 2
            : height / 2 - m.padBottom - m.cardH / 2;
        targetRotate = norm * 8;
    } else {
        // Two arched columns hugging the left & right edges
        const maxX = width / 2 - m.cardW / 2 - m.padSide;
        const depth = Math.min(46, width * 0.035);
        const span = height - m.padTop - m.padBottom - m.cardH;
        const shiftY = (m.padTop - m.padBottom) / 2;

        targetX = sideMult * (maxX - (1 - Math.cos(norm * Math.PI)) * depth);
        targetY = norm * span + shiftY;
        targetRotate = sideMult * (norm * 16);
    }

    const initialX = sideMult * (wingIndex * 5);
    const initialY = norm * 12;
    const initialRotate = sideMult * (wingIndex * 3);

    const translate = useTransform([progress, pointer.x, pointer.y], ([p, px, py]) => {
        const easeP = 1 - Math.pow(1 - p, 3);

        const tx = initialX + (targetX - initialX) * easeP;
        const ty = initialY + (targetY - initialY) * easeP;

        const maxParallaxX = m.compact ? 8 : 22;
        const maxParallaxY = m.compact ? 6 : 18;

        const dx = tx + px * (isLeft ? -maxParallaxX : maxParallaxX) * easeP;
        const dy = ty + py * maxParallaxY * easeP;

        return `calc(-50% + ${dx}px) calc(-50% + ${dy}px)`;
    });

    const rotate = useTransform(
        progress,
        [0, 0.45, 1],
        [initialRotate, isLeft ? -12 : 12, targetRotate]
    );

    const scale = useTransform(progress, [0, 0.5, 1], [1, 0.97, 1]);

    return (
        <motion.div
            className="absolute left-1/2 top-1/2 will-change-transform cursor-pointer select-none"
            style={{
                width: m.cardW,
                height: m.cardH,
                zIndex: isLeft ? index + 1 : total - index,
                translate,
                rotate,
                scale,
            }}
            whileHover={
                isSpreadActive
                    ? { scale: 1.1, zIndex: 60, rotate: 0, transition: SPRING_CONFIG }
                    : { scale: 0.98 }
            }
            whileTap={{ scale: 1.04, zIndex: 60 }}
        >
            {/* Gold gradient frame */}
            <div style={{ padding: 3 }} className="group relative h-full w-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F4D28C] via-[#D4AF65] to-[#8a6a2c] shadow-[0_14px_40px_rgba(0,0,0,0.7)] hover:shadow-[0_0_38px_rgba(255,157,50,0.55)] transition-shadow duration-300">
                <div className="relative h-full w-full overflow-hidden rounded-[0.6rem] sm:rounded-[0.85rem] bg-[#1C0E18]">
                    <img
                        src={item.src}
                        alt={item.alt}
                        draggable={false}
                        className="h-full w-full object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* soft shine sweep on hover */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {/* Label */}
                    <div style={{ padding: "24px 8px 8px" }} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-center">
                        <span className="text-[9px] sm:text-[11px] font-heading font-semibold tracking-[0.18em] uppercase text-[#F4D28C] drop-shadow-md">
                            {item.label}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function GiftCard() {
    const stageRef = useRef(null);
    const reduce = useReducedMotion();

    const [stage, setStage] = useState({ width: 1200, height: 720, compact: false });

    // 0 = closed curtain in the centre, 1 = parted wings
    const rawProgress = useMotionValue(0);
    const progress = useSpring(rawProgress, SPRING_CONFIG);

    const [isSpreadActive, setIsSpreadActive] = useState(false);
    useMotionValueEvent(progress, "change", (p) => setIsSpreadActive(p > 0.65));

    // Pointer parallax
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const pointerX = useSpring(rawX, SPRING_CONFIG);
    const pointerY = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;

        const updateDimensions = () => {
            const rect = el.getBoundingClientRect();
            setStage({
                width: rect.width,
                height: rect.height,
                compact: rect.width < 900,
            });
        };

        updateDimensions();
        const observer = new ResizeObserver(updateDimensions);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Wheel handling directly on the stage
    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;

        const onWheel = (e) => {
            const current = rawProgress.get();
            const delta = e.deltaY * 0.002;
            const next = Math.min(1, Math.max(0, current + delta));

            if ((e.deltaY > 0 && current < 1) || (e.deltaY < 0 && current > 0)) {
                e.preventDefault();
                rawProgress.set(next);
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [rawProgress]);

    const handlePointerMove = (e) => {
        if (reduce) return;
        const rect = e.currentTarget.getBoundingClientRect();
        rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
        rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    };

    const handlePointerLeave = () => {
        rawX.set(0);
        rawY.set(0);
    };

    const toggleCurtain = () => {
        rawProgress.set(rawProgress.get() > 0.5 ? 0 : 1);
    };

    const textY = useTransform(progress, [0.25, 0.85], [30, 0]);
    const textOpacity = useTransform(progress, [0.3, 0.8], [0, 1]);
    const lineScale = useTransform(progress, [0.35, 0.85], [0, 1]);

    // Keep the headline inside the free area between the cards
    const m = getMetrics(stage);
    const textPaddingTop = m.compact ? m.padTop + m.cardH + m.gapToText : m.padTop;
    const textPaddingBottom = m.compact ? m.padBottom + m.cardH + m.gapToText : m.padBottom;
    const textSidePadding = m.compact ? 20 : m.padSide + m.cardW + 56;

    return (
        <div
            ref={stageRef}
            onClick={toggleCurtain}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative w-full h-[780px] lg:h-[720px] overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] border border-[#D4AF65]/30 bg-[linear-gradient(180deg,#1b0e16_0%,#0e0809_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(244,210,140,0.18)] cursor-pointer select-none"
        >
            {/* Inner hairline frame */}
            <div className="pointer-events-none absolute inset-2.5 sm:inset-3 rounded-[1.35rem] sm:rounded-[1.8rem] border border-[#D4AF65]/15" />

            {/* Corner ornaments */}
            <Sparkles size={16} className="pointer-events-none absolute left-5 top-5 text-[#D4AF65]/70" />
            <Sparkles size={16} className="pointer-events-none absolute right-5 top-5 text-[#D4AF65]/70" />
            <Sparkles size={16} className="pointer-events-none absolute left-5 bottom-5 text-[#D4AF65]/70" />
            <Sparkles size={16} className="pointer-events-none absolute right-5 bottom-5 text-[#D4AF65]/70" />

            {/* Gold stardust pattern */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#D4AF65_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-[0.18]" />

            {/* Warm centre aura */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[620px] h-[420px] sm:h-[620px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,157,50,0.22)_0%,_rgba(212,175,101,0.08)_45%,_transparent_75%)] blur-3xl" />

            {/* Centre headline, unveiled by the curtain */}
            <div
                className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
                style={{
                    paddingTop: textPaddingTop,
                    paddingBottom: textPaddingBottom,
                    paddingLeft: textSidePadding,
                    paddingRight: textSidePadding,
                }}
            >
                <motion.div
                    className="flex w-full max-w-xl flex-col items-center text-center"
                    style={{ y: textY, opacity: textOpacity }}
                >
                    <div style={{ padding: "6px 16px" }} className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65]/45 bg-black/55 backdrop-blur-md mb-4 shadow-[0_0_18px_rgba(212,175,101,0.25)]">
                        <Sparkles size={12} className="text-[#FF9D32] animate-pulse" />
                        <span className="text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-[0.28em] text-[#D4AF65]">
                            A Special Diwali Surprise
                        </span>
                        <Sparkles size={12} className="text-[#FF9D32] animate-pulse" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] font-heading text-[#FFF8E7] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                        Warmth, Joy &{" "}
                        <span className="gold-gradient italic font-serif block drop-shadow-[0_0_35px_rgba(255,160,50,0.85)]">
                            Abundance
                        </span>
                    </h2>

                    <motion.div
                        style={{ scaleX: lineScale }}
                        className="my-5 h-[1.5px] w-24 sm:w-32 bg-gradient-to-r from-transparent via-[#D4AF65] to-transparent origin-center shadow-[0_0_12px_#D4AF65]"
                    />

                    <p className="font-elegant italic text-base sm:text-lg lg:text-xl text-[#EADBCA] leading-relaxed max-w-[34ch] drop-shadow-md">
                        &ldquo;May this festival open new doors of prosperity, smiles, and countless beautiful memories.&rdquo;
                    </p>

                    <p className="mt-4 text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#FFE3A0]">
                        — With Love, Manish Kumar
                    </p>

                    {/* Mini tokens of blessings */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6">
                        {BLESSINGS.map(({ icon: Icon, label }) => (
                            <span
                                key={label}
                                style={{ padding: "6px 14px" }}
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF65]/40 bg-black/55 backdrop-blur-md text-xs text-[#FFE3A0] shadow-md"
                            >
                                <Icon size={12} className="text-[#D4AF65]" /> {label}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bilateral curtain cards */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
                {FESTIVE_ITEMS.map((item, i) => (
                    <CurtainCard
                        key={i}
                        item={item}
                        index={i}
                        total={FESTIVE_ITEMS.length}
                        progress={progress}
                        pointer={{ x: pointerX, y: pointerY }}
                        isSpreadActive={isSpreadActive}
                        stage={stage}
                    />
                ))}
            </div>

            {/* Bottom status pill */}
            <div style={{ padding: "10px 20px" }} className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2.5 whitespace-nowrap rounded-full bg-black/75 backdrop-blur-md border border-[#D4AF65]/50 shadow-2xl">
                <span
                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                        isSpreadActive
                            ? "bg-emerald-400 shadow-[0_0_10px_#34d399]"
                            : "bg-[#FF9D32] animate-ping"
                    }`}
                />
                <span className="tracking-[0.18em] uppercase text-[10px] sm:text-[11px] font-semibold text-[#F4D28C]">
                    {isSpreadActive ? "Tap anywhere to close curtain" : "Tap or scroll to unveil your gifts"}
                </span>
            </div>
        </div>
    );
}